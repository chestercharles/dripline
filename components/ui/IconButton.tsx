import { Pressable } from 'react-native'
import type { ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'

interface IconButtonProps {
	icon: React.ReactNode
	onPress: () => void
	size?: number
	color?: string
	style?: ViewStyle
	accessibilityLabel: string
}

export function IconButton({
	icon,
	onPress,
	size = 44,
	style,
	accessibilityLabel,
}: IconButtonProps) {
	return (
		<Pressable
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				onPress()
			}}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="button"
			style={({ pressed }) => [
				{
					width: size,
					height: size,
					alignItems: 'center' as const,
					justifyContent: 'center' as const,
					borderRadius: size / 2,
					opacity: pressed ? 0.7 : 1,
				},
				style,
			]}
		>
			{icon}
		</Pressable>
	)
}
