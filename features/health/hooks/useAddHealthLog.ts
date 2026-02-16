import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDrizzle } from '@/lib/db'
import { healthLogs } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'

interface AddHealthLogInput {
	plantId: number
	type: 'observation' | 'ai_analysis' | 'irrigation' | 'treatment'
	note?: string
	photoId?: number
}

export function useAddHealthLog() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async (input: AddHealthLogInput) => {
			await db.insert(healthLogs).values({
				plantId: input.plantId,
				type: input.type,
				note: input.note,
				photoId: input.photoId,
			})
		},
		onSuccess: (_, input) => {
			qc.invalidateQueries({
				queryKey: queryKeys.healthLogs.byPlant(input.plantId),
			})
			qc.invalidateQueries({ queryKey: queryKeys.healthLogs.all })
		},
	})
}
