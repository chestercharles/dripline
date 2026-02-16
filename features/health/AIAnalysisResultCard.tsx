import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useTheme } from '@/lib/theme'
import type { AIAnalysisResult } from '@/lib/ai'
import { Text, Card, StatusBadge } from '@/components/ui'

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	const { theme } = useTheme()
	const [expanded, setExpanded] = useState(true)

	return (
		<View style={{ gap: theme.spacing[1] }}>
			<Pressable onPress={() => setExpanded(!expanded)}>
				<Text variant="subheadline" style={{ fontWeight: '600' }}>
					{title} {expanded ? '−' : '+'}
				</Text>
			</Pressable>
			{expanded && children}
		</View>
	)
}

function getConfidenceColor(
	confidence: number,
	colors: { success: string; warning: string; error: string }
) {
	if (confidence >= 0.7) return colors.success
	if (confidence >= 0.4) return colors.warning
	return colors.error
}

export function AIAnalysisResultCard({ result }: { result: AIAnalysisResult }) {
	const { theme } = useTheme()
	const { spacing, colors } = theme

	return (
		<Card style={{ gap: spacing[3] }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Text variant="headline">AI Analysis</Text>
				<StatusBadge
					label={`${Math.round(result.confidence * 100)}%`}
					color={getConfidenceColor(result.confidence, colors)}
				/>
			</View>

			{result.speciesGuess && (
				<View style={{ gap: spacing[1] }}>
					<Text variant="subheadline" color={colors.textSecondary}>
						Species
					</Text>
					<Text variant="body">{result.speciesGuess}</Text>
				</View>
			)}

			<View style={{ gap: spacing[1] }}>
				<Text variant="subheadline" color={colors.textSecondary}>
					Health
				</Text>
				<Text variant="body">{result.healthAssessment}</Text>
			</View>

			{result.issues.length > 0 && (
				<Section title="Issues">
					{result.issues.map((issue, i) => (
						<View
							key={i}
							style={{
								flexDirection: 'row',
								gap: spacing[2],
								alignItems: 'flex-start',
							}}
						>
							<View
								style={{
									width: 6,
									height: 6,
									borderRadius: 3,
									backgroundColor: colors.error,
									marginTop: 7,
								}}
							/>
							<Text
								variant="body"
								color={colors.textSecondary}
								style={{ flex: 1 }}
							>
								{issue}
							</Text>
						</View>
					))}
				</Section>
			)}

			{result.recommendations.length > 0 && (
				<Section title="Recommendations">
					{result.recommendations.map((rec, i) => (
						<View
							key={i}
							style={{
								flexDirection: 'row',
								gap: spacing[2],
								alignItems: 'flex-start',
							}}
						>
							<View
								style={{
									width: 6,
									height: 6,
									borderRadius: 3,
									backgroundColor: colors.accent,
									marginTop: 7,
								}}
							/>
							<Text
								variant="body"
								color={colors.textSecondary}
								style={{ flex: 1 }}
							>
								{rec}
							</Text>
						</View>
					))}
				</Section>
			)}
		</Card>
	)
}
