import { useState, useEffect } from 'react'
import { View, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native'
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

const SUN_OPTIONS = [
	{ value: 'full_sun', label: '☀️ Full Sun' },
	{ value: 'partial_sun', label: '🌤 Part Sun' },
	{ value: 'partial_shade', label: '⛅️ Part Shade' },
	{ value: 'full_shade', label: '🌥 Full Shade' },
] as const

type Step = 'camera' | 'identifying' | 'review' | 'manual'

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
	const [identification, setIdentification] = useState<PlantIdentification | null>(null)
	const [identifyError, setIdentifyError] = useState<string | null>(null)

	const [name, setName] = useState('')
	const [species, setSpecies] = useState('')
	const [wateringNeeds, setWateringNeeds] = useState('')
	const [careNotes, setCareNotes] = useState('')
	const [sunExposure, setSunExposure] = useState<PlantIdentification['sunExposure']>('full_sun')
	const [dripStatus, setDripStatus] = useState<DripStatus>('working')
	const [notes, setNotes] = useState('')

	useEffect(() => {
		openCamera()
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
			{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
		)

		setPhotoUri(resized.uri)

		if (apiKey) {
			setStep('identifying')
			try {
				const id = await identifyPlant(resized.uri, aiProvider, apiKey)
				setIdentification(id)
				setName(id.name)
				setSpecies(id.species)
				setWateringNeeds(id.wateringNeeds)
				setCareNotes(id.careNotes)
				setSunExposure(id.sunExposure)
				setStep('review')
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
			} catch {
				setIdentifyError('Could not identify plant — fill in the details manually.')
				setStep('review')
			}
		} else {
			setStep('review')
		}
	}

	const handleSave = async () => {
		const trimmedName = name.trim() || 'Unknown Plant'
		const yardId = yards[0]?.id
		if (!yardId) return

		await createPlant.mutateAsync({
			name: trimmedName,
			species: species.trim() || undefined,
			yardId,
			dripStatus,
			notes: notes.trim() || undefined,
			sunExposure: sunExposure || undefined,
			wateringNeeds: wateringNeeds.trim() || undefined,
			careNotes: careNotes.trim() || undefined,
			identifiedAt: identification ? new Date().toISOString() : undefined,
			heroPhotoPath: photoUri ?? undefined,
		})
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		router.back()
	}

	if (step === 'camera') {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
					alignItems: 'center',
					justifyContent: 'center',
					paddingTop: insets.top,
				}}
			>
				<ActivityIndicator size="large" color={theme.colors.accent} />
				<Text
					variant="body"
					color={theme.colors.textSecondary}
					style={{ marginTop: theme.spacing[3] }}
				>
					Opening camera...
				</Text>
			</View>
		)
	}

	if (step === 'identifying') {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
					alignItems: 'center',
					justifyContent: 'center',
					gap: theme.spacing[4],
					paddingTop: insets.top,
					paddingHorizontal: theme.spacing[6],
				}}
			>
				{photoUri && (
					<Image
						source={{ uri: photoUri }}
						style={{
							width: 200,
							height: 200,
							borderRadius: theme.shape.radius.xl,
							backgroundColor: theme.colors.surfaceSecondary,
						}}
						resizeMode="cover"
					/>
				)}
				<ActivityIndicator size="large" color={theme.colors.accent} />
				<Text variant="title3" style={{ textAlign: 'center' }}>
					Identifying plant...
				</Text>
				<Text
					variant="body"
					color={theme.colors.textSecondary}
					style={{ textAlign: 'center' }}
				>
					Looking this up for you 🌿
				</Text>
			</View>
		)
	}

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
					<Text variant="title2" style={{ flex: 1, marginLeft: theme.spacing[2] }}>
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
								onPress={openCamera}
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
					{identification && (
						<View
							style={{
								backgroundColor: theme.colors.accentLight,
								borderRadius: theme.shape.radius.lg,
								padding: theme.spacing[3],
								gap: theme.spacing[1],
							}}
						>
							<Text variant="subheadline" color={theme.colors.accent}>
								🌿 Identified with {Math.round(identification.confidence * 100)}% confidence
							</Text>
							<Text variant="caption1" color={theme.colors.textSecondary}>
								Review and edit the details below
							</Text>
						</View>
					)}

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
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
							{SUN_OPTIONS.map((opt) => (
								<View
									key={opt.value}
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
										onPress={() => setSunExposure(opt.value)}
									>
										{opt.label}
									</Text>
								</View>
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
								<View
									key={ds.value}
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
										onPress={() => setDripStatus(ds.value as DripStatus)}
									>
										{ds.label}
									</Text>
								</View>
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
