import { Pressable, ScrollView, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text } from '@/components/ui'
import { BLOCK_TYPES } from '@/lib/constants/blockTypes'
import type { BlockType } from '@/lib/constants/blockTypes'

interface BlockPaletteProps {
	selected: BlockType | null
	onSelect: (type: BlockType) => void
}

export function BlockPalette({ selected, onSelect }: BlockPaletteProps) {
	const { theme } = useTheme()
	const { colors, spacing, shape } = theme

	return (
		<View
			style={{
				backgroundColor: colors.surfaceElevated,
				borderTopWidth: 1,
				borderTopColor: colors.border,
				paddingVertical: spacing[2],
			}}
		>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: spacing[4],
					gap: spacing[2],
				}}
			>
				{BLOCK_TYPES.map((bt) => {
					const isActive = selected === bt.type
					return (
						<Pressable
							key={bt.type}
							onPress={() => {
								Haptics.selectionAsync()
								onSelect(bt.type)
							}}
							style={{
								alignItems: 'center',
								paddingHorizontal: spacing[3],
								paddingVertical: spacing[2],
								borderRadius: shape.radius.md,
								backgroundColor: isActive
									? colors.accentLight
									: 'transparent',
								borderWidth: isActive ? 1.5 : 0,
								borderColor: isActive ? colors.accent : 'transparent',
								minWidth: 64,
							}}
						>
							<View
								style={{
									width: 28,
									height: 28,
									borderRadius: shape.radius.sm,
									backgroundColor: bt.color,
									marginBottom: spacing[1],
								}}
							/>
							<Text
								variant="caption2"
								color={isActive ? colors.accent : colors.textSecondary}
								style={{ fontWeight: isActive ? '600' : '400' }}
							>
								{bt.label}
							</Text>
						</Pressable>
					)
				})}
			</ScrollView>
		</View>
	)
}
