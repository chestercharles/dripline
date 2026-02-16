import { Pressable, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'

interface SegmentedControlProps<T extends string> {
	segments: { value: T; label: string }[]
	selected: T
	onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
	segments,
	selected,
	onChange,
}: SegmentedControlProps<T>) {
	const { theme } = useTheme()
	const { colors, spacing, shape } = theme

	return (
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: colors.surfaceSecondary,
				borderRadius: shape.radius.md,
				padding: 2,
			}}
		>
			{segments.map((segment) => {
				const isActive = segment.value === selected
				return (
					<Pressable
						key={segment.value}
						onPress={() => {
							Haptics.selectionAsync()
							onChange(segment.value)
						}}
						style={{
							flex: 1,
							paddingVertical: spacing[2],
							borderRadius: shape.radius.md - 2,
							backgroundColor: isActive
								? colors.surfaceElevated
								: 'transparent',
							alignItems: 'center',
							...(isActive ? shape.shadow.sm : {}),
							shadowColor: colors.shadow,
						}}
					>
						<Text
							variant="subheadline"
							color={isActive ? colors.text : colors.textSecondary}
							style={{ fontWeight: isActive ? '600' : '400' }}
						>
							{segment.label}
						</Text>
					</Pressable>
				)
			})}
		</View>
	)
}
