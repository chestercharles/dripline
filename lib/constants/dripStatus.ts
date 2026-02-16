export type DripStatus = 'working' | 'broken' | 'no_drip_line'

export interface DripStatusConfig {
	value: DripStatus
	label: string
	colorKey: 'success' | 'error' | 'textSecondary'
}

export const DRIP_STATUSES: DripStatusConfig[] = [
	{ value: 'working', label: 'Working', colorKey: 'success' },
	{ value: 'broken', label: 'Broken', colorKey: 'error' },
	{ value: 'no_drip_line', label: 'No Drip Line', colorKey: 'textSecondary' },
]

export const DRIP_STATUS_MAP = Object.fromEntries(
	DRIP_STATUSES.map((ds) => [ds.value, ds])
) as Record<DripStatus, DripStatusConfig>
