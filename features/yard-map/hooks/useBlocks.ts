import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useDrizzle } from '@/lib/db'
import { blocks } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query/keys'
import type { BlockType } from '@/lib/constants/blockTypes'

export function useBlocks(yardId: number) {
	const db = useDrizzle()

	return useQuery({
		queryKey: queryKeys.blocks.byYard(yardId),
		queryFn: () => db.select().from(blocks).where(eq(blocks.yardId, yardId)),
	})
}

export function useCreateBlock() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: (data: {
			yardId: number
			type: BlockType
			gridX: number
			gridY: number
			width: number
			height: number
			label?: string
			color?: string
		}) => db.insert(blocks).values(data),
		onSuccess: (_data, variables) => {
			qc.invalidateQueries({
				queryKey: queryKeys.blocks.byYard(variables.yardId),
			})
		},
	})
}

export function useUpdateBlock() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: number
			yardId: number
			gridX?: number
			gridY?: number
			width?: number
			height?: number
			label?: string
		}) => db.update(blocks).set(data).where(eq(blocks.id, id)),
		onSuccess: (_data, variables) => {
			qc.invalidateQueries({
				queryKey: queryKeys.blocks.byYard(variables.yardId),
			})
		},
	})
}

export function useDeleteBlock() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: ({ id }: { id: number; yardId: number }) =>
			db.delete(blocks).where(eq(blocks.id, id)),
		onSuccess: (_data, variables) => {
			qc.invalidateQueries({
				queryKey: queryKeys.blocks.byYard(variables.yardId),
			})
		},
	})
}
