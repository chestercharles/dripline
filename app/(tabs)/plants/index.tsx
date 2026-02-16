import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme'
import { Text, EmptyState } from '@/components/ui'

export default function PlantListScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<View style={{ padding: theme.spacing[4] }}>
				<Text variant="largeTitle">Plants</Text>
			</View>
			<EmptyState
				title="No plants yet"
				description="Add your first plant to start tracking your garden."
				actionLabel="Add Plant"
				onAction={() => {}}
			/>
		</View>
	)
}
