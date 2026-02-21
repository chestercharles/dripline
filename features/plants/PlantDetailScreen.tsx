import { useState } from 'react'
import { View, ScrollView, Image, Alert, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import {
	Text,
	Button,
	Card,
	TextInput,
	IconButton,
} from '@/components/ui'
import { DRIP_STATUSES } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'
import { usePlant } from './hooks/usePlant'
import { useUpdatePlant } from './hooks/useUpdatePlant'
import { useDeletePlant } from './hooks/useDeletePlant'
import { PlantDripBadge } from './PlantDripBadge'
import type { SunExposure } from './types'

const SUN_LABELS: Record<SunExposure, string> = {
	full_sun: '☀️ Full Sun',
	partial_sun: '🌤 Partial Sun',
	partial_shade: '⛅️ Partial Shade',
	full_shade: '🌥 Full Shade',
}

const DRIP_SEGMENTS = DRIP_STATUSES.map((ds) => ({
	value: ds.value,
	label: ds.label,
}))

export function PlantDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()
	const plantId = Number(id)

	const { data: plant, isLoading } = usePlant(plantId)
	const updatePlant = useUpdatePlant()
	const deletePlant = useDeletePlant()

	const [editing, setEditing] = useState(false)
	const [editName, setEditName] = useState('')
	const [editSpecies, setEditSpecies] = useState('')
	const [editDripStatus, setEditDripStatus] = useState<DripStatus>('working')
	const [editNotes, setEditNotes] = useState('')
	const [editWateringNeeds, setEditWateringNeeds] = useState('')
	const [editCareNotes, setEditCareNotes] = useState('')

	const startEditing = () => {
		if (!plant) return
		setEditName(plant.name)
		setEditSpecies(plant.species ?? '')
		setEditDripStatus((plant.dripStatus as DripStatus) ?? 'working')
		setEditNotes(plant.notes ?? '')
		setEditWateringNeeds(plant.wateringNeeds ?? '')
		setEditCareNotes(plant.careNotes ?? '')
		setEditing(true)
	}

	const handleSave = async () => {
		await updatePlant.mutateAsync({
			id: plantId,
			name: editName.trim(),
			species: editSpecies.trim() || undefined,
			dripStatus: editDripStatus,
			notes: editNotes.trim() || undefined,
			wateringNeeds: editWateringNeeds.trim() || undefined,
			careNotes: editCareNotes.trim() || undefined,
		})
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		setEditing(false)
	}

	const handleDelete = () => {
		Alert.alert('Delete Plant', 'Are you sure? This cannot be undone.', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					await deletePlant.mutateAsync(plantId)
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					)
					router.back()
				},
			},
		])
	}

	if (isLoading || !plant) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
					paddingTop: insets.top,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text variant="body" color={theme.colors.textSecondary}>
					{isLoading ? 'Loading...' : 'Plant not found'}
				</Text>
			</View>
		)
	}

	const heroImage = plant.latestPhoto?.filePath ?? plant.heroPhotoPath

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.background }}
			contentContainerStyle={{
				paddingBottom: insets.bottom + theme.spacing[8],
			}}
		>
			{heroImage ? (
				<Pressable
					onPress={() => router.push(`/(tabs)/plants/photos/${plantId}`)}
				>
					<Image
						source={{ uri: heroImage }}
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
							bottom: theme.spacing[3],
							right: theme.spacing[3],
							backgroundColor: 'rgba(0,0,0,0.5)',
							paddingHorizontal: theme.spacing[3],
							paddingVertical: theme.spacing[1],
							borderRadius: theme.shape.radius.full,
						}}
					>
						<Text variant="caption1" color="#fff">
							📷 View all photos
						</Text>
					</View>
				</Pressable>
			) : (
				<Pressable
					onPress={() => router.push(`/(tabs)/plants/photos/${plantId}`)}
					style={{
						width: '100%',
						height: 200,
						backgroundColor: theme.colors.accentLight,
						alignItems: 'center',
						justifyContent: 'center',
						gap: theme.spacing[2],
					}}
				>
					<Text style={{ fontSize: 64 }}>🌿</Text>
					<Text variant="subheadline" color={theme.colors.accent}>
						Tap to add first photo
					</Text>
				</Pressable>
			)}

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					position: 'absolute',
					top: insets.top + theme.spacing[2],
					left: theme.spacing[2],
					right: theme.spacing[2],
					justifyContent: 'space-between',
				}}
			>
				<Pressable
					onPress={() => router.back()}
					style={({ pressed }) => ({
						width: 36,
						height: 36,
						borderRadius: theme.shape.radius.full,
						backgroundColor: 'rgba(0,0,0,0.4)',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: pressed ? 0.7 : 1,
					})}
				>
					<Text variant="title3" color="#fff">‹</Text>
				</Pressable>

				{!editing && (
					<View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
						<Pressable
							onPress={startEditing}
							style={({ pressed }) => ({
								paddingHorizontal: theme.spacing[3],
								paddingVertical: theme.spacing[1],
								borderRadius: theme.shape.radius.full,
								backgroundColor: 'rgba(0,0,0,0.4)',
								opacity: pressed ? 0.7 : 1,
							})}
						>
							<Text variant="subheadline" color="#fff">Edit</Text>
						</Pressable>
					</View>
				)}
			</View>

			<View
				style={{
					padding: theme.spacing[4],
					gap: theme.spacing[4],
				}}
			>
				{editing ? (
					<Card style={{ gap: theme.spacing[4] }}>
						<TextInput label="Name" value={editName} onChangeText={setEditName} />
						<TextInput label="Species" value={editSpecies} onChangeText={setEditSpecies} />
						<TextInput
							label="Watering Needs"
							value={editWateringNeeds}
							onChangeText={setEditWateringNeeds}
							multiline
						/>
						<TextInput
							label="Care Notes"
							value={editCareNotes}
							onChangeText={setEditCareNotes}
							multiline
							numberOfLines={4}
							style={{ minHeight: 100, textAlignVertical: 'top' }}
						/>
						<TextInput
							label="Notes"
							value={editNotes}
							onChangeText={setEditNotes}
							multiline
							numberOfLines={3}
							style={{ minHeight: 80, textAlignVertical: 'top' }}
						/>
						<View
							style={{ flexDirection: 'row', gap: theme.spacing[3] }}
						>
							<Button
								title="Cancel"
								variant="outlined"
								onPress={() => setEditing(false)}
								style={{ flex: 1 }}
							/>
							<Button
								title="Save"
								onPress={handleSave}
								loading={updatePlant.isPending}
								style={{ flex: 1 }}
							/>
						</View>
					</Card>
				) : (
					<>
						<View style={{ gap: theme.spacing[1] }}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<Text variant="largeTitle" style={{ flex: 1 }}>
									{plant.name}
								</Text>
								{plant.dripStatus && (
									<PlantDripBadge status={plant.dripStatus as DripStatus} />
								)}
							</View>
							{plant.species && (
								<Text variant="title3" color={theme.colors.textSecondary}>
									{plant.species}
								</Text>
							)}
							{plant.identifiedAt && (
								<Text variant="caption1" color={theme.colors.textTertiary}>
									🤖 AI identified
								</Text>
							)}
						</View>

						<Pressable
							onPress={() => router.push(`/(tabs)/plants/photos/${plantId}`)}
							style={({ pressed }) => ({
								backgroundColor: theme.colors.accent,
								borderRadius: theme.shape.radius.lg,
								paddingVertical: theme.spacing[3],
								alignItems: 'center',
								opacity: pressed ? 0.85 : 1,
							})}
						>
							<Text variant="headline" color={theme.colors.textInverse}>
								📷 Add Photo
							</Text>
						</Pressable>

						{(plant.wateringNeeds || plant.careNotes || plant.sunExposure) && (
							<Card style={{ gap: theme.spacing[3] }}>
								<Text variant="headline">Care Info</Text>

								{plant.sunExposure && (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<Text variant="body" color={theme.colors.textSecondary}>
											Sun
										</Text>
										<Text variant="body">
											{SUN_LABELS[plant.sunExposure as SunExposure]}
										</Text>
									</View>
								)}

								{plant.wateringNeeds && (
									<View style={{ gap: theme.spacing[1] }}>
										<Text variant="subheadline" color={theme.colors.textSecondary}>
											💧 Watering
										</Text>
										<Text variant="body">{plant.wateringNeeds}</Text>
									</View>
								)}

								{plant.careNotes && (
									<View style={{ gap: theme.spacing[1] }}>
										<Text variant="subheadline" color={theme.colors.textSecondary}>
											📋 Care Notes
										</Text>
										<Text variant="body" color={theme.colors.textSecondary}>
											{plant.careNotes}
										</Text>
									</View>
								)}
							</Card>
						)}

						{plant.notes && (
							<Card style={{ gap: theme.spacing[2] }}>
								<Text variant="headline">Notes</Text>
								<Text variant="body" color={theme.colors.textSecondary}>
									{plant.notes}
								</Text>
							</Card>
						)}

						<Button
							title="Photo Timeline"
							variant="outlined"
							onPress={() => router.push(`/(tabs)/plants/photos/${plantId}`)}
						/>

						<Button
							title="Delete Plant"
							variant="ghost"
							destructive
							onPress={handleDelete}
						/>
					</>
				)}
			</View>
		</ScrollView>
	)
}
