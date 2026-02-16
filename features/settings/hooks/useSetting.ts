import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function useSetting(key: string) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.settings.key(key),
		queryFn: async () => {
			const rows = await db
				.select()
				.from(settings)
				.where(eq(settings.key, key))
			return rows[0]?.value ?? null
		},
	})
}
