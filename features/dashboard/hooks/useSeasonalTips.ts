import { useMemo } from 'react'
import { getActiveTips } from '@/lib/constants/seasonalTips'
import { useWeather } from './useWeather'

export function useSeasonalTips() {
	const { data: weather } = useWeather()

	return useMemo(() => {
		const month = new Date().getMonth() + 1
		return getActiveTips(month, weather?.temperature)
	}, [weather?.temperature])
}
