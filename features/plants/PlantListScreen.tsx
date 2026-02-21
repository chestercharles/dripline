import { useState, useCallback } from 'react'
import { View, FlatList, Pressable, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTheme } from '@/lib/theme'
import { Text, TextInput, FilterPills } from '@/components/ui'
import { DRIP_STATUSES } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'
import { usePlantsWithPhotos } from './hooks/usePlantsWithPhotos'
import { PlantDripBadge } from './PlantDripBadge'
import type { PlantWithLatestPhoto } from './hooks/usePlantsWithPhotos'

function formatPhotoAge(takenAt: string): string {
	const diff = Date.now() - new Date(takenAt).getTime()
	const days = Math.floor(diff / 86400000)
	if (days === 0) return 'Today'
	if (days === 1) return 'Yesterday'
	if (days < 7) return `${days}d ago`
	if (days < 30) return `${Math.floor(days / 7)}w ago`
	if (days < 365) return `${Math.floor(days / 30)}mo ago`
	return `${Math.floor(days / 365)}y ago`
}

export function PlantListScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState<DripStatus | null>(null)

	const { data: allPlants = [], isLoading } = usePlantsWithPhotos(search || undefined)

	const plants = statusFilter
		? allPlants.filter((p) => p.dripStatus === statusFilter)
		: allPlants

	const renderItem = useCallback(
		({ item }: { item: PlantWithLatestPhoto }) => (
			<Pressable
				onPress={() => router.push(`/(tabs)/plants/${item.id}`)}
				style={({ pressed }) => ({
					flexDirection: 'row',
					alignItems: 'center',
					padding: theme.spacing[3],
					backgroundColor: theme.colors.surfaceElevated,
					borderRadius: theme.shape.radius.lg,
					marginHorizontal: theme.spacing[4],
					gap: theme.spacing[3],
					opacity: pressed ? 0.85 : 1,
					...theme.shape.shadow.sm,
					shadowColor: theme.colors.shadow,
				})}
			>
				{item.latestPhoto ? (
					<Image
						source={{ uri: item.latestPhoto.filePath }}
						style={{
							width: 60,
							height: 60,
							borderRadius: theme.shape.radius.md,
							backgroundColor: theme.colors.surfaceSecondary,
						}}
						resizeMode="cover"
					/>
				) : (
					<View
						style={{
							width: 60,
							height: 60,
							borderRadius: theme.shape.radius.md,
							backgroundColor: theme.colors.accentLight,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Text variant="title2" style={{ fontSize: 28 }}>
							🌿
						</Text>
					</View>
				)}

				<View style={{ flex: 1, gap: theme.spacing[1] }}>
					<Text variant="headline">{item.name}</Text>
					{item.species ? (
						<Text variant="caption1" color={theme.colors.textSecondary}>
							{item.species}
						</Text>
					) : null}
					{item.location ? (
						<View
							style={{
								alignSelf: 'flex-start',
								backgroundColor: theme.colors.surfaceElevated,
								paddingHorizontal: theme.spacing[2],
								paddingVertical: 2,
								borderRadius: theme.shape.radius.full,
							}}
						>
							<Text variant="caption1" color={theme.colors.textSecondary}>
								{item.location}
							</Text>
						</View>
					) : null}
					{item.latestPhoto ? (
						<Text variant="caption1" color={theme.colors.textTertiary}>
							📷 {formatPhotoAge(item.latestPhoto.takenAt)}
						</Text>
					) : (
						<Text variant="caption1" color={theme.colors.textTertiary}>
							No photos yet
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
					paddingHorizontal: theme.spacing[4],
					paddingTop: theme.spacing[3],
					paddingBottom: theme.spacing[1],
				}}
			>
				<Text variant="largeTitle">My Garden</Text>
				{allPlants.length > 0 && (
					<Text variant="subheadline" color={theme.colors.textSecondary}>
						{allPlants.length} {allPlants.length === 1 ? 'plant' : 'plants'}
					</Text>
				)}
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
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						paddingHorizontal: theme.spacing[8],
						gap: theme.spacing[4],
					}}
				>
					<Text style={{ fontSize: 64 }}>🌱</Text>
					<Text variant="title2" style={{ textAlign: 'center' }}>
						{search ? 'No plants found' : 'Start your garden'}
					</Text>
					<Text
						variant="body"
						color={theme.colors.textSecondary}
						style={{ textAlign: 'center' }}
					>
						{search
							? 'Try a different search term'
							: 'Add your first plant and start tracking its journey'}
					</Text>
					{!search && (
						<Pressable
							onPress={() => router.push('/(tabs)/plants/create')}
							style={({ pressed }) => ({
								backgroundColor: theme.colors.accent,
								paddingHorizontal: theme.spacing[6],
								paddingVertical: theme.spacing[3],
								borderRadius: theme.shape.radius.full,
								opacity: pressed ? 0.85 : 1,
							})}
						>
							<Text variant="headline" color={theme.colors.textInverse}>
								Add First Plant
							</Text>
						</Pressable>
					)}
				</View>
			) : (
				<FlatList
					data={plants}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					contentContainerStyle={{
						gap: theme.spacing[2],
						paddingVertical: theme.spacing[3],
						paddingBottom: insets.bottom + theme.spacing[16],
					}}
				/>
			)}

			<Pressable
				onPress={() => router.push('/(tabs)/plants/create')}
				style={({ pressed }) => ({
					position: 'absolute',
					bottom: insets.bottom + theme.spacing[4],
					right: theme.spacing[4],
					width: 56,
					height: 56,
					borderRadius: theme.shape.radius.full,
					backgroundColor: theme.colors.accent,
					alignItems: 'center',
					justifyContent: 'center',
					opacity: pressed ? 0.85 : 1,
					...theme.shape.shadow.lg,
					shadowColor: theme.colors.shadow,
				})}
				accessibilityLabel="Add plant"
			>
				<Text variant="title2" color={theme.colors.textInverse} style={{ fontSize: 28, lineHeight: 32 }}>
					+
				</Text>
			</Pressable>
		</View>
	)
}
