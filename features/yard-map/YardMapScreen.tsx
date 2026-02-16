import { useState, useMemo, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/lib/theme'
import { Text, SegmentedControl, IconButton } from '@/components/ui'
import { BLOCK_TYPE_MAP } from '@/lib/constants/blockTypes'
import { useYards, useBlocks, usePlantMarkers, useZones } from './hooks'
import { YardMapGrid } from './YardMapGrid'
import { ZoneConfigSheet } from './ZoneConfigSheet'
import type { Block, Zone } from './types'

function PencilIcon({ color }: { color: string }) {
	return (
		<Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
			<Path
				d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
				fill={color}
			/>
		</Svg>
	)
}

export function YardMapScreen() {
	const { theme } = useTheme()
	const { colors, spacing } = theme
	const router = useRouter()
	const insets = useSafeAreaInsets()

	const { data: yards, isLoading: yardsLoading } = useYards()
	const [selectedYardIndex, setSelectedYardIndex] = useState(0)

	const selectedYard = yards?.[selectedYardIndex]
	const yardId = selectedYard?.id ?? 0

	const { data: blocks = [] } = useBlocks(yardId)
	const { data: plantMarkers = [] } = usePlantMarkers(yardId)
	const { data: zonesList = [] } = useZones(yardId)

	const [activeZone, setActiveZone] = useState<Zone | null>(null)

	const yardSegments = useMemo(
		() =>
			(yards ?? []).map((y) => ({
				value: String(y.id),
				label: y.name,
			})),
		[yards]
	)

	const handleBlockPress = useCallback(
		(block: Block) => {
			const config = BLOCK_TYPE_MAP[block.type]
			if (config.plantable) {
				const zone = zonesList.find((z) => z.blockId === block.id)
				if (zone) {
					setActiveZone(zone as Zone)
				}
			}
		},
		[zonesList]
	)

	if (yardsLoading) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: colors.background,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<ActivityIndicator color={colors.accent} />
			</View>
		)
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.background,
				paddingTop: insets.top,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingHorizontal: spacing[4],
					paddingBottom: spacing[2],
				}}
			>
				<Text variant="largeTitle">Yard</Text>
				<IconButton
					icon={<PencilIcon color={colors.accent} />}
					onPress={() =>
						router.push({
							pathname: '/(tabs)/map/edit',
							params: { yardId: String(yardId) },
						})
					}
					accessibilityLabel="Edit yard map"
				/>
			</View>

			{yardSegments.length > 1 && (
				<View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[3] }}>
					<SegmentedControl
						segments={yardSegments}
						selected={String(yardId)}
						onChange={(val) => {
							const idx = yards?.findIndex(
								(y) => String(y.id) === val
							)
							if (idx != null && idx >= 0) setSelectedYardIndex(idx)
						}}
					/>
				</View>
			)}

			<YardMapGrid
				blocks={blocks as Block[]}
				plantMarkers={plantMarkers}
				onBlockPress={handleBlockPress}
			/>

			{activeZone && (
				<ZoneConfigSheet
					zone={activeZone}
					yardId={yardId}
					onClose={() => setActiveZone(null)}
				/>
			)}
		</View>
	)
}
