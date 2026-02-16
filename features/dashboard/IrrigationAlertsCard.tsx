import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useTheme } from '@/lib/theme'
import { useDrizzle } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import { Text, Card, StatusBadge, ListItem } from '@/components/ui'

export function IrrigationAlertsCard() {
	const { theme } = useTheme()
	const { spacing, colors } = theme
	const db = useDrizzle()
	const router = useRouter()

	const { data: brokenPlants } = useQuery({
		queryKey: [...queryKeys.plants.all, 'broken'],
		queryFn: () =>
			db
				.select({ id: plants.id, name: plants.name })
				.from(plants)
				.where(eq(plants.dripStatus, 'broken')),
	})

	if (!brokenPlants?.length) return null

	return (
		<Card style={{ gap: spacing[2] }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					gap: spacing[2],
				}}
			>
				<Text variant="headline">Irrigation Alerts</Text>
				<StatusBadge
					label={String(brokenPlants.length)}
					color={colors.error}
				/>
			</View>
			{brokenPlants.map((plant) => (
				<ListItem
					key={plant.id}
					title={plant.name}
					subtitle="Broken drip line"
					onPress={() => router.push(`/(tabs)/plants/${plant.id}`)}
					style={{ paddingHorizontal: 0 }}
				/>
			))}
		</Card>
	)
}
