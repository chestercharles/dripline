import { useQuery } from '@tanstack/react-query'
import { eq, and, isNotNull } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { PlantMarker } from '../types'

export function usePlantMarkers(yardId: number) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.plants.byYard(yardId),
		queryFn: async (): Promise<PlantMarker[]> => {
			const rows = await db
				.select({
					id: plants.id,
					name: plants.name,
					gridX: plants.gridX,
					gridY: plants.gridY,
					dripStatus: plants.dripStatus,
				})
				.from(plants)
				.where(
					and(
						eq(plants.yardId, yardId),
						isNotNull(plants.gridX),
						isNotNull(plants.gridY)
					)
				)

			return rows
				.filter((r) => r.gridX != null && r.gridY != null)
				.map((r) => ({
					id: r.id,
					name: r.name,
					gridX: r.gridX!,
					gridY: r.gridY!,
					dripStatus: r.dripStatus ?? 'working',
				}))
		},
	})
}
