export type AIProvider = 'openai' | 'anthropic'

export interface AIAnalysisResult {
	speciesGuess: string | null
	healthAssessment: string
	issues: string[]
	recommendations: string[]
	confidence: number
}

export interface PlantIdentification {
	name: string
	species: string
	commonName: string
	sunExposure: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
	wateringNeeds: string
	soilType: string
	careNotes: string
	confidence: number
}

export interface AIRequestConfig {
	provider: AIProvider
	apiKey: string
	model: string
}
