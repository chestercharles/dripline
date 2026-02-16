import type { AIAnalysisResult } from './types'
import { buildAnalysisPrompt } from './prompts'

export async function analyzeWithOpenAI(
	base64Image: string,
	apiKey: string
): Promise<AIAnalysisResult> {
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: buildAnalysisPrompt(),
				},
				{
					role: 'user',
					content: [
						{
							type: 'image_url',
							image_url: {
								url: `data:image/jpeg;base64,${base64Image}`,
							},
						},
					],
				},
			],
			max_tokens: 1024,
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error(`OpenAI API error: ${res.status} - ${err}`)
	}

	const data = await res.json()
	const content = data.choices[0].message.content
	return JSON.parse(content) as AIAnalysisResult
}
