import { Pressable, View } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text } from '@/components/ui'
import { BLOCK_TYPE_MAP } from '@/lib/constants/blockTypes'
import type { Block } from './types'

interface BlockViewProps {
	block: Block
	cellSize: number
	editMode?: boolean
	selected?: boolean
	onPress?: () => void
	onLongPress?: () => void
}

export function BlockView({
	block,
	cellSize,
	editMode = false,
	selected = false,
	onPress,
	onLongPress,
}: BlockViewProps) {
	const { theme } = useTheme()
	const config = BLOCK_TYPE_MAP[block.type]
	const color = block.color ?? config.color

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			style={{
				position: 'absolute',
				left: block.gridX * cellSize,
				top: block.gridY * cellSize,
				width: block.width * cellSize,
				height: block.height * cellSize,
				backgroundColor: color,
				borderRadius: theme.shape.radius.sm,
				borderWidth: selected ? 2 : 0,
				borderColor: selected ? theme.colors.accent : 'transparent',
				overflow: 'hidden',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{block.label ? (
				<Text
					variant="caption2"
					color="#FFFFFF"
					numberOfLines={1}
					style={{ fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 1, textShadowOffset: { width: 0, height: 1 } }}
				>
					{block.label}
				</Text>
			) : (
				<Text
					variant="caption2"
					color="#FFFFFF"
					numberOfLines={1}
					style={{ fontWeight: '600', opacity: 0.8, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 1, textShadowOffset: { width: 0, height: 1 } }}
				>
					{config.label}
				</Text>
			)}
			{editMode && selected && (
				<>
					<View style={{ position: 'absolute', top: -3, left: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.accent, borderWidth: 2, borderColor: '#FFFFFF' }} />
					<View style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.accent, borderWidth: 2, borderColor: '#FFFFFF' }} />
					<View style={{ position: 'absolute', bottom: -3, left: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.accent, borderWidth: 2, borderColor: '#FFFFFF' }} />
					<View style={{ position: 'absolute', bottom: -3, right: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.accent, borderWidth: 2, borderColor: '#FFFFFF' }} />
				</>
			)}
		</Pressable>
	)
}
