import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text } from '@/components/ui'
import type { PlantMarker as PlantMarkerType } from './types'

const DRIP_COLORS = {
	working: '#22C55E',
	broken: '#EF4444',
	no_drip_line: '#9CA3AF',
} as const

const MARKER_SIZE = 20

interface PlantMarkerProps {
	marker: PlantMarkerType
	cellSize: number
}

export function PlantMarker({ marker, cellSize }: PlantMarkerProps) {
	const { theme } = useTheme()
	const router = useRouter()
	const [showName, setShowName] = useState(false)
	const color = DRIP_COLORS[marker.dripStatus]

	return (
		<Pressable
			onPress={() => {
				if (showName) {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
					router.push(`/(tabs)/plants/${marker.id}`)
				} else {
					Haptics.selectionAsync()
					setShowName(true)
				}
			}}
			style={{
				position: 'absolute',
				left: marker.gridX * cellSize + (cellSize - MARKER_SIZE) / 2,
				top: marker.gridY * cellSize + (cellSize - MARKER_SIZE) / 2,
				alignItems: 'center',
				zIndex: 10,
			}}
		>
			<View
				style={{
					width: MARKER_SIZE,
					height: MARKER_SIZE,
					borderRadius: MARKER_SIZE / 2,
					backgroundColor: color,
					borderWidth: 2,
					borderColor: '#FFFFFF',
					...theme.shape.shadow.sm,
					shadowColor: theme.colors.shadow,
				}}
			/>
			{showName && (
				<View
					style={{
						position: 'absolute',
						bottom: MARKER_SIZE + 4,
						backgroundColor: theme.colors.surfaceElevated,
						paddingHorizontal: theme.spacing[2],
						paddingVertical: theme.spacing[1],
						borderRadius: theme.shape.radius.sm,
						...theme.shape.shadow.md,
						shadowColor: theme.colors.shadow,
					}}
				>
					<Text variant="caption2" numberOfLines={1}>
						{marker.name}
					</Text>
				</View>
			)}
		</Pressable>
	)
}
