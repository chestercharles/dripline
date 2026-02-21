import { useState, useEffect, useRef } from 'react'
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Image,
	ActivityIndicator,
	Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useTheme } from '@/lib/theme'
import { Text, TextInput, Button, IconButton } from '@/components/ui'
import { DRIP_STATUSES } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'
import { identifyPlant } from '@/lib/ai'
import type { PlantIdentification } from '@/lib/ai'
import { useCreatePlant } from './hooks/useCreatePlant'
import { useYards } from './hooks/useYards'
import { useApiKey } from '@/features/settings/hooks/useApiKey'

type Step = 'camera' | 'photo_review' | 'identifying' | 'result' | 'manual'

const SUN_OPTIONS = [
	{ value: 'full_sun', label: 'Full Sun' },
	{ value: 'partial_sun', label: 'Part Sun' },
	{ value: 'partial_shade', label: 'Part Shade' },
	{ value: 'full_shade', label: 'Full Shade' },
] as const

function formatSunExposure(
	value: PlantIdentification['sunExposure'],
): string {
	return SUN_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function buildCareNotesString(id: PlantIdentification): string {
	const parts: string[] = []
	if (id.careNotes) parts.push(id.careNotes)
	if (id.droughtTolerance)
		parts.push(`Drought tolerance: ${id.droughtTolerance}`)
	if (id.heatTolerance) parts.push(`Heat tolerance: ${id.heatTolerance}`)
	if (id.matureHeight || id.matureWidth)
		parts.push(`Mature size: ${id.matureHeight} x ${id.matureWidth}`)
	if (id.growthRate) parts.push(`Growth rate: ${id.growthRate}`)
	if (id.bloomSeason)
		parts.push(
			`Blooms: ${id.bloomSeason}${id.bloomColor ? ` (${id.bloomColor})` : ''}`,
		)
	if (id.wildlifeValue) parts.push(`Wildlife: ${id.wildlifeValue}`)
	if (id.toxicity) parts.push(`Toxicity: ${id.toxicity}`)
	if (id.bestPlantingTime)
		parts.push(`Best planting time: ${id.bestPlantingTime}`)
	if (id.fertilizing) parts.push(`Fertilizing: ${id.fertilizing}`)
	if (id.nativeToSonoran) parts.push('Native to Sonoran Desert')
	if (id.commonProblems?.length)
		parts.push(`Common problems: ${id.commonProblems.join(', ')}`)
	return parts.join('\n')
}

export function CreatePlantScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()
	const createPlant = useCreatePlant()
	const { data: yards = [] } = useYards()
	const { data: openaiKey } = useApiKey('openai')
	const { data: anthropicKey } = useApiKey('anthropic')
	const aiProvider: 'openai' | 'anthropic' = openaiKey ? 'openai' : 'anthropic'
	const apiKey = openaiKey ?? anthropicKey

	const [step, setStep] = useState<Step>('camera')
	const [photoUri, setPhotoUri] = useState<string | null>(null)
	const [identification, setIdentification] =
		useState<PlantIdentification | null>(null)
	const [identifyError, setIdentifyError] = useState<string | null>(null)
	const [statusText, setStatusText] = useState('Identifying plant...')

	const [name, setName] = useState('')
	const [species, setSpecies] = useState('')
	const [wateringNeeds, setWateringNeeds] = useState('')
	const [careNotes, setCareNotes] = useState('')
	const [sunExposure, setSunExposure] =
		useState<PlantIdentification['sunExposure']>('full_sun')
	const [dripStatus, setDripStatus] = useState<DripStatus>('working')
	const [notes, setNotes] = useState('')

	const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		openCamera()
		return () => {
			if (statusTimerRef.current) clearTimeout(statusTimerRef.current)
		}
	}, [])

	const openCamera = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync()
		if (status !== 'granted') {
			setStep('manual')
			return
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ['images'],
			quality: 0.8,
			allowsEditing: false,
		})

		if (result.canceled) {
			router.back()
			return
		}

		const asset = result.assets[0]
		const resized = await ImageManipulator.manipulateAsync(
			asset.uri,
			[{ resize: { width: 1024 } }],
			{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
		)

		setPhotoUri(resized.uri)

		if (apiKey) {
			setStep('photo_review')
		} else {
			setStep('manual')
		}
	}

	const runIdentification = async () => {
		if (!photoUri || !apiKey) return

		setStep('identifying')
		setStatusText('Identifying plant...')

		statusTimerRef.current = setTimeout(() => {
			setStatusText('Looking up care info...')
		}, 2000)

		try {
			const id = await identifyPlant(photoUri, aiProvider, apiKey)
			setIdentification(id)
			setStep('result')
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		} catch {
			setIdentifyError(
				'Could not identify plant — fill in the details manually.',
			)
			setStep('manual')
		} finally {
			if (statusTimerRef.current) clearTimeout(statusTimerRef.current)
		}
	}

	const handleRetake = () => {
		setPhotoUri(null)
		setIdentification(null)
		setIdentifyError(null)
		openCamera()
	}

	const handleSave = async () => {
		const yardId = yards[0]?.id
		if (!yardId) return

		if (identification) {
			const wateringStr = [
				identification.wateringFrequency,
				identification.wateringDepth,
			]
				.filter(Boolean)
				.join('. ')

			await createPlant.mutateAsync({
				name: identification.name || 'Unknown Plant',
				species: identification.species || undefined,
				yardId,
				dripStatus: 'working',
				sunExposure: identification.sunExposure || undefined,
				wateringNeeds: wateringStr || undefined,
				soilType: identification.soilType || undefined,
				careNotes: buildCareNotesString(identification) || undefined,
				identifiedAt: new Date().toISOString(),
				heroPhotoPath: photoUri ?? undefined,
			})
		} else {
			await createPlant.mutateAsync({
				name: name.trim() || 'Unknown Plant',
				species: species.trim() || undefined,
				yardId,
				dripStatus,
				notes: notes.trim() || undefined,
				sunExposure: sunExposure || undefined,
				wateringNeeds: wateringNeeds.trim() || undefined,
				careNotes: careNotes.trim() || undefined,
				identifiedAt: undefined,
				heroPhotoPath: photoUri ?? undefined,
			})
		}

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		router.back()
	}

	// Step 1: Camera — no UI shown
	if (step === 'camera') {
		return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />
	}

	// Step 2: Photo review
	if (step === 'photo_review' && photoUri) {
		return (
			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				<Image
					source={{ uri: photoUri }}
					style={{ flex: 1 }}
					resizeMode="cover"
				/>
				<View
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						paddingBottom: insets.bottom + theme.spacing[4],
						paddingTop: theme.spacing[6],
						paddingHorizontal: theme.spacing[4],
						gap: theme.spacing[3],
						backgroundColor: 'rgba(0,0,0,0.5)',
					}}
				>
					<Button title="Looks good" onPress={runIdentification} size="lg" />
					<Button
						title="Retake"
						variant="ghost"
						onPress={handleRetake}
						style={{ opacity: 0.9 }}
					/>
				</View>
			</View>
		)
	}

	// Step 3: Identifying — full-screen photo with dark overlay
	if (step === 'identifying' && photoUri) {
		return (
			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				<Image
					source={{ uri: photoUri }}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
					resizeMode="cover"
				/>
				<View
					style={{
						flex: 1,
						backgroundColor: 'rgba(0,0,0,0.6)',
						alignItems: 'center',
						justifyContent: 'center',
						gap: theme.spacing[4],
					}}
				>
					<ActivityIndicator size="large" color={theme.colors.textInverse} />
					<Text
						variant="title3"
						color={theme.colors.textInverse}
						style={{ textAlign: 'center' }}
					>
						{statusText}
					</Text>
				</View>
			</View>
		)
	}

	// Step 4: Result — rich scrollable screen
	if (step === 'result' && identification && photoUri) {
		return (
			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{
						paddingBottom: insets.bottom + 80 + theme.spacing[4],
					}}
				>
					<View style={{ position: 'relative' }}>
						<Image
							source={{ uri: photoUri }}
							style={{
								width: '100%',
								height: 280,
								backgroundColor: theme.colors.surfaceSecondary,
							}}
							resizeMode="cover"
						/>
						<View
							style={{
								position: 'absolute',
								top: insets.top + theme.spacing[2],
								left: theme.spacing[3],
								right: theme.spacing[3],
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<IconButton
								icon={
									<Text variant="title3" color={theme.colors.textInverse}>
										{'<'}
									</Text>
								}
								onPress={() => router.back()}
								accessibilityLabel="Back"
								style={{
									backgroundColor: 'rgba(0,0,0,0.4)',
									borderRadius: theme.shape.radius.full,
									width: 36,
									height: 36,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							/>
							<Pressable onPress={handleRetake}>
								<Text
									variant="subheadline"
									color={theme.colors.textInverse}
									style={{ fontWeight: '600' }}
								>
									Retake Photo
								</Text>
							</Pressable>
						</View>
					</View>

					<View
						style={{
							padding: theme.spacing[4],
							gap: theme.spacing[4],
						}}
					>
						<View style={{ gap: theme.spacing[1] }}>
							<Text variant="title1">{identification.name}</Text>
							<Text
								variant="body"
								color={theme.colors.textSecondary}
								style={{ fontStyle: 'italic' }}
							>
								{identification.species}
							</Text>
						</View>

						<View
							style={{
								flexDirection: 'row',
								flexWrap: 'wrap',
								gap: theme.spacing[2],
							}}
						>
							<ConfidenceChip confidence={identification.confidence} />
							{identification.nativeToSonoran && (
								<Chip
									label="Native"
									bgColor={theme.colors.successLight}
									textColor={theme.colors.success}
								/>
							)}
							<Chip
								label={`Drought: ${identification.droughtTolerance}`}
								bgColor={theme.colors.surfaceSecondary}
								textColor={theme.colors.text}
							/>
						</View>

						<InfoCard
							emoji="☀️"
							label="Sun"
							value={formatSunExposure(identification.sunExposure)}
						/>
						<InfoCard
							emoji="💧"
							label="Water"
							value={[
								identification.wateringFrequency,
								identification.wateringDepth,
							]
								.filter(Boolean)
								.join('\n')}
						/>
						<InfoCard
							emoji="📏"
							label="Mature Size"
							value={`${identification.matureHeight} tall × ${identification.matureWidth} wide`}
						/>
						<InfoCard
							emoji="⚡️"
							label="Growth"
							value={identification.growthRate}
						/>
						<InfoCard
							emoji="🌸"
							label="Blooms"
							value={
								identification.bloomSeason
									? `${identification.bloomSeason}${identification.bloomColor ? ` — ${identification.bloomColor}` : ''}`
									: 'Non-blooming'
							}
						/>
						<InfoCard
							emoji="🐦"
							label="Wildlife"
							value={identification.wildlifeValue}
						/>
						<InfoCard
							emoji="⚠️"
							label="Toxicity"
							value={identification.toxicity}
						/>
						<InfoCard
							emoji="🌱"
							label="Best time to plant"
							value={identification.bestPlantingTime}
						/>
						<InfoCard
							emoji="🧪"
							label="Fertilizing"
							value={identification.fertilizing}
						/>
						{identification.commonProblems?.length > 0 && (
							<InfoCard
								emoji="🩺"
								label="Common problems"
								value={identification.commonProblems.join('\n')}
							/>
						)}
						<InfoCard
							emoji="📝"
							label="Care notes"
							value={identification.careNotes}
						/>
					</View>
				</ScrollView>

				<View
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						backgroundColor: theme.colors.surface,
						borderTopWidth: 1,
						borderTopColor: theme.colors.border,
						paddingHorizontal: theme.spacing[4],
						paddingTop: theme.spacing[3],
						paddingBottom: insets.bottom + theme.spacing[3],
						flexDirection: 'row',
						alignItems: 'center',
						gap: theme.spacing[3],
					}}
				>
					<Pressable
						onPress={handleRetake}
						style={{ paddingVertical: theme.spacing[2] }}
					>
						<Text variant="subheadline" color={theme.colors.accent}>
							Retake
						</Text>
					</Pressable>
					<View style={{ flex: 1 }}>
						<Button
							title="Save Plant"
							onPress={handleSave}
							loading={createPlant.isPending}
							size="lg"
						/>
					</View>
				</View>
			</View>
		)
	}

	// Step 5: Manual fallback
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView
				style={{ flex: 1, backgroundColor: theme.colors.background }}
				contentContainerStyle={{
					paddingBottom: insets.bottom + theme.spacing[8],
				}}
				keyboardShouldPersistTaps="handled"
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: theme.spacing[4],
						paddingTop: insets.top + theme.spacing[2],
						paddingBottom: theme.spacing[2],
					}}
				>
					<IconButton
						icon={
							<Text variant="title3" color={theme.colors.accent}>
								✕
							</Text>
						}
						onPress={() => router.back()}
						accessibilityLabel="Cancel"
					/>
					<Text
						variant="title2"
						style={{ flex: 1, marginLeft: theme.spacing[2] }}
					>
						Add Plant
					</Text>
				</View>

				{photoUri && (
					<View style={{ position: 'relative' }}>
						<Image
							source={{ uri: photoUri }}
							style={{
								width: '100%',
								height: 240,
								backgroundColor: theme.colors.surfaceSecondary,
							}}
							resizeMode="cover"
						/>
						<View
							style={{
								position: 'absolute',
								bottom: theme.spacing[3],
								right: theme.spacing[3],
							}}
						>
							<Button
								title="Retake"
								variant="ghost"
								onPress={handleRetake}
								style={{
									backgroundColor: 'rgba(0,0,0,0.5)',
									paddingHorizontal: theme.spacing[3],
									paddingVertical: theme.spacing[1],
									borderRadius: theme.shape.radius.full,
								}}
							/>
						</View>
					</View>
				)}

				<View
					style={{
						padding: theme.spacing[4],
						gap: theme.spacing[4],
					}}
				>
					{identifyError && (
						<View
							style={{
								backgroundColor: theme.colors.surfaceSecondary,
								borderRadius: theme.shape.radius.lg,
								padding: theme.spacing[3],
							}}
						>
							<Text variant="caption1" color={theme.colors.textSecondary}>
								{identifyError}
							</Text>
						</View>
					)}

					{!photoUri && (
						<Button
							title="Take Photo"
							variant="outlined"
							onPress={openCamera}
						/>
					)}

					<TextInput
						label="Plant Name"
						placeholder="e.g. Desert Willow"
						value={name}
						onChangeText={setName}
					/>

					<TextInput
						label="Species (optional)"
						placeholder="e.g. Chilopsis linearis"
						value={species}
						onChangeText={setSpecies}
					/>

					<View style={{ gap: theme.spacing[2] }}>
						<Text variant="subheadline" color={theme.colors.textSecondary}>
							Sun Exposure
						</Text>
						<View
							style={{
								flexDirection: 'row',
								flexWrap: 'wrap',
								gap: theme.spacing[2],
							}}
						>
							{SUN_OPTIONS.map((opt) => (
								<Pressable
									key={opt.value}
									onPress={() => setSunExposure(opt.value)}
									style={{
										paddingHorizontal: theme.spacing[3],
										paddingVertical: theme.spacing[2],
										borderRadius: theme.shape.radius.full,
										backgroundColor:
											sunExposure === opt.value
												? theme.colors.accent
												: theme.colors.surfaceSecondary,
										borderWidth: 1,
										borderColor:
											sunExposure === opt.value
												? theme.colors.accent
												: theme.colors.border,
									}}
								>
									<Text
										variant="caption1"
										color={
											sunExposure === opt.value
												? theme.colors.textInverse
												: theme.colors.text
										}
									>
										{opt.label}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					<TextInput
						label="Watering Needs"
						placeholder="e.g. Deep water weekly in summer"
						value={wateringNeeds}
						onChangeText={setWateringNeeds}
						multiline
					/>

					<TextInput
						label="Care Notes"
						placeholder="Key care tips..."
						value={careNotes}
						onChangeText={setCareNotes}
						multiline
						numberOfLines={3}
						style={{ minHeight: 80, textAlignVertical: 'top' }}
					/>

					<View style={{ gap: theme.spacing[2] }}>
						<Text variant="subheadline" color={theme.colors.textSecondary}>
							Drip Status
						</Text>
						<View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
							{DRIP_STATUSES.map((ds) => (
								<Pressable
									key={ds.value}
									onPress={() => setDripStatus(ds.value as DripStatus)}
									style={{
										flex: 1,
										paddingVertical: theme.spacing[2],
										borderRadius: theme.shape.radius.md,
										backgroundColor:
											dripStatus === ds.value
												? theme.colors.accent
												: theme.colors.surfaceSecondary,
										alignItems: 'center',
									}}
								>
									<Text
										variant="caption1"
										color={
											dripStatus === ds.value
												? theme.colors.textInverse
												: theme.colors.text
										}
									>
										{ds.label}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					<TextInput
						label="Notes (optional)"
						placeholder="Any additional notes..."
						value={notes}
						onChangeText={setNotes}
						multiline
						numberOfLines={3}
						style={{ minHeight: 80, textAlignVertical: 'top' }}
					/>

					<Button
						title="Save Plant"
						onPress={handleSave}
						loading={createPlant.isPending}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

function InfoCard({
	emoji,
	label,
	value,
}: {
	emoji: string
	label: string
	value: string
}) {
	const { theme } = useTheme()
	return (
		<View
			style={{
				backgroundColor: theme.colors.surface,
				borderRadius: theme.shape.radius.lg,
				padding: theme.spacing[4],
				flexDirection: 'row',
				gap: theme.spacing[3],
				...theme.shape.shadow.sm,
				shadowColor: theme.colors.shadow,
			}}
		>
			<Text variant="title2" style={{ width: 32, textAlign: 'center' }}>
				{emoji}
			</Text>
			<View style={{ flex: 1, gap: theme.spacing[1] }}>
				<Text
					variant="subheadline"
					color={theme.colors.textSecondary}
					style={{ fontWeight: '600' }}
				>
					{label}
				</Text>
				<Text variant="body">{value}</Text>
			</View>
		</View>
	)
}

function Chip({
	label,
	bgColor,
	textColor,
}: {
	label: string
	bgColor: string
	textColor: string
}) {
	const { theme } = useTheme()
	return (
		<View
			style={{
				paddingHorizontal: theme.spacing[3],
				paddingVertical: theme.spacing[1],
				borderRadius: theme.shape.radius.full,
				backgroundColor: bgColor,
			}}
		>
			<Text variant="caption1" color={textColor} style={{ fontWeight: '600' }}>
				{label}
			</Text>
		</View>
	)
}

function ConfidenceChip({ confidence }: { confidence: number }) {
	const { theme } = useTheme()
	const pct = Math.round(confidence * 100)
	const bgColor =
		pct >= 80
			? theme.colors.successLight
			: pct >= 50
				? theme.colors.warningLight
				: theme.colors.errorLight
	const textColor =
		pct >= 80
			? theme.colors.success
			: pct >= 50
				? theme.colors.warning
				: theme.colors.error
	return (
		<Chip label={`${pct}% match`} bgColor={bgColor} textColor={textColor} />
	)
}
