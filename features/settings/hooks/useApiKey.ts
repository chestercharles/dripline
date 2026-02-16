import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import type { AIProvider } from '@/lib/ai'

const STORE_KEYS: Record<AIProvider, string> = {
	openai: 'openai_api_key',
	anthropic: 'anthropic_api_key',
}

export function useApiKey(provider: AIProvider) {
	return useQuery({
		queryKey: ['apiKey', provider],
		queryFn: async () => {
			return await SecureStore.getItemAsync(STORE_KEYS[provider])
		},
	})
}

export function useSetApiKey() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async ({
			provider,
			apiKey,
		}: {
			provider: AIProvider
			apiKey: string
		}) => {
			await SecureStore.setItemAsync(STORE_KEYS[provider], apiKey)
		},
		onSuccess: (_, { provider }) => {
			qc.invalidateQueries({ queryKey: ['apiKey', provider] })
		},
	})
}
