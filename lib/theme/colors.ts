const palette = {
	sage50: '#F0F4F0',
	sage100: '#D9E3D9',
	sage200: '#B3C7B3',
	sage300: '#8DAB8D',
	sage400: '#6E916E',
	sage500: '#5A7A5E',
	sage600: '#4A6A4E',
	sage700: '#3A5A3E',
	sage800: '#2A4A2E',
	sage900: '#1A3A1E',

	neutral50: '#FAFAFA',
	neutral100: '#F5F5F5',
	neutral200: '#E5E5E5',
	neutral300: '#D4D4D4',
	neutral400: '#A3A3A3',
	neutral500: '#737373',
	neutral600: '#525252',
	neutral700: '#404040',
	neutral800: '#262626',
	neutral900: '#171717',

	red400: '#F87171',
	red500: '#EF4444',
	red600: '#DC2626',
	amber400: '#FBBF24',
	amber500: '#F59E0B',
	blue400: '#60A5FA',
	blue500: '#3B82F6',
	green400: '#4ADE80',
	green500: '#22C55E',

	white: '#FFFFFF',
	black: '#000000',
} as const

export const lightColors = {
	background: palette.neutral50,
	surface: palette.white,
	surfaceElevated: palette.white,
	surfaceSecondary: palette.neutral100,

	text: palette.neutral900,
	textSecondary: palette.neutral500,
	textTertiary: palette.neutral400,
	textInverse: palette.white,

	accent: palette.sage500,
	accentLight: palette.sage100,
	accentDark: palette.sage700,

	border: palette.neutral200,
	borderLight: palette.neutral100,

	success: palette.green500,
	warning: palette.amber500,
	error: palette.red500,
	info: palette.blue500,

	successLight: '#DCFCE7',
	warningLight: '#FEF3C7',
	errorLight: '#FEE2E2',
	infoLight: '#DBEAFE',

	tabBar: palette.white,
	tabBarBorder: palette.neutral200,
	tabBarActive: palette.sage500,
	tabBarInactive: palette.neutral400,

	shadow: 'rgba(0, 0, 0, 0.08)',
} as const

export const darkColors = {
	background: palette.neutral900,
	surface: palette.neutral800,
	surfaceElevated: palette.neutral700,
	surfaceSecondary: palette.neutral800,

	text: palette.neutral50,
	textSecondary: palette.neutral400,
	textTertiary: palette.neutral500,
	textInverse: palette.neutral900,

	accent: palette.sage400,
	accentLight: palette.sage800,
	accentDark: palette.sage200,

	border: palette.neutral700,
	borderLight: palette.neutral800,

	success: palette.green400,
	warning: palette.amber400,
	error: palette.red400,
	info: palette.blue400,

	successLight: '#14532D',
	warningLight: '#78350F',
	errorLight: '#7F1D1D',
	infoLight: '#1E3A5F',

	tabBar: palette.neutral800,
	tabBarBorder: palette.neutral700,
	tabBarActive: palette.sage400,
	tabBarInactive: palette.neutral500,

	shadow: 'rgba(0, 0, 0, 0.3)',
} as const

export type Colors = typeof lightColors
