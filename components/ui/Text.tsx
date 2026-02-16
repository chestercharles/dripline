import { Text as RNText } from 'react-native'
import type { TextProps as RNTextProps } from 'react-native'
import { useTheme } from '@/lib/theme'
import type { TypographyVariant } from '@/lib/theme'

interface TextProps extends RNTextProps {
	variant?: TypographyVariant
	color?: string
	align?: 'left' | 'center' | 'right'
}

export function Text({
	variant = 'body',
	color,
	align,
	style,
	...props
}: TextProps) {
	const { theme } = useTheme()

	return (
		<RNText
			style={[
				theme.typography[variant],
				{ color: color ?? theme.colors.text },
				align && { textAlign: align },
				style,
			]}
			{...props}
		/>
	)
}
