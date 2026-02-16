import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import { deletePhotoFile } from '@/lib/photos/storage'
import type { Photo } from '../types'

export function useDeletePhoto() {
	const db = useDrizzle()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (photo: Photo) => {
			deletePhotoFile(photo.filePath)
			if (photo.thumbnailPath) {
				deletePhotoFile(photo.thumbnailPath)
			}
			await db.delete(photos).where(eq(photos.id, photo.id))
			return photo
		},
		onSuccess: (photo) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.photos.byPlant(photo.plantId),
			})
			queryClient.invalidateQueries({
				queryKey: queryKeys.plants.detail(photo.plantId),
			})
		},
	})
}
