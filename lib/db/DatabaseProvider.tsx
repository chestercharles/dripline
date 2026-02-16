import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { openDatabaseAsync } from 'expo-sqlite'
import type { SQLiteDatabase } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import * as schema from './schema'
import { runMigrations } from './migrations'
import { seedDatabase } from './seed'

type DrizzleDB = ExpoSQLiteDatabase<typeof schema>

interface DatabaseContextValue {
	db: DrizzleDB
	sqlite: SQLiteDatabase
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null)

export function useDatabase() {
	const context = useContext(DatabaseContext)
	if (!context) {
		throw new Error('useDatabase must be used within a DatabaseProvider')
	}
	return context
}

export function useDrizzle() {
	return useDatabase().db
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<DatabaseContextValue | null>(null)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		let mounted = true

		async function init() {
			try {
				const sqlite = await openDatabaseAsync('dripline.db')
				await runMigrations(sqlite)
				await seedDatabase(sqlite)
				const db = drizzle(sqlite, { schema })
				if (mounted) {
					setState({ db, sqlite })
				}
			} catch (e) {
				if (mounted) {
					setError(
						e instanceof Error ? e : new Error('Database init failed')
					)
				}
			}
		}

		init()
		return () => {
			mounted = false
		}
	}, [])

	if (error) throw error
	if (!state) return null

	return (
		<DatabaseContext.Provider value={state}>
			{children}
		</DatabaseContext.Provider>
	)
}
