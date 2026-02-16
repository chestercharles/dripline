import { useQuery } from '@tanstack/react-query'
import { eq, desc } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants, yards, zones, photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { PlantWithRelations } from '../types'

export function usePlant(id: number) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.plants.detail(id),
		queryFn: async (): Promise<PlantWithRelations | null> => {
			const rows = await db
				.select()
				.from(plants)
				.where(eq(plants.id, id))
				.limit(1)

			const plant = rows[0]
			if (!plant) return null

			const [yardRows, zoneRows, photoRows] = await Promise.all([
				plant.yardId
					? db
							.select()
							.from(yards)
							.where(eq(yards.id, plant.yardId))
							.limit(1)
					: Promise.resolve([]),
				plant.zoneId
					? db
							.select()
							.from(zones)
							.where(eq(zones.id, plant.zoneId))
							.limit(1)
					: Promise.resolve([]),
				db
					.select()
					.from(photos)
					.where(eq(photos.plantId, id))
					.orderBy(desc(photos.takenAt))
					.limit(1),
			])

			return {
				...plant,
				yard: yardRows[0] ?? null,
				zone: zoneRows[0] ?? null,
				latestPhoto: photoRows[0] ?? null,
			}
		},
	})
}
