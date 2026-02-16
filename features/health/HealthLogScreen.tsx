import { ScrollView, View, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme'
import { Text, EmptyState } from '@/components/ui'
import { useHealthLogs } from './hooks'
import { HealthLogEntry } from './HealthLogEntry'

export function HealthLogScreen() {
	const { plantId } = useLocalSearchParams<{ plantId: string }>()
	const id = Number(plantId)
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const insets = useSafeAreaInsets()
	const { data: logs, isLoading } = useHealthLogs(id)

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: colors.background }}
			contentContainerStyle={{
				paddingTop: insets.top + spacing[4],
				paddingHorizontal: spacing[4],
				paddingBottom: insets.bottom + spacing[8],
				gap: spacing[4],
			}}
		>
			<Text variant="largeTitle">Health Log</Text>

			{isLoading && (
				<View style={{ padding: spacing[8], alignItems: 'center' }}>
					<ActivityIndicator color={colors.accent} />
				</View>
			)}

			{!isLoading && !logs?.length && (
				<EmptyState
					title="No health logs yet"
					description="Health observations and AI analyses will appear here."
				/>
			)}

			{logs?.map((log) => <HealthLogEntry key={log.id} log={log} />)}
		</ScrollView>
	)
}
