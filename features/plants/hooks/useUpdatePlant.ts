import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eq, sql } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { UpdatePlantInput } from '../types'

export function useUpdatePlant() {
	const db = useDrizzle()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			...input
		}: UpdatePlantInput & { id: number }) => {
			const result = await db
				.update(plants)
				.set({ ...input, updatedAt: sql`(datetime('now'))` })
				.where(eq(plants.id, id))
				.returning()
			return result[0]
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.plants.all })
			queryClient.invalidateQueries({
				queryKey: queryKeys.plants.detail(variables.id),
			})
		},
	})
}
