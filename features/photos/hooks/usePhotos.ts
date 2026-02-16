import { useQuery } from '@tanstack/react-query'
import { eq, desc } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function usePhotos(plantId: number) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.photos.byPlant(plantId),
		queryFn: async () => {
			return db
				.select()
				.from(photos)
				.where(eq(photos.plantId, plantId))
				.orderBy(desc(photos.takenAt))
		},
	})
}
