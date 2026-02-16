import type { BlockType } from '@/lib/constants/blockTypes'

export interface Block {
	id: number
	yardId: number
	type: BlockType
	label: string | null
	gridX: number
	gridY: number
	width: number
	height: number
	color: string | null
}

export interface Zone {
	id: number
	yardId: number
	blockId: number
	name: string | null
	sunExposure: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
}

export interface PlantMarker {
	id: number
	name: string
	gridX: number
	gridY: number
	dripStatus: 'working' | 'broken' | 'no_drip_line'
}

export interface BlockPlacement {
	type: BlockType
	gridX: number
	gridY: number
	width: number
	height: number
}

export interface GridDimensions {
	columns: number
	rows: number
	cellSize: number
}
