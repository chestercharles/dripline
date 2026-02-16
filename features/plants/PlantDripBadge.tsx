import { useTheme } from '@/lib/theme'
import { StatusBadge } from '@/components/ui'
import { DRIP_STATUS_MAP } from '@/lib/constants/dripStatus'
import type { DripStatus } from '@/lib/constants/dripStatus'

interface PlantDripBadgeProps {
	status: DripStatus
}

export function PlantDripBadge({ status }: PlantDripBadgeProps) {
	const { theme } = useTheme()
	const config = DRIP_STATUS_MAP[status]

	return (
		<StatusBadge
			label={config.label}
			color={theme.colors[config.colorKey]}
		/>
	)
}
