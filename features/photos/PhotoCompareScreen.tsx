import { useState } from 'react'
import { View, Image, ScrollView, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from '@/lib/theme'
import { Text, Card, IconButton } from '@/components/ui'
import { usePlant } from '@/features/plants/hooks/usePlant'
import { usePhotos } from './hooks/usePhotos'
import type { Photo } from './types'

function PhotoSlot({
	photo,
	photos,
	onSelect,
}: {
	photo: Photo | null
	photos: Photo[]
	onSelect: (photo: Photo) => void
}) {
	const { theme } = useTheme()
	const [showPicker, setShowPicker] = useState(false)

	const date = photo
		? new Date(photo.takenAt).toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			})
		: null

	return (
		<View style={{ flex: 1, gap: theme.spacing[2] }}>
			{photo ? (
				<Pressable onPress={() => setShowPicker(!showPicker)}>
					<Image
						source={{ uri: photo.thumbnailPath ?? photo.filePath }}
						style={{
							width: '100%',
							aspectRatio: 1,
							borderRadius: theme.shape.radius.md,
							backgroundColor: theme.colors.surfaceSecondary,
						}}
						resizeMode="cover"
					/>
				</Pressable>
			) : (
				<Pressable
					onPress={() => setShowPicker(!showPicker)}
					style={{
						width: '100%',
						aspectRatio: 1,
						borderRadius: theme.shape.radius.md,
						backgroundColor: theme.colors.surfaceSecondary,
						alignItems: 'center',
						justifyContent: 'center',
						borderWidth: 2,
						borderColor: theme.colors.border,
						borderStyle: 'dashed',
					}}
				>
					<Text
						variant="title2"
						color={theme.colors.textTertiary}
					>
						+
					</Text>
					<Text variant="footnote" color={theme.colors.textTertiary}>
						Select photo
					</Text>
				</Pressable>
			)}
			{date && (
				<Text
					variant="caption1"
					color={theme.colors.textSecondary}
					align="center"
				>
					{date}
				</Text>
			)}
			{showPicker && (
				<ScrollView
					style={{
						maxHeight: 120,
						borderRadius: theme.shape.radius.md,
						backgroundColor: theme.colors.surfaceElevated,
					}}
					contentContainerStyle={{
						flexDirection: 'row',
						flexWrap: 'wrap',
						gap: theme.spacing[1],
						padding: theme.spacing[2],
					}}
				>
					{photos.map((p) => (
						<Pressable
							key={p.id}
							onPress={() => {
								onSelect(p)
								setShowPicker(false)
							}}
						>
							<Image
								source={{
									uri: p.thumbnailPath ?? p.filePath,
								}}
								style={{
									width: 48,
									height: 48,
									borderRadius: theme.shape.radius.sm,
									backgroundColor:
										theme.colors.surfaceSecondary,
								}}
							/>
						</Pressable>
					))}
				</ScrollView>
			)}
		</View>
	)
}

export function PhotoCompareScreen() {
	const { plantId: plantIdStr } = useLocalSearchParams<{
		plantId: string
	}>()
	const plantId = Number(plantIdStr)
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()

	const { data: plant } = usePlant(plantId)
	const { data: photos = [] } = usePhotos(plantId)

	const [leftPhoto, setLeftPhoto] = useState<Photo | null>(null)
	const [rightPhoto, setRightPhoto] = useState<Photo | null>(null)

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.background }}
			contentContainerStyle={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom + theme.spacing[8],
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: theme.spacing[4],
					paddingVertical: theme.spacing[2],
					gap: theme.spacing[2],
				}}
			>
				<IconButton
					icon={
						<Text variant="title3" color={theme.colors.accent}>
							{'\u2039'}
						</Text>
					}
					onPress={() => router.back()}
					accessibilityLabel="Go back"
				/>
				<View style={{ flex: 1 }}>
					<Text variant="title2">Compare</Text>
					{plant && (
						<Text
							variant="subheadline"
							color={theme.colors.textSecondary}
						>
							{plant.name}
						</Text>
					)}
				</View>
			</View>

			<Card
				style={{
					margin: theme.spacing[4],
					gap: theme.spacing[4],
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						gap: theme.spacing[3],
					}}
				>
					<PhotoSlot
						photo={leftPhoto}
						photos={photos}
						onSelect={setLeftPhoto}
					/>
					<PhotoSlot
						photo={rightPhoto}
						photos={photos}
						onSelect={setRightPhoto}
					/>
				</View>
			</Card>
		</ScrollView>
	)
}
