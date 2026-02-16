import type { AIAnalysisResult } from './types'
import { buildAnalysisPrompt } from './prompts'

export async function analyzeWithAnthropic(
	base64Image: string,
	apiKey: string
): Promise<AIAnalysisResult> {
	const res = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01',
		},
		body: JSON.stringify({
			model: 'claude-sonnet-4-5-20250929',
			max_tokens: 1024,
			system: buildAnalysisPrompt(),
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'image',
							source: {
								type: 'base64',
								media_type: 'image/jpeg',
								data: base64Image,
							},
						},
					],
				},
			],
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error(`Anthropic API error: ${res.status} - ${err}`)
	}

	const data = await res.json()
	const content = data.content[0].text
	return JSON.parse(content) as AIAnalysisResult
}
