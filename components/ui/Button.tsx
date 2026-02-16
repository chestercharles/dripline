import { Pressable, ActivityIndicator } from 'react-native'
import type { PressableProps, ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'

type ButtonVariant = 'filled' | 'outlined' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<PressableProps, 'style'> {
	title: string
	variant?: ButtonVariant
	size?: ButtonSize
	loading?: boolean
	destructive?: boolean
	style?: ViewStyle
}

const HEIGHT: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 }

export function Button({
	title,
	variant = 'filled',
	size = 'md',
	loading = false,
	destructive = false,
	disabled,
	style,
	onPress,
	...props
}: ButtonProps) {
	const { theme } = useTheme()
	const { colors, shape, spacing } = theme

	const accentColor = destructive ? colors.error : colors.accent

	const bgColor =
		variant === 'filled'
			? accentColor
			: variant === 'outlined'
				? 'transparent'
				: 'transparent'

	const textColor =
		variant === 'filled'
			? colors.textInverse
			: destructive
				? colors.error
				: colors.accent

	const borderColor = variant === 'outlined' ? accentColor : 'transparent'

	return (
		<Pressable
			onPress={(e) => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				onPress?.(e)
			}}
			disabled={disabled || loading}
			style={({ pressed }) => [
				{
					height: HEIGHT[size],
					paddingHorizontal: spacing[4],
					borderRadius: shape.radius.md,
					borderWidth: variant === 'outlined' ? 1.5 : 0,
					borderColor,
					backgroundColor: bgColor,
					alignItems: 'center' as const,
					justifyContent: 'center' as const,
					opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
				},
				style,
			]}
			{...props}
		>
			{loading ? (
				<ActivityIndicator color={textColor} size="small" />
			) : (
				<Text variant="headline" color={textColor}>
					{title}
				</Text>
			)}
		</Pressable>
	)
}
