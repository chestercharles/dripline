import { View } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'

interface StatusBadgeProps {
	label: string
	color: string
	backgroundColor?: string
}

export function StatusBadge({
	label,
	color,
	backgroundColor,
}: StatusBadgeProps) {
	const { theme } = useTheme()
	const { spacing, shape } = theme

	return (
		<View
			style={{
				paddingHorizontal: spacing[2],
				paddingVertical: spacing[1],
				borderRadius: shape.radius.full,
				backgroundColor: backgroundColor ?? `${color}20`,
			}}
		>
			<Text variant="caption1" color={color} style={{ fontWeight: '600' }}>
				{label}
			</Text>
		</View>
	)
}
