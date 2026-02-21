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
	confidence: number
	sunExposure: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
	wateringFrequency: string
	wateringDepth: string
	droughtTolerance: 'high' | 'medium' | 'low'
	heatTolerance: 'high' | 'medium' | 'low'
	matureHeight: string
	matureWidth: string
	growthRate: 'fast' | 'moderate' | 'slow'
	soilType: string
	bloomSeason: string | null
	bloomColor: string | null
	nativeToSonoran: boolean
	wildlifeValue: string
	toxicity: string
	commonProblems: string[]
	bestPlantingTime: string
	fertilizing: string
	careNotes: string
}

export interface AIRequestConfig {
	provider: AIProvider
	apiKey: string
	model: string
}
