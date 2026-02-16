import { useState, useCallback } from 'react'
import { View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/lib/theme'
import { Text, Button, IconButton } from '@/components/ui'
import type { BlockType } from '@/lib/constants/blockTypes'
import { useBlocks, useCreateBlock, useDeleteBlock } from './hooks'
import { YardMapGrid } from './YardMapGrid'
import { BlockPalette } from './BlockPalette'
import type { Block } from './types'

function TrashIcon({ color }: { color: string }) {
	return (
		<Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
			<Path
				d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
				fill={color}
			/>
		</Svg>
	)
}

export function YardMapEditScreen() {
	const { theme } = useTheme()
	const { colors, spacing } = theme
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const params = useLocalSearchParams<{ yardId: string }>()
	const yardId = Number(params.yardId) || 1

	const { data: blocks = [] } = useBlocks(yardId)
	const createBlock = useCreateBlock()
	const deleteBlock = useDeleteBlock()

	const [selectedType, setSelectedType] = useState<BlockType | null>(null)
	const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null)

	const handleCellPress = useCallback(
		(gridX: number, gridY: number) => {
			if (!selectedType) return

			const occupied = blocks.some(
				(b) =>
					gridX >= b.gridX &&
					gridX < b.gridX + b.width &&
					gridY >= b.gridY &&
					gridY < b.gridY + b.height
			)
			if (occupied) return

			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
			createBlock.mutate({
				yardId,
				type: selectedType,
				gridX,
				gridY,
				width: 1,
				height: 1,
			})
		},
		[selectedType, blocks, yardId, createBlock]
	)

	const handleBlockLongPress = useCallback((block: Block) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		setSelectedBlockId(block.id)
	}, [])

	const handleBlockPress = useCallback((block: Block) => {
		setSelectedBlockId((prev) => (prev === block.id ? null : block.id))
	}, [])

	const handleDelete = useCallback(() => {
		if (selectedBlockId == null) return
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		deleteBlock.mutate(
			{ id: selectedBlockId, yardId },
			{
				onSuccess: () => setSelectedBlockId(null),
			}
		)
	}, [selectedBlockId, yardId, deleteBlock])

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
				<Button
					title="Cancel"
					variant="ghost"
					size="sm"
					onPress={() => router.back()}
				/>
				<Text variant="headline">Edit Yard</Text>
				<View style={{ flexDirection: 'row', gap: spacing[1] }}>
					{selectedBlockId != null && (
						<IconButton
							icon={<TrashIcon color={colors.error} />}
							onPress={handleDelete}
							accessibilityLabel="Delete selected block"
						/>
					)}
					<Button
						title="Done"
						variant="filled"
						size="sm"
						onPress={() => router.back()}
					/>
				</View>
			</View>

			<View style={{ flex: 1, justifyContent: 'center' }}>
				<YardMapGrid
					blocks={blocks as Block[]}
					plantMarkers={[]}
					editMode
					selectedBlockId={selectedBlockId}
					onCellPress={handleCellPress}
					onBlockPress={handleBlockPress}
					onBlockLongPress={handleBlockLongPress}
				/>
			</View>

			<View style={{ paddingBottom: insets.bottom }}>
				<BlockPalette
					selected={selectedType}
					onSelect={(type) =>
						setSelectedType((prev) => (prev === type ? null : type))
					}
				/>
			</View>
		</View>
	)
}
