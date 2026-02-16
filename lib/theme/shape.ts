export const shape = {
	radius: {
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		full: 9999,
	},
	shadow: {
		sm: {
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.08,
			shadowRadius: 2,
			elevation: 1,
		},
		md: {
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		lg: {
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.12,
			shadowRadius: 8,
			elevation: 5,
		},
	},
} as const

export type Shape = typeof shape
