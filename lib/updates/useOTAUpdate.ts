import { useEffect } from 'react'
import * as Updates from 'expo-updates'

/**
 * Checks for an OTA update on app launch. If one is available,
 * downloads it and reloads immediately. Silent — no UI required.
 *
 * Only runs in production (expo-updates is a no-op in development).
 */
export function useOTAUpdate() {
	useEffect(() => {
		if (__DEV__) return

		async function checkAndApply() {
			try {
				const check = await Updates.checkForUpdateAsync()
				if (!check.isAvailable) return

				await Updates.fetchUpdateAsync()
				await Updates.reloadAsync()
			} catch {
				// Network failure or update error — continue with current bundle
			}
		}

		checkAndApply()
	}, [])
}
