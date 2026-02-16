import { View, ActivityIndicator } from 'react-native'
import { useTheme } from '@/lib/theme'
import { WEATHER_DESCRIPTIONS } from '@/lib/weather'
import { Text, Card } from '@/components/ui'
import { useWeather } from './hooks'

function getWeatherTint(code: number): string | undefined {
	if (code === 0 || code === 1) return '#FEF3C720'
	if (code >= 61 && code <= 67) return '#DBEAFE20'
	if (code >= 95) return '#E5E7EB20'
	return undefined
}

export function WeatherCard() {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const { data: weather, isLoading } = useWeather()

	if (isLoading) {
		return (
			<Card style={{ alignItems: 'center', padding: spacing[6] }}>
				<ActivityIndicator color={colors.accent} />
			</Card>
		)
	}

	if (!weather) return null

	const desc =
		WEATHER_DESCRIPTIONS[weather.weatherCode] ?? WEATHER_DESCRIPTIONS[0]
	const tint = getWeatherTint(weather.weatherCode)

	return (
		<Card
			style={{
				gap: spacing[3],
				...(tint ? { backgroundColor: tint } : {}),
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
				}}
			>
				<View style={{ gap: spacing[1] }}>
					<Text variant="largeTitle">
						{Math.round(weather.temperature)}°F
					</Text>
					<Text variant="body" color={colors.textSecondary}>
						{desc.description}
					</Text>
				</View>
			</View>
			<View style={{ flexDirection: 'row', gap: spacing[4] }}>
				<Text variant="subheadline" color={colors.textSecondary}>
					Humidity: {weather.humidity}%
				</Text>
				<Text variant="subheadline" color={colors.textSecondary}>
					Wind: {Math.round(weather.windSpeed)} mph
				</Text>
				{weather.precipitation > 0 && (
					<Text variant="subheadline" color={colors.info}>
						Rain: {weather.precipitation} in
					</Text>
				)}
			</View>
		</Card>
	)
}
