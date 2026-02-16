import { useState } from 'react'
import { View, FlatList, Image, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import { Text, Button, EmptyState, IconButton } from '@/components/ui'
import { usePlant } from '@/features/plants/hooks/usePlant'
import { usePhotos } from './hooks/usePhotos'
import { useAddPhoto } from './hooks/useAddPhoto'
import { useDeletePhoto } from './hooks/useDeletePhoto'
import { useAnalyzePhoto } from '@/features/health/hooks'
import { AIAnalysisResultCard } from '@/features/health/AIAnalysisResultCard'
import type { AIAnalysisResult } from '@/lib/ai'
import { PhotoCard } from './PhotoCard'
import { PhotoCapture } from './PhotoCapture'
import type { Photo } from './types'

export function PhotoTimelineScreen() {
	const { plantId: plantIdStr } = useLocalSearchParams<{
		plantId: string
	}>()
	const plantId = Number(plantIdStr)
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()

	const { data: plant } = usePlant(plantId)
	const { data: photos = [], isLoading } = usePhotos(plantId)
	const addPhoto = useAddPhoto()
	const deletePhoto = useDeletePhoto()
	const analyzePhoto = useAnalyzePhoto()

	const [showCapture, setShowCapture] = useState(false)
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

	const handleCapture = async (uri: string) => {
		setShowCapture(false)
		await addPhoto.mutateAsync({ plantId, sourceUri: uri })
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
	}

	const handleDeletePhoto = (photo: Photo) => {
		Alert.alert('Delete Photo', 'Are you sure?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					await deletePhoto.mutateAsync(photo)
					setSelectedPhoto(null)
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					)
				},
			},
		])
	}

	const handlePhotoPress = (photo: Photo) => {
		if (selectedPhoto?.id === photo.id) {
			setSelectedPhoto(null)
		} else {
			setSelectedPhoto(photo)
		}
	}

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
					<Text variant="title2">Photos</Text>
					{plant && (
						<Text
							variant="subheadline"
							color={theme.colors.textSecondary}
						>
							{plant.name}
						</Text>
					)}
				</View>
				<IconButton
					icon={
						<Text variant="title3" color={theme.colors.accent}>
							+
						</Text>
					}
					onPress={() => setShowCapture(!showCapture)}
					accessibilityLabel="Add photo"
				/>
			</View>

			{showCapture && (
				<View
					style={{
						padding: theme.spacing[4],
						backgroundColor: theme.colors.surfaceElevated,
						margin: theme.spacing[4],
						borderRadius: theme.shape.radius.lg,
						...theme.shape.shadow.md,
						shadowColor: theme.colors.shadow,
					}}
				>
					<PhotoCapture onCapture={handleCapture} />
				</View>
			)}

			{selectedPhoto && (
				<View
					style={{
						margin: theme.spacing[4],
						gap: theme.spacing[3],
					}}
				>
					<Image
						source={{ uri: selectedPhoto.filePath }}
						style={{
							width: '100%',
							height: 300,
							borderRadius: theme.shape.radius.lg,
							backgroundColor: theme.colors.surfaceSecondary,
						}}
						resizeMode="contain"
					/>
					<Button
						title="Analyze Health"
						variant="outlined"
						loading={analyzePhoto.isPending}
						onPress={() =>
							analyzePhoto.mutate({
								photoId: selectedPhoto.id,
								plantId,
							})
						}
					/>
					{selectedPhoto.aiAnalysis && (() => {
						try {
							const result = JSON.parse(selectedPhoto.aiAnalysis) as AIAnalysisResult
							return <AIAnalysisResultCard result={result} />
						} catch {
							return null
						}
					})()}
					<Button
						title="Delete Photo"
						variant="ghost"
						destructive
						onPress={() => handleDeletePhoto(selectedPhoto)}
					/>
				</View>
			)}

			{photos.length === 0 && !isLoading ? (
				<EmptyState
					title="No photos yet"
					description="Take your first photo to start tracking this plant's growth."
					actionLabel="Add Photo"
					onAction={() => setShowCapture(true)}
				/>
			) : (
				<FlatList
					data={photos}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<View style={{ paddingHorizontal: theme.spacing[4] }}>
							<PhotoCard
								photo={item}
								onPress={() => handlePhotoPress(item)}
							/>
						</View>
					)}
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
