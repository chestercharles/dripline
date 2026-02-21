import { useQuery } from '@tanstack/react-query'
import { like, desc, eq, inArray } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants, photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { Plant } from '../types'
import type { InferSelectModel } from 'drizzle-orm'

export interface PlantWithLatestPhoto extends Plant {
	latestPhoto: InferSelectModel<typeof photos> | null
}

export function usePlantsWithPhotos(search?: string) {
	const db = useDrizzle()

	return useQuery({
		queryKey: [...queryKeys.plants.all, 'withPhotos', search ?? ''],
		queryFn: async (): Promise<PlantWithLatestPhoto[]> => {
			const allPlants = search
				? await db.select().from(plants).where(like(plants.name, `%${search}%`))
				: await db.select().from(plants)

			if (allPlants.length === 0) return []

			const plantIds = allPlants.map((p) => p.id)

			const allPhotos = await db
				.select()
				.from(photos)
				.where(inArray(photos.plantId, plantIds))
				.orderBy(desc(photos.takenAt))

			const latestByPlant = new Map<number, InferSelectModel<typeof photos>>()
			for (const photo of allPhotos) {
				if (!latestByPlant.has(photo.plantId)) {
					latestByPlant.set(photo.plantId, photo)
				}
			}

			return allPlants.map((plant) => ({
				...plant,
				latestPhoto: latestByPlant.get(plant.id) ?? null,
			}))
		},
	})
}
