import { useState, useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from '@/lib/theme'
import { Text, Button, TextInput, SegmentedControl } from '@/components/ui'
import { SUN_EXPOSURES } from '@/lib/constants/sunExposure'
import type { SunExposure } from '@/lib/constants/sunExposure'
import { useUpdateZone } from './hooks'
import type { Zone } from './types'

interface ZoneConfigSheetProps {
	zone: Zone | null
	yardId: number
	onClose: () => void
}

export function ZoneConfigSheet({
	zone,
	yardId,
	onClose,
}: ZoneConfigSheetProps) {
	const { theme } = useTheme()
	const { colors, spacing } = theme
	const bottomSheetRef = useRef<BottomSheet>(null)
	const updateZone = useUpdateZone()

	const [name, setName] = useState(zone?.name ?? '')
	const [sunExposure, setSunExposure] = useState<SunExposure>(
		zone?.sunExposure ?? 'full_sun'
	)

	const snapPoints = useMemo(() => ['40%'], [])

	const sunSegments = SUN_EXPOSURES.map((s) => ({
		value: s.value,
		label: s.label,
	}))

	const handleSave = useCallback(() => {
		if (!zone) return
		updateZone.mutate(
			{
				id: zone.id,
				yardId,
				name: name || undefined,
				sunExposure,
			},
			{ onSuccess: onClose }
		)
	}, [zone, yardId, name, sunExposure, updateZone, onClose])

	if (!zone) return null

	return (
		<BottomSheet
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			enablePanDownToClose
			onClose={onClose}
			backgroundStyle={{ backgroundColor: colors.surfaceElevated }}
			handleIndicatorStyle={{ backgroundColor: colors.textTertiary }}
		>
			<BottomSheetView
				style={{ flex: 1, padding: spacing[4], gap: spacing[4] }}
			>
				<Text variant="title3">Zone Settings</Text>

				<TextInput
					label="Zone Name"
					value={name}
					onChangeText={setName}
					placeholder="e.g. Front Garden Bed"
				/>

				<View style={{ gap: spacing[1] }}>
					<Text variant="subheadline" color={colors.textSecondary}>
						Sun Exposure
					</Text>
					<SegmentedControl
						segments={sunSegments}
						selected={sunExposure}
						onChange={setSunExposure}
					/>
				</View>

				<Button
					title="Save"
					onPress={handleSave}
					loading={updateZone.isPending}
				/>
			</BottomSheetView>
		</BottomSheet>
	)
}
