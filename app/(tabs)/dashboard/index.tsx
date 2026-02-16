import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme'
import { Text } from '@/components/ui'

export default function DashboardScreen() {
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
			<Text variant="largeTitle">Dashboard</Text>
			<Text variant="body" color={theme.colors.textSecondary}>
				Weather, alerts, and activity will appear here.
			</Text>
		</View>
	)
}
