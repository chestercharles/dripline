import { useState } from 'react'
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text, TextInput, Button, SegmentedControl } from '@/components/ui'
import { DRIP_STATUSES } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'
import { useCreatePlant } from './hooks/useCreatePlant'
import { useYards } from './hooks/useYards'

const DRIP_SEGMENTS = DRIP_STATUSES.map((ds) => ({
	value: ds.value,
	label: ds.label,
}))

export function CreatePlantScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()
	const createPlant = useCreatePlant()
	const { data: yards = [] } = useYards()

	const [name, setName] = useState('')
	const [species, setSpecies] = useState('')
	const [dripStatus, setDripStatus] = useState<DripStatus>('working')
	const [yardId, setYardId] = useState<number | null>(null)
	const [notes, setNotes] = useState('')
	const [nameError, setNameError] = useState('')

	const yardSegments = yards.map((y) => ({
		value: String(y.id),
		label: y.name,
	}))

	const selectedYardId = yardId ?? yards[0]?.id ?? null

	const handleSave = async () => {
		if (!name.trim()) {
			setNameError('Name is required')
			return
		}
		if (!selectedYardId) return

		setNameError('')
		await createPlant.mutateAsync({
			name: name.trim(),
			species: species.trim() || undefined,
			yardId: selectedYardId,
			dripStatus,
			notes: notes.trim() || undefined,
		})
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		router.back()
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
				}}
				contentContainerStyle={{
					padding: theme.spacing[4],
					paddingTop: insets.top + theme.spacing[4],
					paddingBottom: insets.bottom + theme.spacing[8],
					gap: theme.spacing[5],
				}}
				keyboardShouldPersistTaps="handled"
			>
				<Text variant="largeTitle">Add Plant</Text>

				<TextInput
					label="Name"
					placeholder="e.g. Desert Willow"
					value={name}
					onChangeText={(v) => {
						setName(v)
						if (nameError) setNameError('')
					}}
					error={nameError}
					autoFocus
				/>

				<TextInput
					label="Species"
					placeholder="e.g. Chilopsis linearis"
					value={species}
					onChangeText={setSpecies}
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
						selected={dripStatus}
						onChange={setDripStatus}
					/>
				</View>

				{yardSegments.length > 0 && (
					<View style={{ gap: theme.spacing[1] }}>
						<Text
							variant="subheadline"
							color={theme.colors.textSecondary}
						>
							Yard
						</Text>
						<SegmentedControl
							segments={yardSegments}
							selected={String(selectedYardId)}
							onChange={(v) => setYardId(Number(v))}
						/>
					</View>
				)}

				<TextInput
					label="Notes"
					placeholder="Any additional notes..."
					value={notes}
					onChangeText={setNotes}
					multiline
					numberOfLines={4}
					style={{ minHeight: 100, textAlignVertical: 'top' }}
				/>

				<Button
					title="Save Plant"
					onPress={handleSave}
					loading={createPlant.isPending}
					disabled={!name.trim()}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
