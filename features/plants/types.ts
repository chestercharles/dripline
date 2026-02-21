import type { InferSelectModel } from 'drizzle-orm'
import type { plants, yards, zones, photos } from '@/lib/db/schema'
import type { DripStatus } from '@/lib/constants/dripStatus'

export type Plant = InferSelectModel<typeof plants>

export type SunExposure = 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'

export interface CreatePlantInput {
	name: string
	species?: string
	yardId: number
	zoneId?: number
	dripStatus?: DripStatus
	gridX?: number
	gridY?: number
	notes?: string
	sunExposure?: SunExposure
	wateringNeeds?: string
	soilType?: string
	careNotes?: string
	identifiedAt?: string
	heroPhotoPath?: string
}

export interface UpdatePlantInput {
	name?: string
	species?: string
	yardId?: number
	zoneId?: number
	dripStatus?: DripStatus
	gridX?: number
	gridY?: number
	notes?: string
	sunExposure?: SunExposure
	wateringNeeds?: string
	soilType?: string
	careNotes?: string
	identifiedAt?: string
	heroPhotoPath?: string
}

export interface PlantWithRelations extends Plant {
	yard?: InferSelectModel<typeof yards> | null
	zone?: InferSelectModel<typeof zones> | null
	latestPhoto?: InferSelectModel<typeof photos> | null
}
