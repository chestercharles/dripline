import { Pressable, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'

interface ListItemProps {
	title: string
	subtitle?: string
	left?: React.ReactNode
	right?: React.ReactNode
	onPress?: () => void
	style?: ViewStyle
}

export function ListItem({
	title,
	subtitle,
	left,
	right,
	onPress,
	style,
}: ListItemProps) {
	const { theme } = useTheme()
	const { colors, spacing } = theme

	const content = (
		<View
			style={[
				{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: spacing[3],
					paddingHorizontal: spacing[4],
					gap: spacing[3],
					minHeight: 44,
				},
				style,
			]}
		>
			{left}
			<View style={{ flex: 1 }}>
				<Text variant="body">{title}</Text>
				{subtitle && (
					<Text variant="subheadline" color={colors.textSecondary}>
						{subtitle}
					</Text>
				)}
			</View>
			{right}
		</View>
	)

	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
			>
				{content}
			</Pressable>
		)
	}

	return content
}
