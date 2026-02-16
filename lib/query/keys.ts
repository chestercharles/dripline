export const queryKeys = {
	yards: {
		all: ['yards'] as const,
		detail: (id: number) => ['yards', id] as const,
	},
	blocks: {
		all: ['blocks'] as const,
		byYard: (yardId: number) => ['blocks', 'yard', yardId] as const,
	},
	zones: {
		all: ['zones'] as const,
		byYard: (yardId: number) => ['zones', 'yard', yardId] as const,
	},
	plants: {
		all: ['plants'] as const,
		detail: (id: number) => ['plants', id] as const,
		byYard: (yardId: number) => ['plants', 'yard', yardId] as const,
		byZone: (zoneId: number) => ['plants', 'zone', zoneId] as const,
	},
	photos: {
		all: ['photos'] as const,
		byPlant: (plantId: number) => ['photos', 'plant', plantId] as const,
	},
	healthLogs: {
		all: ['healthLogs'] as const,
		byPlant: (plantId: number) =>
			['healthLogs', 'plant', plantId] as const,
	},
	weather: {
		current: (lat: number, lon: number) =>
			['weather', 'current', lat, lon] as const,
	},
	settings: {
		all: ['settings'] as const,
		key: (key: string) => ['settings', key] as const,
	},
}
