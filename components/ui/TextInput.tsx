import { TextInput as RNTextInput, View } from 'react-native'
import type { TextInputProps as RNTextInputProps } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'

interface TextInputProps extends RNTextInputProps {
	label?: string
	error?: string
}

export function TextInput({
	label,
	error,
	style,
	...props
}: TextInputProps) {
	const { theme } = useTheme()
	const { colors, spacing, shape, typography } = theme

	return (
		<View style={{ gap: spacing[1] }}>
			{label && (
				<Text variant="subheadline" color={colors.textSecondary}>
					{label}
				</Text>
			)}
			<RNTextInput
				placeholderTextColor={colors.textTertiary}
				style={[
					{
						...typography.body,
						color: colors.text,
						backgroundColor: colors.surfaceSecondary,
						borderRadius: shape.radius.md,
						paddingHorizontal: spacing[3],
						paddingVertical: spacing[3],
						minHeight: 44,
						borderWidth: error ? 1.5 : 0,
						borderColor: error ? colors.error : 'transparent',
					},
					style,
				]}
				{...props}
			/>
			{error && (
				<Text variant="caption1" color={colors.error}>
					{error}
				</Text>
			)}
		</View>
	)
}
