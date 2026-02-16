export interface HealthLog {
	id: number
	plantId: number
	note: string | null
	type: 'observation' | 'ai_analysis' | 'irrigation' | 'treatment'
	photoId: number | null
	createdAt: string
}

export interface HealthLogWithPhoto extends HealthLog {
	photoPath: string | null
	thumbnailPath: string | null
}
