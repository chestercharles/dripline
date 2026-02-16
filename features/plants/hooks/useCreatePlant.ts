import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDrizzle } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { CreatePlantInput } from '../types'

export function useCreatePlant() {
	const db = useDrizzle()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (input: CreatePlantInput) => {
			const result = await db.insert(plants).values(input).returning()
			return result[0]
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.plants.all })
		},
	})
}
