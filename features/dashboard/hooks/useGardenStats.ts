import { useQuery } from '@tanstack/react-query'
import { desc, eq } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants, photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export interface GardenStats {
	totalPlants: number
	plantsWithPhotos: number
	plantsNeedingPhoto: Array<{ id: number; name: string; daysSince: number | null }>
	lastPhotoDate: string | null
}

export function useGardenStats() {
	const db = useDrizzle()

	return useQuery({
		queryKey: [...queryKeys.plants.all, 'gardenStats'],
		queryFn: async (): Promise<GardenStats> => {
			const allPlants = await db.select().from(plants)
			if (allPlants.length === 0) {
				return { totalPlants: 0, plantsWithPhotos: 0, plantsNeedingPhoto: [], lastPhotoDate: null }
			}

			const allPhotos = await db
				.select()
				.from(photos)
				.orderBy(desc(photos.takenAt))

			const latestByPlant = new Map<number, string>()
			for (const p of allPhotos) {
				if (!latestByPlant.has(p.plantId)) {
					latestByPlant.set(p.plantId, p.takenAt)
				}
			}

			const thirtyDaysAgo = Date.now() - 30 * 86400000
			const now = Date.now()

			const plantsNeedingPhoto = allPlants
				.filter((plant) => {
					const latest = latestByPlant.get(plant.id)
					if (!latest) return true
					return new Date(latest).getTime() < thirtyDaysAgo
				})
				.map((plant) => {
					const latest = latestByPlant.get(plant.id)
					const daysSince = latest
						? Math.floor((now - new Date(latest).getTime()) / 86400000)
						: null
					return { id: plant.id, name: plant.name, daysSince }
				})
				.slice(0, 5)

			const lastPhotoDate = allPhotos.length > 0 ? allPhotos[0].takenAt : null

			return {
				totalPlants: allPlants.length,
				plantsWithPhotos: latestByPlant.size,
				plantsNeedingPhoto,
				lastPhotoDate,
			}
		},
	})
}
