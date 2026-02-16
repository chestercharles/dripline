export type SunExposure =
	| 'full_sun'
	| 'partial_sun'
	| 'partial_shade'
	| 'full_shade'

export interface SunExposureConfig {
	value: SunExposure
	label: string
	description: string
	icon: string
}

export const SUN_EXPOSURES: SunExposureConfig[] = [
	{
		value: 'full_sun',
		label: 'Full Sun',
		description: '6+ hours direct sunlight',
		icon: '☀️',
	},
	{
		value: 'partial_sun',
		label: 'Partial Sun',
		description: '4-6 hours direct sunlight',
		icon: '🌤️',
	},
	{
		value: 'partial_shade',
		label: 'Partial Shade',
		description: '2-4 hours direct sunlight',
		icon: '⛅',
	},
	{
		value: 'full_shade',
		label: 'Full Shade',
		description: 'Less than 2 hours direct sunlight',
		icon: '🌥️',
	},
]
