import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const yards = sqliteTable('yards', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	gridWidth: integer('grid_width').notNull().default(12),
	gridHeight: integer('grid_height').notNull().default(16),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
})

export const blocks = sqliteTable('blocks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	yardId: integer('yard_id')
		.notNull()
		.references(() => yards.id, { onDelete: 'cascade' }),
	type: text('type', {
		enum: [
			'house',
			'driveway',
			'patio',
			'fence',
			'walkway',
			'garden_bed',
			'lawn',
		],
	}).notNull(),
	label: text('label'),
	gridX: integer('grid_x').notNull(),
	gridY: integer('grid_y').notNull(),
	width: integer('width').notNull().default(1),
	height: integer('height').notNull().default(1),
	color: text('color'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
})

export const zones = sqliteTable('zones', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	yardId: integer('yard_id')
		.notNull()
		.references(() => yards.id, { onDelete: 'cascade' }),
	blockId: integer('block_id')
		.notNull()
		.references(() => blocks.id, { onDelete: 'cascade' }),
	name: text('name'),
	sunExposure: text('sun_exposure', {
		enum: ['full_sun', 'partial_sun', 'partial_shade', 'full_shade'],
	}).default('full_sun'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
})

export const plants = sqliteTable('plants', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	yardId: integer('yard_id')
		.notNull()
		.references(() => yards.id, { onDelete: 'cascade' }),
	zoneId: integer('zone_id').references(() => zones.id, {
		onDelete: 'set null',
	}),
	name: text('name').notNull().default('Unknown'),
	species: text('species'),
	dripStatus: text('drip_status', {
		enum: ['working', 'broken', 'no_drip_line'],
	}).default('working'),
	gridX: real('grid_x'),
	gridY: real('grid_y'),
	notes: text('notes'),
	sunExposure: text('sun_exposure', {
		enum: ['full_sun', 'partial_sun', 'partial_shade', 'full_shade'],
	}),
	wateringNeeds: text('watering_needs'),
	soilType: text('soil_type'),
	careNotes: text('care_notes'),
	identifiedAt: text('identified_at'),
	heroPhotoPath: text('hero_photo_path'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`),
})

export const photos = sqliteTable('photos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	plantId: integer('plant_id')
		.notNull()
		.references(() => plants.id, { onDelete: 'cascade' }),
	filePath: text('file_path').notNull(),
	thumbnailPath: text('thumbnail_path'),
	notes: text('notes'),
	aiAnalysis: text('ai_analysis'),
	takenAt: text('taken_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
})

export const healthLogs = sqliteTable('health_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	plantId: integer('plant_id')
		.notNull()
		.references(() => plants.id, { onDelete: 'cascade' }),
	note: text('note'),
	type: text('type', {
		enum: ['observation', 'ai_analysis', 'irrigation', 'treatment'],
	}).notNull(),
	photoId: integer('photo_id').references(() => photos.id, {
		onDelete: 'set null',
	}),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
})

export const settings = sqliteTable('settings', {
	key: text('key').primaryKey(),
	value: text('value'),
})
