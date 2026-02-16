import { useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated'
import { useTheme } from '@/lib/theme'
import { BlockView } from './BlockView'
import { PlantMarker } from './PlantMarker'
import type { Block, PlantMarker as PlantMarkerType } from './types'

const GRID_COLUMNS = 12
const GRID_ROWS = 16
const GRID_PADDING = 16

interface YardMapGridProps {
	blocks: Block[]
	plantMarkers: PlantMarkerType[]
	editMode?: boolean
	selectedBlockId?: number | null
	onCellPress?: (gridX: number, gridY: number) => void
	onBlockPress?: (block: Block) => void
	onBlockLongPress?: (block: Block) => void
}

export function YardMapGrid({
	blocks,
	plantMarkers,
	editMode = false,
	selectedBlockId,
	onCellPress,
	onBlockPress,
	onBlockLongPress,
}: YardMapGridProps) {
	const { theme } = useTheme()
	const { width: screenWidth } = useWindowDimensions()

	const cellSize = (screenWidth - GRID_PADDING * 2) / GRID_COLUMNS
	const gridWidth = cellSize * GRID_COLUMNS
	const gridHeight = cellSize * GRID_ROWS

	const scale = useSharedValue(1)
	const savedScale = useSharedValue(1)
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	const savedTranslateX = useSharedValue(0)
	const savedTranslateY = useSharedValue(0)

	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 3)
		})
		.onEnd(() => {
			savedScale.value = scale.value
			if (scale.value < 1.05) {
				scale.value = withSpring(1)
				savedScale.value = 1
				translateX.value = withSpring(0)
				translateY.value = withSpring(0)
				savedTranslateX.value = 0
				savedTranslateY.value = 0
			}
		})

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			translateX.value = savedTranslateX.value + e.translationX
			translateY.value = savedTranslateY.value + e.translationY
		})
		.onEnd(() => {
			savedTranslateX.value = translateX.value
			savedTranslateY.value = translateY.value
		})

	const composedGesture = editMode
		? Gesture.Simultaneous(pinchGesture, panGesture)
		: Gesture.Simultaneous(pinchGesture, panGesture)

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ scale: scale.value },
		],
	}))

	const rows = useMemo(() => {
		const result: number[][] = []
		for (let r = 0; r < GRID_ROWS; r++) {
			const row: number[] = []
			for (let c = 0; c < GRID_COLUMNS; c++) {
				row.push(c)
			}
			result.push(row)
		}
		return result
	}, [])

	return (
		<GestureDetector gesture={composedGesture}>
			<Animated.View style={[{ alignSelf: 'center' }, animatedStyle]}>
				<View
					style={{
						width: gridWidth,
						height: gridHeight,
						backgroundColor: theme.colors.surfaceSecondary,
						borderRadius: theme.shape.radius.md,
						overflow: 'hidden',
					}}
				>
					{rows.map((row, rowIndex) => (
						<View
							key={rowIndex}
							style={{ flexDirection: 'row' }}
						>
							{row.map((colIndex) => (
								<View
									key={colIndex}
									onTouchEnd={
										editMode && onCellPress
											? () => onCellPress(colIndex, rowIndex)
											: undefined
									}
									style={{
										width: cellSize,
										height: cellSize,
										borderWidth: 0.5,
										borderColor: theme.colors.borderLight,
									}}
								/>
							))}
						</View>
					))}

					{blocks.map((block) => (
						<BlockView
							key={block.id}
							block={block}
							cellSize={cellSize}
							editMode={editMode}
							selected={selectedBlockId === block.id}
							onPress={() => onBlockPress?.(block)}
							onLongPress={() => onBlockLongPress?.(block)}
						/>
					))}

					{!editMode &&
						plantMarkers.map((marker) => (
							<PlantMarker
								key={marker.id}
								marker={marker}
								cellSize={cellSize}
							/>
						))}
				</View>
			</Animated.View>
		</GestureDetector>
	)
}
