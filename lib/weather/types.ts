export interface CurrentWeather {
	temperature: number
	humidity: number
	precipitation: number
	weatherCode: number
	windSpeed: number
}

export const WEATHER_DESCRIPTIONS: Record<number, { description: string; icon: string }> = {
	0: { description: 'Clear sky', icon: 'sun' },
	1: { description: 'Mainly clear', icon: 'sun' },
	2: { description: 'Partly cloudy', icon: 'cloud-sun' },
	3: { description: 'Overcast', icon: 'cloud' },
	45: { description: 'Foggy', icon: 'fog' },
	48: { description: 'Depositing rime fog', icon: 'fog' },
	51: { description: 'Light drizzle', icon: 'drizzle' },
	53: { description: 'Moderate drizzle', icon: 'drizzle' },
	55: { description: 'Dense drizzle', icon: 'drizzle' },
	56: { description: 'Freezing drizzle', icon: 'drizzle' },
	57: { description: 'Dense freezing drizzle', icon: 'drizzle' },
	61: { description: 'Slight rain', icon: 'rain' },
	63: { description: 'Moderate rain', icon: 'rain' },
	65: { description: 'Heavy rain', icon: 'rain' },
	66: { description: 'Freezing rain', icon: 'rain' },
	67: { description: 'Heavy freezing rain', icon: 'rain' },
	71: { description: 'Slight snow', icon: 'snow' },
	73: { description: 'Moderate snow', icon: 'snow' },
	75: { description: 'Heavy snow', icon: 'snow' },
	77: { description: 'Snow grains', icon: 'snow' },
	80: { description: 'Slight showers', icon: 'rain' },
	81: { description: 'Moderate showers', icon: 'rain' },
	82: { description: 'Violent showers', icon: 'rain' },
	85: { description: 'Slight snow showers', icon: 'snow' },
	86: { description: 'Heavy snow showers', icon: 'snow' },
	95: { description: 'Thunderstorm', icon: 'storm' },
	96: { description: 'Thunderstorm with hail', icon: 'storm' },
	99: { description: 'Thunderstorm with heavy hail', icon: 'storm' },
}

export interface GeocodingResult {
	lat: number
	lon: number
	name: string
	country: string
}
