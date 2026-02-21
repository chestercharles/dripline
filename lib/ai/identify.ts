import { File } from 'expo-file-system'
import type { AIProvider, PlantIdentification } from './types'
import { buildIdentificationPrompt } from './prompts'

async function imageToBase64(imagePath: string): Promise<string> {
	const file = new File(imagePath)
	const buffer = await file.arrayBuffer()
	const bytes = new Uint8Array(buffer)
	let binary = ''
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return btoa(binary)
}

async function identifyWithOpenAI(
	base64Image: string,
	apiKey: string,
): Promise<PlantIdentification> {
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: 'gpt-4o',
			messages: [
				{ role: 'system', content: buildIdentificationPrompt() },
				{
					role: 'user',
					content: [
						{
							type: 'image_url',
							image_url: { url: `data:image/jpeg;base64,${base64Image}` },
						},
					],
				},
			],
			max_tokens: 512,
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error(`OpenAI API error: ${res.status} - ${err}`)
	}

	const data = await res.json()
	const content = data.choices[0].message.content
	return JSON.parse(content) as PlantIdentification
}

async function identifyWithAnthropic(
	base64Image: string,
	apiKey: string,
): Promise<PlantIdentification> {
	const res = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01',
		},
		body: JSON.stringify({
			model: 'claude-opus-4-6',
			max_tokens: 512,
			system: buildIdentificationPrompt(),
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
	return JSON.parse(content) as PlantIdentification
}

export async function identifyPlant(
	imagePath: string,
	provider: AIProvider,
	apiKey: string,
): Promise<PlantIdentification> {
	const base64 = await imageToBase64(imagePath)

	if (provider === 'openai') {
		return identifyWithOpenAI(base64, apiKey)
	}
	return identifyWithAnthropic(base64, apiKey)
}
