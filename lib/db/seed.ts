import type { SQLiteDatabase } from 'expo-sqlite'

export async function seedDatabase(db: SQLiteDatabase) {
	const existing = await db.getFirstAsync<{ count: number }>(
		'SELECT COUNT(*) as count FROM yards'
	)
	if (existing && existing.count > 0) return

	await db.runAsync('INSERT INTO yards (name) VALUES (?)', 'Front Yard')
	await db.runAsync('INSERT INTO yards (name) VALUES (?)', 'Back Yard')
}
