import { useQuery } from '@tanstack/react-query'
import { useDrizzle } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function useSettings() {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.settings.all,
		queryFn: async () => {
			const rows = await db.select().from(settings)
			return Object.fromEntries(rows.map((r) => [r.key, r.value]))
		},
	})
}
