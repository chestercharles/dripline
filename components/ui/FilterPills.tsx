import { ScrollView, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text } from './Text'

interface FilterPillsProps<T extends string> {
	options: { value: T; label: string }[]
	selected: T | null
	onChange: (value: T | null) => void
}

export function FilterPills<T extends string>({
	options,
	selected,
	onChange,
}: FilterPillsProps<T>) {
	const { theme } = useTheme()
	const { colors, spacing, shape } = theme

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ gap: spacing[2], paddingHorizontal: spacing[4] }}
		>
			{options.map((option) => {
				const isActive = option.value === selected
				return (
					<Pressable
						key={option.value}
						onPress={() => {
							Haptics.selectionAsync()
							onChange(isActive ? null : option.value)
						}}
						style={{
							paddingHorizontal: spacing[3],
							paddingVertical: spacing[2],
							borderRadius: shape.radius.full,
							backgroundColor: isActive
								? colors.accent
								: colors.surfaceSecondary,
							minHeight: 36,
							justifyContent: 'center',
						}}
					>
						<Text
							variant="subheadline"
							color={isActive ? colors.textInverse : colors.textSecondary}
							style={{ fontWeight: isActive ? '600' : '400' }}
						>
							{option.label}
						</Text>
					</Pressable>
				)
			})}
		</ScrollView>
	)
}
