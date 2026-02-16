export type AIProvider = 'openai' | 'anthropic'

export interface AIAnalysisResult {
	speciesGuess: string | null
	healthAssessment: string
	issues: string[]
	recommendations: string[]
	confidence: number
}

export interface AIRequestConfig {
	provider: AIProvider
	apiKey: string
	model: string
}
