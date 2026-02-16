import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme'
import { Text } from '@/components/ui'

export default function CreatePlantScreen() {
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
			<Text variant="largeTitle">Add Plant</Text>
		</View>
	)
}
