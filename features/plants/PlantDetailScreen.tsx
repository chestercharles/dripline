import { useState } from 'react'
import { View, ScrollView, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import {
	Text,
	Button,
	Card,
	TextInput,
	SegmentedControl,
	IconButton,
} from '@/components/ui'
import { DRIP_STATUSES } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'
import { usePlant } from './hooks/usePlant'
import { useUpdatePlant } from './hooks/useUpdatePlant'
import { useDeletePlant } from './hooks/useDeletePlant'
import { PlantDripBadge } from './PlantDripBadge'

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

	const startEditing = () => {
		if (!plant) return
		setEditName(plant.name)
		setEditSpecies(plant.species ?? '')
		setEditDripStatus((plant.dripStatus as DripStatus) ?? 'working')
		setEditNotes(plant.notes ?? '')
		setEditing(true)
	}

	const handleSave = async () => {
		await updatePlant.mutateAsync({
			id: plantId,
			name: editName.trim(),
			species: editSpecies.trim() || undefined,
			dripStatus: editDripStatus,
			notes: editNotes.trim() || undefined,
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

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.background }}
			contentContainerStyle={{
				padding: theme.spacing[4],
				paddingTop: insets.top + theme.spacing[4],
				paddingBottom: insets.bottom + theme.spacing[8],
				gap: theme.spacing[4],
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<IconButton
					icon={
						<Text variant="title3" color={theme.colors.accent}>
							{'\u2039'}
						</Text>
					}
					onPress={() => router.back()}
					accessibilityLabel="Go back"
				/>
				{!editing && (
					<View
						style={{
							flexDirection: 'row',
							gap: theme.spacing[1],
						}}
					>
						<IconButton
							icon={
								<Text
									variant="body"
									color={theme.colors.accent}
								>
									Edit
								</Text>
							}
							onPress={startEditing}
							accessibilityLabel="Edit plant"
						/>
						<IconButton
							icon={
								<Text
									variant="body"
									color={theme.colors.error}
								>
									{'\u2717'}
								</Text>
							}
							onPress={handleDelete}
							accessibilityLabel="Delete plant"
						/>
					</View>
				)}
			</View>

			{editing ? (
				<Card style={{ gap: theme.spacing[4] }}>
					<TextInput
						label="Name"
						value={editName}
						onChangeText={setEditName}
					/>
					<TextInput
						label="Species"
						value={editSpecies}
						onChangeText={setEditSpecies}
					/>
					<View style={{ gap: theme.spacing[1] }}>
						<Text
							variant="subheadline"
							color={theme.colors.textSecondary}
						>
							Drip Status
						</Text>
						<SegmentedControl
							segments={DRIP_SEGMENTS}
							selected={editDripStatus}
							onChange={setEditDripStatus}
						/>
					</View>
					<TextInput
						label="Notes"
						value={editNotes}
						onChangeText={setEditNotes}
						multiline
						numberOfLines={4}
						style={{ minHeight: 100, textAlignVertical: 'top' }}
					/>
					<View
						style={{
							flexDirection: 'row',
							gap: theme.spacing[3],
						}}
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
					<View style={{ gap: theme.spacing[2] }}>
						<Text variant="largeTitle">{plant.name}</Text>
						{plant.species && (
							<Text
								variant="title3"
								color={theme.colors.textSecondary}
							>
								{plant.species}
							</Text>
						)}
					</View>

					<Card style={{ gap: theme.spacing[3] }}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Text variant="headline">Drip Status</Text>
							{plant.dripStatus && (
								<PlantDripBadge
									status={plant.dripStatus as DripStatus}
								/>
							)}
						</View>

						{plant.yard && (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<Text
									variant="body"
									color={theme.colors.textSecondary}
								>
									Yard
								</Text>
								<Text variant="body">{plant.yard.name}</Text>
							</View>
						)}

						{plant.zone?.name && (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<Text
									variant="body"
									color={theme.colors.textSecondary}
								>
									Zone
								</Text>
								<Text variant="body">{plant.zone.name}</Text>
							</View>
						)}
					</Card>

					{plant.notes && (
						<Card style={{ gap: theme.spacing[2] }}>
							<Text variant="headline">Notes</Text>
							<Text
								variant="body"
								color={theme.colors.textSecondary}
							>
								{plant.notes}
							</Text>
						</Card>
					)}

					<View style={{ gap: theme.spacing[3] }}>
						<Button
							title="Photo Journal"
							variant="outlined"
							onPress={() =>
								router.push(
									`/(tabs)/plants/photos/${plantId}`
								)
							}
						/>
						<Button
							title="Compare Photos"
							variant="outlined"
							onPress={() =>
								router.push(
									`/(tabs)/plants/compare/${plantId}`
								)
							}
						/>
					</View>
				</>
			)}
		</ScrollView>
	)
}
