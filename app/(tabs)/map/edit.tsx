import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme'
import { Text } from '@/components/ui'

export default function YardMapEditScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
				padding: theme.spacing[4],
			}}
		>
			<Text variant="largeTitle">Edit Yard</Text>
			<Text variant="body" color={theme.colors.textSecondary}>
				Place and arrange blocks on your yard grid.
			</Text>
		</View>
	)
}
