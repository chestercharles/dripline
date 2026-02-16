import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

export function useDeletePlant() {
	const db = useDrizzle()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: number) => {
			await db.delete(plants).where(eq(plants.id, id))
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.plants.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.photos.all })
		},
	})
}
