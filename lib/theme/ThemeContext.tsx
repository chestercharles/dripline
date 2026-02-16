import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { lightColors, darkColors } from './colors'
import type { Colors } from './colors'
import { spacing } from './spacing'
import type { Spacing } from './spacing'
import { typography } from './typography'
import type { Typography } from './typography'
import { shape } from './shape'
import type { Shape } from './shape'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface Theme {
	colors: Colors
	spacing: Spacing
	typography: Typography
	shape: Shape
	isDark: boolean
}

interface ThemeContextValue {
	theme: Theme
	mode: ThemeMode
	setMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
	const systemScheme = useColorScheme()
	const [mode, setModeState] = useState<ThemeMode>('system')

	const setMode = useCallback((newMode: ThemeMode) => {
		setModeState(newMode)
	}, [])

	const isDark =
		mode === 'system' ? systemScheme === 'dark' : mode === 'dark'

	const theme = useMemo<Theme>(
		() => ({
			colors: isDark ? darkColors : lightColors,
			spacing,
			typography,
			shape,
			isDark,
		}),
		[isDark]
	)

	const value = useMemo(
		() => ({ theme, mode, setMode }),
		[theme, mode, setMode]
	)

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	)
}
