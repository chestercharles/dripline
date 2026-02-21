import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@/lib/theme'
import { Text, Card, ListItem } from '@/components/ui'
import { useGardenStats } from './hooks/useGardenStats'

export function GardenSummaryCard() {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const { data: stats } = useGardenStats()
	const router = useRouter()

	if (!stats || stats.totalPlants === 0) return null

	return (
		<>
			<Card style={{ gap: spacing[3] }}>
				<Text variant="headline">My Garden</Text>
				<View style={{ flexDirection: 'row', gap: spacing[3] }}>
					<View
						style={{
							flex: 1,
							backgroundColor: colors.accentLight,
							borderRadius: theme.shape.radius.md,
							padding: spacing[3],
							alignItems: 'center',
							gap: spacing[1],
						}}
					>
						<Text variant="title1" color={colors.accent}>
							{stats.totalPlants}
						</Text>
						<Text variant="caption1" color={colors.textSecondary}>
							Plants
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							backgroundColor: colors.accentLight,
							borderRadius: theme.shape.radius.md,
							padding: spacing[3],
							alignItems: 'center',
							gap: spacing[1],
						}}
					>
						<Text variant="title1" color={colors.accent}>
							{stats.plantsWithPhotos}
						</Text>
						<Text variant="caption1" color={colors.textSecondary}>
							Photographed
						</Text>
					</View>
				</View>
				{stats.lastPhotoDate && (
					<Text variant="caption1" color={colors.textTertiary} style={{ textAlign: 'center' }}>
						Last photo: {formatAge(stats.lastPhotoDate)}
					</Text>
				)}
			</Card>

			{stats.plantsNeedingPhoto.length > 0 && (
				<Card style={{ gap: spacing[2] }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
						<Text variant="headline">📷 Due for a Photo</Text>
					</View>
					<Text variant="caption1" color={colors.textSecondary}>
						These plants haven't been photographed in 30+ days
					</Text>
					{stats.plantsNeedingPhoto.map((plant) => (
						<ListItem
							key={plant.id}
							title={plant.name}
							subtitle={
								plant.daysSince === null
									? 'Never photographed'
									: `${plant.daysSince} days since last photo`
							}
							onPress={() => router.push(`/(tabs)/plants/${plant.id}`)}
							style={{ paddingHorizontal: 0 }}
						/>
					))}
				</Card>
			)}
		</>
	)
}

function formatAge(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime()
	const days = Math.floor(diff / 86400000)
	if (days === 0) return 'Today'
	if (days === 1) return 'Yesterday'
	if (days < 7) return `${days} days ago`
	return `${Math.floor(days / 7)} weeks ago`
}
