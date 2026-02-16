import { View, Image, Pressable } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Text, Card, StatusBadge } from '@/components/ui'
import type { Photo } from './types'

interface PhotoCardProps {
	photo: Photo
	onPress?: () => void
}

export function PhotoCard({ photo, onPress }: PhotoCardProps) {
	const { theme } = useTheme()
	const displayPath = photo.thumbnailPath ?? photo.filePath
	const date = new Date(photo.takenAt).toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})

	const content = (
		<Card style={{ gap: theme.spacing[3] }}>
			<Image
				source={{ uri: displayPath }}
				style={{
					width: '100%',
					height: 200,
					borderRadius: theme.shape.radius.md,
					backgroundColor: theme.colors.surfaceSecondary,
				}}
				resizeMode="cover"
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Text variant="subheadline" color={theme.colors.textSecondary}>
					{date}
				</Text>
				{photo.aiAnalysis && (
					<StatusBadge
						label="AI Analyzed"
						color={theme.colors.info}
					/>
				)}
			</View>
			{photo.notes && (
				<Text variant="body" color={theme.colors.textSecondary}>
					{photo.notes}
				</Text>
			)}
		</Card>
	)

	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
			>
				{content}
			</Pressable>
		)
	}

	return content
}
