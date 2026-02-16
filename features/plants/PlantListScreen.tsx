import { useState, useCallback } from 'react'
import { View, FlatList, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTheme } from '@/lib/theme'
import { Text, TextInput, EmptyState, FilterPills, IconButton } from '@/components/ui'
import { DRIP_STATUSES } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'
import { usePlants } from './hooks/usePlants'
import { PlantDripBadge } from './PlantDripBadge'
import type { Plant } from './types'

export function PlantListScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState<DripStatus | null>(null)

	const { data: allPlants = [], isLoading } = usePlants(search || undefined)

	const plants = statusFilter
		? allPlants.filter((p) => p.dripStatus === statusFilter)
		: allPlants

	const renderItem = useCallback(
		({ item }: { item: Plant }) => (
			<Pressable
				onPress={() => router.push(`/(tabs)/plants/${item.id}`)}
				style={({ pressed }) => ({
					flexDirection: 'row',
					alignItems: 'center',
					padding: theme.spacing[4],
					backgroundColor: theme.colors.surfaceElevated,
					borderRadius: theme.shape.radius.lg,
					marginHorizontal: theme.spacing[4],
					gap: theme.spacing[3],
					opacity: pressed ? 0.85 : 1,
					...theme.shape.shadow.md,
					shadowColor: theme.colors.shadow,
				})}
			>
				<View
					style={{
						width: 48,
						height: 48,
						borderRadius: theme.shape.radius.md,
						backgroundColor: theme.colors.accentLight,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Text
						variant="title2"
						style={{ fontSize: 24 }}
						color={theme.colors.accent}
					>
						{'\u{1F331}'}
					</Text>
				</View>
				<View style={{ flex: 1, gap: theme.spacing[1] }}>
					<Text variant="headline">{item.name}</Text>
					{item.species && (
						<Text
							variant="subheadline"
							color={theme.colors.textSecondary}
						>
							{item.species}
						</Text>
					)}
				</View>
				{item.dripStatus && (
					<PlantDripBadge status={item.dripStatus as DripStatus} />
				)}
			</Pressable>
		),
		[router, theme]
	)

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: theme.spacing[4],
					paddingVertical: theme.spacing[2],
				}}
			>
				<Text variant="largeTitle" style={{ flex: 1 }}>
					Plants
				</Text>
				<IconButton
					icon={
						<Text variant="title2" color={theme.colors.accent}>
							+
						</Text>
					}
					onPress={() => router.push('/(tabs)/plants/create')}
					accessibilityLabel="Add plant"
				/>
			</View>

			<View
				style={{
					paddingHorizontal: theme.spacing[4],
					paddingBottom: theme.spacing[2],
				}}
			>
				<TextInput
					placeholder="Search plants..."
					value={search}
					onChangeText={setSearch}
					returnKeyType="search"
				/>
			</View>

			<FilterPills
				options={DRIP_STATUSES.map((ds) => ({
					value: ds.value,
					label: ds.label,
				}))}
				selected={statusFilter}
				onChange={setStatusFilter}
			/>

			{plants.length === 0 && !isLoading ? (
				<EmptyState
					title="No plants yet"
					description="Add your first plant to start tracking your garden."
					actionLabel="Add Plant"
					onAction={() => router.push('/(tabs)/plants/create')}
				/>
			) : (
				<FlatList
					data={plants}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					contentContainerStyle={{
						gap: theme.spacing[3],
						paddingVertical: theme.spacing[3],
						paddingBottom: insets.bottom + theme.spacing[16],
					}}
				/>
			)}
		</View>
	)
}
