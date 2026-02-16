import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text, Card } from '@/components/ui'
import type { SeasonalTip } from '@/lib/constants/seasonalTips'
import { useSeasonalTips } from './hooks'

const PRIORITY_COLOR_KEY = {
	high: 'error',
	medium: 'warning',
	low: 'info',
} as const

function TipItem({ tip }: { tip: SeasonalTip }) {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const [expanded, setExpanded] = useState(false)
	const indicatorColor = colors[PRIORITY_COLOR_KEY[tip.priority]]

	return (
		<Pressable onPress={() => setExpanded(!expanded)}>
			<View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'flex-start' }}>
				<View
					style={{
						width: 8,
						height: 8,
						borderRadius: 4,
						backgroundColor: indicatorColor,
						marginTop: 6,
					}}
				/>
				<View style={{ flex: 1, gap: spacing[1] }}>
					<Text variant="body" style={{ fontWeight: '600' }}>
						{tip.title}
					</Text>
					{expanded && (
						<Text variant="subheadline" color={colors.textSecondary}>
							{tip.body}
						</Text>
					)}
				</View>
			</View>
		</Pressable>
	)
}

export function SeasonalTipsCard() {
	const { theme } = useTheme()
	const { spacing } = theme
	const tips = useSeasonalTips()

	if (!tips.length) return null

	return (
		<Card style={{ gap: spacing[3] }}>
			<Text variant="headline">Seasonal Tips</Text>
			{tips.map((tip, i) => (
				<TipItem key={i} tip={tip} />
			))}
		</Card>
	)
}
