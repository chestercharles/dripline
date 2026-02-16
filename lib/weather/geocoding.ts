import type { GeocodingResult } from './types'

export async function geocodeZip(zip: string): Promise<GeocodingResult | null> {
	const url = `https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1&language=en&format=json`
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`)
	const data = await res.json()
	if (!data.results?.length) return null
	const r = data.results[0]
	return {
		lat: r.latitude,
		lon: r.longitude,
		name: r.name,
		country: r.country,
	}
}
