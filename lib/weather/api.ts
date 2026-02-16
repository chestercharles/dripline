import type { CurrentWeather } from './types'

export async function fetchCurrentWeather(
	lat: number,
	lon: number
): Promise<CurrentWeather> {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
	const data = await res.json()
	const c = data.current
	return {
		temperature: c.temperature_2m,
		humidity: c.relative_humidity_2m,
		precipitation: c.precipitation,
		weatherCode: c.weather_code,
		windSpeed: c.wind_speed_10m,
	}
}
