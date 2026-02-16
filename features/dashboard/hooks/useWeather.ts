import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather } from '@/lib/weather'
import { DEFAULT_LOCATION } from '@/lib/constants/zones'
import { queryKeys } from '@/lib/query/keys'
import { useSettings } from '@/features/settings/hooks'

export function useWeather() {
	const { data: settingsMap } = useSettings()

	const lat = settingsMap?.lat ? Number(settingsMap.lat) : DEFAULT_LOCATION.lat
	const lon = settingsMap?.lon ? Number(settingsMap.lon) : DEFAULT_LOCATION.lon

	return useQuery({
		queryKey: queryKeys.weather.current(lat, lon),
		queryFn: () => fetchCurrentWeather(lat, lon),
		staleTime: 1000 * 60 * 15,
	})
}
