import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDrizzle } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function useUpdateSetting() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async ({ key, value }: { key: string; value: string }) => {
			await db
				.insert(settings)
				.values({ key, value })
				.onConflictDoUpdate({
					target: settings.key,
					set: { value },
				})
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.settings.all })
		},
	})
}
