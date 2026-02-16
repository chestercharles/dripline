import { View, Image } from 'react-native'
import { useTheme } from '@/lib/theme'
import type { AIAnalysisResult } from '@/lib/ai'
import { Text } from '@/components/ui'
import type { HealthLogWithPhoto } from './types'
import { AIAnalysisResultCard } from './AIAnalysisResultCard'

const TYPE_CONFIG = {
	observation: { label: 'Observation', colorKey: 'info' as const },
	ai_analysis: { label: 'AI Analysis', colorKey: 'accent' as const },
	irrigation: { label: 'Irrigation', colorKey: 'success' as const },
	treatment: { label: 'Treatment', colorKey: 'warning' as const },
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
}

export function HealthLogEntry({ log }: { log: HealthLogWithPhoto }) {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const config = TYPE_CONFIG[log.type]
	const dotColor = colors[config.colorKey]

	let parsedAnalysis: AIAnalysisResult | null = null
	if (log.type === 'ai_analysis' && log.note) {
		try {
			parsedAnalysis = JSON.parse(log.note) as AIAnalysisResult
		} catch {
			// not JSON
		}
	}

	return (
		<View style={{ flexDirection: 'row', gap: spacing[3] }}>
			<View style={{ alignItems: 'center', width: 20 }}>
				<View
					style={{
						width: 10,
						height: 10,
						borderRadius: 5,
						backgroundColor: dotColor,
						marginTop: 5,
					}}
				/>
				<View
					style={{
						width: 1,
						flex: 1,
						backgroundColor: colors.border,
						marginTop: spacing[1],
					}}
				/>
			</View>
			<View style={{ flex: 1, gap: spacing[2], paddingBottom: spacing[4] }}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Text variant="subheadline" style={{ fontWeight: '600' }}>
						{config.label}
					</Text>
					<Text variant="caption1" color={colors.textTertiary}>
						{formatDate(log.createdAt)}
					</Text>
				</View>

				{log.note && !parsedAnalysis && (
					<Text variant="body" color={colors.textSecondary}>
						{log.note}
					</Text>
				)}

				{log.thumbnailPath && (
					<Image
						source={{ uri: log.thumbnailPath }}
						style={{
							width: 80,
							height: 80,
							borderRadius: theme.shape.radius.md,
						}}
					/>
				)}

				{parsedAnalysis && (
					<AIAnalysisResultCard result={parsedAnalysis} />
				)}
			</View>
		</View>
	)
}
