import { RefreshControl, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from '@/lib/theme'
import { queryKeys } from '@/lib/query/keys'
import { Text } from '@/components/ui'
import { useSetting } from '@/features/settings/hooks'
import { DEFAULT_LOCATION } from '@/lib/constants/zones'
import { useWeather } from './hooks'
import { WeatherCard } from './WeatherCard'
import { GardenSummaryCard } from './GardenSummaryCard'
import { IrrigationAlertsCard } from './IrrigationAlertsCard'
import { SeasonalTipsCard } from './SeasonalTipsCard'
import { RecentActivityCard } from './RecentActivityCard'

export function DashboardScreen() {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const insets = useSafeAreaInsets()
	const qc = useQueryClient()
	const { isRefetching, refetch } = useWeather()
	const { data: locationName } = useSetting('location_name')

	const handleRefresh = () => {
		refetch()
		qc.invalidateQueries({ queryKey: queryKeys.healthLogs.all })
		qc.invalidateQueries({ queryKey: queryKeys.photos.all })
	}

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: colors.background }}
			contentContainerStyle={{
				paddingTop: insets.top + spacing[4],
				paddingHorizontal: spacing[4],
				paddingBottom: insets.bottom + spacing[8],
				gap: spacing[4],
			}}
			refreshControl={
				<RefreshControl
					refreshing={isRefetching}
					onRefresh={handleRefresh}
					tintColor={colors.accent}
				/>
			}
		>
			<Text variant="largeTitle">Dripline</Text>
			<Text variant="subheadline" color={colors.textSecondary}>
				{locationName ?? DEFAULT_LOCATION.name}
			</Text>
			<WeatherCard />
			<GardenSummaryCard />
			<IrrigationAlertsCard />
			<SeasonalTipsCard />
			<RecentActivityCard />
		</ScrollView>
	)
}
