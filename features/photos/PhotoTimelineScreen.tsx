import { useState, useCallback } from 'react'
import {
	View,
	FlatList,
	Image,
	Pressable,
	Alert,
	Dimensions,
	Modal,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useTheme } from '@/lib/theme'
import { Text, IconButton } from '@/components/ui'
import { usePlant } from '@/features/plants/hooks/usePlant'
import { usePhotos } from './hooks/usePhotos'
import { useAddPhoto } from './hooks/useAddPhoto'
import { useDeletePhoto } from './hooks/useDeletePhoto'
import type { Photo } from './types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GRID_COLS = 3
const THUMB_SIZE = (SCREEN_WIDTH - 2) / GRID_COLS

function formatPhotoDate(takenAt: string): string {
	const d = new Date(takenAt)
	const now = Date.now()
	const diff = now - d.getTime()
	const days = Math.floor(diff / 86400000)
	if (days === 0) return 'Today'
	if (days === 1) return 'Yesterday'
	if (days < 7) return `${days}d ago`
	if (days < 30) return `${Math.floor(days / 7)}w ago`
	return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
}

export function PhotoTimelineScreen() {
	const { plantId: plantIdStr } = useLocalSearchParams<{ plantId: string }>()
	const plantId = Number(plantIdStr)
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const router = useRouter()

	const { data: plant } = usePlant(plantId)
	const { data: photos = [], isLoading } = usePhotos(plantId)
	const addPhoto = useAddPhoto()
	const deletePhoto = useDeletePhoto()

	const [fullScreenPhoto, setFullScreenPhoto] = useState<Photo | null>(null)
	const [compareMode, setCompareMode] = useState(false)
	const [compareSelection, setCompareSelection] = useState<Photo[]>([])

	const handleAddPhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync()
		if (status !== 'granted') {
			Alert.alert('Camera access needed', 'Please allow camera access in Settings.')
			return
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ['images'],
			quality: 0.8,
		})

		if (result.canceled) return

		const asset = result.assets[0]
		const resized = await ImageManipulator.manipulateAsync(
			asset.uri,
			[{ resize: { width: 1200 } }],
			{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
		)

		await addPhoto.mutateAsync({ plantId, sourceUri: resized.uri })
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
	}

	const handlePhotoPress = (photo: Photo) => {
		if (compareMode) {
			const already = compareSelection.find((p) => p.id === photo.id)
			if (already) {
				setCompareSelection(compareSelection.filter((p) => p.id !== photo.id))
			} else if (compareSelection.length < 2) {
				const next = [...compareSelection, photo]
				setCompareSelection(next)
			}
			return
		}
		setFullScreenPhoto(photo)
	}

	const handleDeleteFullScreen = () => {
		if (!fullScreenPhoto) return
		Alert.alert('Delete Photo', 'Are you sure?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					await deletePhoto.mutateAsync(fullScreenPhoto)
					setFullScreenPhoto(null)
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				},
			},
		])
	}

	const renderPhoto = useCallback(
		({ item, index }: { item: Photo; index: number }) => {
			const isSelected = compareSelection.some((p) => p.id === item.id)
			const selIdx = compareSelection.findIndex((p) => p.id === item.id)

			return (
				<Pressable
					onPress={() => handlePhotoPress(item)}
					style={({ pressed }) => ({
						width: THUMB_SIZE,
						height: THUMB_SIZE,
						opacity: pressed ? 0.85 : 1,
						position: 'relative',
					})}
				>
					<Image
						source={{ uri: item.thumbnailPath ?? item.filePath }}
						style={{
							width: THUMB_SIZE,
							height: THUMB_SIZE,
							backgroundColor: theme.colors.surfaceSecondary,
						}}
						resizeMode="cover"
					/>
					{compareMode && (
						<View
							style={{
								position: 'absolute',
								top: 4,
								right: 4,
								width: 24,
								height: 24,
								borderRadius: 12,
								backgroundColor: isSelected ? theme.colors.accent : 'rgba(0,0,0,0.4)',
								borderWidth: 2,
								borderColor: '#fff',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{isSelected && (
								<Text variant="caption1" color="#fff" style={{ fontSize: 11 }}>
									{selIdx + 1}
								</Text>
							)}
						</View>
					)}
					{index === 0 && !compareMode && (
						<View
							style={{
								position: 'absolute',
								bottom: 4,
								left: 4,
								backgroundColor: 'rgba(0,0,0,0.5)',
								paddingHorizontal: 4,
								paddingVertical: 2,
								borderRadius: 4,
							}}
						>
							<Text variant="caption1" color="#fff" style={{ fontSize: 9 }}>
								Latest
							</Text>
						</View>
					)}
				</Pressable>
			)
		},
		[theme, compareMode, compareSelection]
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
					paddingVertical: theme.spacing[3],
					gap: theme.spacing[2],
				}}
			>
				<IconButton
					icon={<Text variant="title3" color={theme.colors.accent}>‹</Text>}
					onPress={() => router.back()}
					accessibilityLabel="Go back"
				/>
				<View style={{ flex: 1 }}>
					<Text variant="title2">Photos</Text>
					{plant && (
						<Text variant="caption1" color={theme.colors.textSecondary}>
							{plant.name} · {photos.length} photo{photos.length !== 1 ? 's' : ''}
						</Text>
					)}
				</View>
				{photos.length >= 2 && (
					<Pressable
						onPress={() => {
							setCompareMode(!compareMode)
							setCompareSelection([])
						}}
						style={({ pressed }) => ({
							paddingHorizontal: theme.spacing[3],
							paddingVertical: theme.spacing[1],
							borderRadius: theme.shape.radius.full,
							backgroundColor: compareMode ? theme.colors.accent : theme.colors.surfaceSecondary,
							opacity: pressed ? 0.7 : 1,
						})}
					>
						<Text
							variant="subheadline"
							color={compareMode ? theme.colors.textInverse : theme.colors.accent}
						>
							{compareMode ? 'Done' : 'Compare'}
						</Text>
					</Pressable>
				)}
				<Pressable
					onPress={handleAddPhoto}
					style={({ pressed }) => ({
						width: 36,
						height: 36,
						borderRadius: theme.shape.radius.full,
						backgroundColor: theme.colors.accent,
						alignItems: 'center',
						justifyContent: 'center',
						opacity: pressed ? 0.7 : 1,
					})}
				>
					<Text variant="title3" color={theme.colors.textInverse}>+</Text>
				</Pressable>
			</View>

			{compareMode && (
				<View
					style={{
						paddingHorizontal: theme.spacing[4],
						paddingBottom: theme.spacing[2],
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Text variant="caption1" color={theme.colors.textSecondary}>
						{compareSelection.length === 0
							? 'Tap two photos to compare'
							: compareSelection.length === 1
							? 'Select one more'
							: 'Ready to compare'}
					</Text>
					{compareSelection.length === 2 && (
						<Pressable
							onPress={() => router.push(`/(tabs)/plants/compare/${plantId}`)}
							style={({ pressed }) => ({
								paddingHorizontal: theme.spacing[3],
								paddingVertical: theme.spacing[1],
								backgroundColor: theme.colors.accent,
								borderRadius: theme.shape.radius.full,
								opacity: pressed ? 0.7 : 1,
							})}
						>
							<Text variant="subheadline" color={theme.colors.textInverse}>
								View →
							</Text>
						</Pressable>
					)}
				</View>
			)}

			{photos.length === 0 && !isLoading ? (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						gap: theme.spacing[4],
						paddingHorizontal: theme.spacing[8],
					}}
				>
					<Text style={{ fontSize: 56 }}>📷</Text>
					<Text variant="title2" style={{ textAlign: 'center' }}>
						No photos yet
					</Text>
					<Text
						variant="body"
						color={theme.colors.textSecondary}
						style={{ textAlign: 'center' }}
					>
						Start documenting this plant's journey. Take photos regularly to track its progress over time.
					</Text>
					<Pressable
						onPress={handleAddPhoto}
						style={({ pressed }) => ({
							backgroundColor: theme.colors.accent,
							paddingHorizontal: theme.spacing[6],
							paddingVertical: theme.spacing[3],
							borderRadius: theme.shape.radius.full,
							opacity: pressed ? 0.85 : 1,
						})}
					>
						<Text variant="headline" color={theme.colors.textInverse}>
							Take First Photo
						</Text>
					</Pressable>
				</View>
			) : (
				<FlatList
					data={photos}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderPhoto}
					numColumns={GRID_COLS}
					ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
					contentContainerStyle={{
						paddingBottom: insets.bottom + theme.spacing[8],
					}}
				/>
			)}

			<Modal
				visible={!!fullScreenPhoto}
				transparent
				animationType="fade"
				onRequestClose={() => setFullScreenPhoto(null)}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: 'rgba(0,0,0,0.95)',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<View
						style={{
							position: 'absolute',
							top: insets.top + theme.spacing[2],
							right: theme.spacing[4],
							left: theme.spacing[4],
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{fullScreenPhoto && (
							<Text variant="subheadline" color="#fff">
								{formatPhotoDate(fullScreenPhoto.takenAt)}
							</Text>
						)}
						<Pressable
							onPress={() => setFullScreenPhoto(null)}
							style={{ padding: theme.spacing[2] }}
						>
							<Text variant="title2" color="#fff">✕</Text>
						</Pressable>
					</View>

					{fullScreenPhoto && (
						<Image
							source={{ uri: fullScreenPhoto.filePath }}
							style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2 }}
							resizeMode="contain"
						/>
					)}

					<View
						style={{
							position: 'absolute',
							bottom: insets.bottom + theme.spacing[4],
							right: theme.spacing[4],
						}}
					>
						<Pressable
							onPress={handleDeleteFullScreen}
							style={({ pressed }) => ({
								backgroundColor: 'rgba(239,68,68,0.9)',
								paddingHorizontal: theme.spacing[4],
								paddingVertical: theme.spacing[2],
								borderRadius: theme.shape.radius.full,
								opacity: pressed ? 0.7 : 1,
							})}
						>
							<Text variant="subheadline" color="#fff">Delete</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	)
}
