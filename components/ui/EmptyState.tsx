import { View } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'
import { Button } from './Button'

interface EmptyStateProps {
	title: string
	description: string
	actionLabel?: string
	onAction?: () => void
}

export function EmptyState({
	title,
	description,
	actionLabel,
	onAction,
}: EmptyStateProps) {
	const { theme } = useTheme()
	const { spacing } = theme

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				padding: spacing[8],
				gap: spacing[3],
			}}
		>
			<Text variant="title3" align="center">
				{title}
			</Text>
			<Text
				variant="body"
				color={theme.colors.textSecondary}
				align="center"
			>
				{description}
			</Text>
			{actionLabel && onAction && (
				<Button
					title={actionLabel}
					onPress={onAction}
					style={{ marginTop: spacing[2] }}
				/>
			)}
		</View>
	)
}
