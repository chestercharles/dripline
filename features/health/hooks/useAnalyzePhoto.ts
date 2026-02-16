import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import * as SecureStore from 'expo-secure-store'
import { useDrizzle } from '@/lib/db'
import { photos, healthLogs } from '@/lib/db/schema'
import { analyzePlantHealth } from '@/lib/ai'
import type { AIProvider } from '@/lib/ai'
import { queryKeys } from '@/lib/query/keys'

interface AnalyzePhotoInput {
	photoId: number
	plantId: number
}

export function useAnalyzePhoto() {
	const db = useDrizzle()
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async ({ photoId, plantId }: AnalyzePhotoInput) => {
			const openaiKey = await SecureStore.getItemAsync('openai_api_key')
			const anthropicKey = await SecureStore.getItemAsync(
				'anthropic_api_key'
			)

			let provider: AIProvider
			let apiKey: string

			if (anthropicKey) {
				provider = 'anthropic'
				apiKey = anthropicKey
			} else if (openaiKey) {
				provider = 'openai'
				apiKey = openaiKey
			} else {
				throw new Error(
					'No API key configured. Add one in Settings.'
				)
			}

			const photoRows = await db
				.select()
				.from(photos)
				.where(eq(photos.id, photoId))
			const photo = photoRows[0]
			if (!photo) throw new Error('Photo not found')

			const result = await analyzePlantHealth(
				photo.filePath,
				provider,
				apiKey
			)

			await db
				.update(photos)
				.set({ aiAnalysis: JSON.stringify(result) })
				.where(eq(photos.id, photoId))

			await db.insert(healthLogs).values({
				plantId,
				type: 'ai_analysis',
				note: JSON.stringify(result),
				photoId,
			})

			return result
		},
		onSuccess: (_, { plantId }) => {
			qc.invalidateQueries({
				queryKey: queryKeys.healthLogs.byPlant(plantId),
			})
			qc.invalidateQueries({ queryKey: queryKeys.healthLogs.all })
			qc.invalidateQueries({
				queryKey: queryKeys.photos.byPlant(plantId),
			})
		},
	})
}
