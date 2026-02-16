import { useQuery } from '@tanstack/react-query'
import { like } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function usePlants(search?: string) {
	const db = useDrizzle()

	return useQuery({
		queryKey: [...queryKeys.plants.all, search ?? ''],
		queryFn: async () => {
			if (search) {
				return db
					.select()
					.from(plants)
					.where(like(plants.name, `%${search}%`))
			}
			return db.select().from(plants)
		},
	})
}
