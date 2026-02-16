import { File } from 'expo-file-system'
import type { AIProvider, AIAnalysisResult } from './types'
import { analyzeWithOpenAI } from './openai'
import { analyzeWithAnthropic } from './anthropic'

export async function analyzePlantHealth(
	imagePath: string,
	provider: AIProvider,
	apiKey: string
): Promise<AIAnalysisResult> {
	const file = new File(imagePath)
	const buffer = await file.arrayBuffer()
	const bytes = new Uint8Array(buffer)
	let binary = ''
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	const base64 = btoa(binary)

	if (provider === 'openai') {
		return analyzeWithOpenAI(base64, apiKey)
	}
	return analyzeWithAnthropic(base64, apiKey)
}
