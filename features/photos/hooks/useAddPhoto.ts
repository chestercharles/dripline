import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDrizzle } from '@/lib/db'
import { photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import { resizePhoto } from '@/lib/photos/resize'
import { savePhotoFile } from '@/lib/photos/storage'

interface AddPhotoInput {
	plantId: number
	sourceUri: string
	notes?: string
}

export function useAddPhoto() {
	const db = useDrizzle()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ plantId, sourceUri, notes }: AddPhotoInput) => {
			const timestamp = Date.now()
			const { fullUri, thumbnailUri } = await resizePhoto(sourceUri)
			const filePath = await savePhotoFile(plantId, fullUri, timestamp)
			const thumbnailPath = await savePhotoFile(
				plantId,
				thumbnailUri,
				timestamp + 1
			)

			const result = await db
				.insert(photos)
				.values({
					plantId,
					filePath,
					thumbnailPath,
					notes: notes || undefined,
				})
				.returning()

			return result[0]
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.photos.byPlant(variables.plantId),
			})
			queryClient.invalidateQueries({
				queryKey: queryKeys.plants.detail(variables.plantId),
			})
			queryClient.invalidateQueries({
				queryKey: queryKeys.plants.all,
			})
		},
	})
}
