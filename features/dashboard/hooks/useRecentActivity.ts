import { useQuery } from '@tanstack/react-query'
import { sql, desc } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { healthLogs, photos, plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

interface ActivityItem {
	id: number
	type: 'health_log' | 'photo'
	plantId: number
	plantName: string
	date: string
	preview: string
}

export function useRecentActivity() {
	const db = useDrizzle()

	return useQuery({
		queryKey: [...queryKeys.healthLogs.all, 'recent'],
		queryFn: async (): Promise<ActivityItem[]> => {
			const sevenDaysAgo = new Date()
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
			const cutoff = sevenDaysAgo.toISOString()

			const recentLogs = await db
				.select({
					id: healthLogs.id,
					plantId: healthLogs.plantId,
					plantName: plants.name,
					date: healthLogs.createdAt,
					note: healthLogs.note,
					type: healthLogs.type,
				})
				.from(healthLogs)
				.innerJoin(plants, sql`${healthLogs.plantId} = ${plants.id}`)
				.where(sql`${healthLogs.createdAt} >= ${cutoff}`)
				.orderBy(desc(healthLogs.createdAt))
				.limit(10)

			const recentPhotos = await db
				.select({
					id: photos.id,
					plantId: photos.plantId,
					plantName: plants.name,
					date: photos.createdAt,
					notes: photos.notes,
				})
				.from(photos)
				.innerJoin(plants, sql`${photos.plantId} = ${plants.id}`)
				.where(sql`${photos.createdAt} >= ${cutoff}`)
				.orderBy(desc(photos.createdAt))
				.limit(10)

			const items: ActivityItem[] = [
				...recentLogs.map((l) => ({
					id: l.id,
					type: 'health_log' as const,
					plantId: l.plantId,
					plantName: l.plantName,
					date: l.date,
					preview: l.note ?? l.type,
				})),
				...recentPhotos.map((p) => ({
					id: p.id,
					type: 'photo' as const,
					plantId: p.plantId,
					plantName: p.plantName,
					date: p.date,
					preview: p.notes ?? 'Photo added',
				})),
			]

			items.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			)
			return items.slice(0, 10)
		},
	})
}
