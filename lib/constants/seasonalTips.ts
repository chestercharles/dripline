export interface SeasonalTip {
	months: number[]
	condition?: (tempF: number) => boolean
	title: string
	body: string
	priority: 'high' | 'medium' | 'low'
}

export const SEASONAL_TIPS: SeasonalTip[] = [
	{
		months: [6, 7, 8],
		condition: (t) => t > 110,
		title: 'Extreme Heat Warning',
		body: 'Temperatures above 110°F. Check drip systems daily. Water deeply in early morning. Watch for sunscald on exposed trunks.',
		priority: 'high',
	},
	{
		months: [6, 7, 8],
		title: 'Summer Watering',
		body: 'Desert plants need deep, infrequent watering in summer. Run drip systems longer but less often. Citrus and fruit trees may need 2x/week.',
		priority: 'medium',
	},
	{
		months: [7, 8, 9],
		title: 'Monsoon Season',
		body: 'Reduce irrigation during monsoon rains. Check for standing water around root zones. Watch for wind damage to tall plants.',
		priority: 'medium',
	},
	{
		months: [12, 1, 2],
		condition: (t) => t < 35,
		title: 'Frost Risk',
		body: 'Cover frost-sensitive plants like citrus, bougainvillea, and lantana. Move potted plants to protected areas. Turn off drip to avoid frozen lines.',
		priority: 'high',
	},
	{
		months: [12, 1, 2],
		title: 'Winter Care',
		body: 'Reduce watering frequency significantly. Most desert plants are dormant. Good time to prune deciduous trees after leaf drop.',
		priority: 'low',
	},
	{
		months: [3, 4, 5],
		title: 'Spring Growth',
		body: 'Plants are actively growing. Gradually increase watering. Fertilize citrus and flowering plants. Watch for new growth on dormant plants.',
		priority: 'medium',
	},
	{
		months: [9, 10, 11],
		title: 'Fall Planting',
		body: 'Best time to plant in the desert. Cooler temps reduce transplant shock. Establish roots before summer heat. Reduce watering as temps drop.',
		priority: 'medium',
	},
	{
		months: [4, 5],
		title: 'Check Drip Systems',
		body: 'Before summer heat arrives, inspect all drip emitters. Clean clogged lines. Replace damaged tubing. Adjust timer for longer summer runs.',
		priority: 'high',
	},
]

export function getActiveTips(month: number, tempF?: number): SeasonalTip[] {
	return SEASONAL_TIPS.filter((tip) => {
		if (!tip.months.includes(month)) return false
		if (tip.condition && tempF !== undefined) return tip.condition(tempF)
		if (tip.condition && tempF === undefined) return false
		return true
	}).sort((a, b) => {
		const order = { high: 0, medium: 1, low: 2 }
		return order[a.priority] - order[b.priority]
	})
}
