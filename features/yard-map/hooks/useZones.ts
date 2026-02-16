import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { zones } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { SunExposure } from '@/lib/constants/sunExposure'

export function useZones(yardId: number) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.zones.byYard(yardId),
		queryFn: () => db.select().from(zones).where(eq(zones.yardId, yardId)),
	})
}

export function useUpdateZone() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: number
			yardId: number
			name?: string
			sunExposure?: SunExposure
		}) => db.update(zones).set(data).where(eq(zones.id, id)),
		onSuccess: (_data, variables) => {
			qc.invalidateQueries({
				queryKey: queryKeys.zones.byYard(variables.yardId),
			})
		},
	})
}
