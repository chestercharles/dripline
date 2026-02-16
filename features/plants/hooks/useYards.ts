import { useQuery } from '@tanstack/react-query'
import { useDrizzle } from '@/lib/db'
import { yards } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function useYards() {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.yards.all,
		queryFn: async () => {
			return db.select().from(yards)
		},
	})
}
