import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@/lib/theme'
import { Text, Card, ListItem } from '@/components/ui'
import { useRecentActivity } from './hooks'

function formatDate(iso: string): string {
	const d = new Date(iso)
	const now = new Date()
	const diffMs = now.getTime() - d.getTime()
	const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
	if (diffHrs < 1) return 'Just now'
	if (diffHrs < 24) return `${diffHrs}h ago`
	const diffDays = Math.floor(diffHrs / 24)
	if (diffDays === 1) return 'Yesterday'
	return `${diffDays}d ago`
}

export function RecentActivityCard() {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const { data: items } = useRecentActivity()
	const router = useRouter()

	if (!items?.length) return null

	const visible = items.slice(0, 5)

	return (
		<Card style={{ gap: spacing[2] }}>
			<Text variant="headline">Recent Activity</Text>
			{visible.map((item) => (
				<ListItem
					key={`${item.type}-${item.id}`}
					title={item.plantName}
					subtitle={`${formatDate(item.date)} — ${item.preview}`}
					onPress={() => router.push(`/(tabs)/plants/${item.plantId}`)}
					style={{ paddingHorizontal: 0 }}
				/>
			))}
			{items.length > 5 && (
				<Text
					variant="subheadline"
					color={colors.accent}
					style={{ fontWeight: '600', textAlign: 'center' }}
				>
					View All
				</Text>
			)}
		</Card>
	)
}
