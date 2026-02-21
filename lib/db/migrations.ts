import type { SQLiteDatabase } from 'expo-sqlite'

const MIGRATIONS = [
	{
		version: 1,
		up: `
			CREATE TABLE IF NOT EXISTS yards (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				grid_width INTEGER NOT NULL DEFAULT 12,
				grid_height INTEGER NOT NULL DEFAULT 16,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS blocks (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				yard_id INTEGER NOT NULL REFERENCES yards(id) ON DELETE CASCADE,
				type TEXT NOT NULL CHECK(type IN ('house','driveway','patio','fence','walkway','garden_bed','lawn')),
				label TEXT,
				grid_x INTEGER NOT NULL,
				grid_y INTEGER NOT NULL,
				width INTEGER NOT NULL DEFAULT 1,
				height INTEGER NOT NULL DEFAULT 1,
				color TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS zones (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				yard_id INTEGER NOT NULL REFERENCES yards(id) ON DELETE CASCADE,
				block_id INTEGER NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
				name TEXT,
				sun_exposure TEXT DEFAULT 'full_sun' CHECK(sun_exposure IN ('full_sun','partial_sun','partial_shade','full_shade')),
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS plants (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				yard_id INTEGER NOT NULL REFERENCES yards(id) ON DELETE CASCADE,
				zone_id INTEGER REFERENCES zones(id) ON DELETE SET NULL,
				name TEXT NOT NULL DEFAULT 'Unknown',
				species TEXT,
				drip_status TEXT DEFAULT 'working' CHECK(drip_status IN ('working','broken','no_drip_line')),
				grid_x REAL,
				grid_y REAL,
				notes TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now')),
				updated_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS photos (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
				file_path TEXT NOT NULL,
				thumbnail_path TEXT,
				notes TEXT,
				ai_analysis TEXT,
				taken_at TEXT NOT NULL DEFAULT (datetime('now')),
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS health_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
				note TEXT,
				type TEXT NOT NULL CHECK(type IN ('observation','ai_analysis','irrigation','treatment')),
				photo_id INTEGER REFERENCES photos(id) ON DELETE SET NULL,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS settings (
				key TEXT PRIMARY KEY,
				value TEXT
			);
		`,
	},
	{
		version: 2,
		up: `
			ALTER TABLE plants ADD COLUMN sun_exposure TEXT CHECK(sun_exposure IN ('full_sun','partial_sun','partial_shade','full_shade'));
			ALTER TABLE plants ADD COLUMN watering_needs TEXT;
			ALTER TABLE plants ADD COLUMN soil_type TEXT;
			ALTER TABLE plants ADD COLUMN care_notes TEXT;
			ALTER TABLE plants ADD COLUMN identified_at TEXT;
			ALTER TABLE plants ADD COLUMN hero_photo_path TEXT;
		`,
	},
]

export async function runMigrations(db: SQLiteDatabase) {
	await db.execAsync('PRAGMA journal_mode = WAL;')
	await db.execAsync('PRAGMA foreign_keys = ON;')

	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS _migrations (
			version INTEGER PRIMARY KEY,
			applied_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`)

	const applied = await db.getAllAsync<{ version: number }>(
		'SELECT version FROM _migrations ORDER BY version'
	)
	const appliedVersions = new Set(applied.map((r) => r.version))

	for (const migration of MIGRATIONS) {
		if (!appliedVersions.has(migration.version)) {
			await db.execAsync(migration.up)
			await db.runAsync(
				'INSERT INTO _migrations (version) VALUES (?)',
				migration.version
			)
		}
	}
}
