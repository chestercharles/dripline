import { useQuery } from '@tanstack/react-query'
import { eq, desc, sql } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { healthLogs, photos } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { HealthLogWithPhoto } from '../types'

export function useHealthLogs(plantId: number) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.healthLogs.byPlant(plantId),
		queryFn: async (): Promise<HealthLogWithPhoto[]> => {
			const rows = await db
				.select({
					id: healthLogs.id,
					plantId: healthLogs.plantId,
					note: healthLogs.note,
					type: healthLogs.type,
					photoId: healthLogs.photoId,
					createdAt: healthLogs.createdAt,
					photoPath: photos.filePath,
					thumbnailPath: photos.thumbnailPath,
				})
				.from(healthLogs)
				.leftJoin(photos, sql`${healthLogs.photoId} = ${photos.id}`)
				.where(eq(healthLogs.plantId, plantId))
				.orderBy(desc(healthLogs.createdAt))

			return rows as HealthLogWithPhoto[]
		},
	})
}
