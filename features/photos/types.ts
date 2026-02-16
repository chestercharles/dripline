import type { InferSelectModel } from 'drizzle-orm'
import type { photos } from '@/lib/db/schema'

export type Photo = InferSelectModel<typeof photos>

export interface CreatePhotoInput {
	plantId: number
	filePath: string
	thumbnailPath?: string
	notes?: string
}
