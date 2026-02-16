import { View } from 'react-native'
import type { ViewProps } from 'react-native'
import { useTheme } from '@/lib/theme'

interface CardProps extends ViewProps {
	elevated?: boolean
}

export function Card({ elevated = true, style, ...props }: CardProps) {
	const { theme } = useTheme()
	const { colors, shape, spacing } = theme

	return (
		<View
			style={[
				{
					backgroundColor: elevated
						? colors.surfaceElevated
						: colors.surface,
					borderRadius: shape.radius.lg,
					padding: spacing[4],
					...(elevated ? shape.shadow.md : {}),
					shadowColor: colors.shadow,
				},
				style,
			]}
			{...props}
		/>
	)
}
