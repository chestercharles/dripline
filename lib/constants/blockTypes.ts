export type BlockType =
	| 'house'
	| 'driveway'
	| 'patio'
	| 'fence'
	| 'walkway'
	| 'garden_bed'
	| 'lawn'

export interface BlockTypeConfig {
	type: BlockType
	label: string
	color: string
	plantable: boolean
}

export const BLOCK_TYPES: BlockTypeConfig[] = [
	{ type: 'house', label: 'House', color: '#D4C5A9', plantable: false },
	{
		type: 'driveway',
		label: 'Driveway',
		color: '#C0C0C0',
		plantable: false,
	},
	{ type: 'patio', label: 'Patio', color: '#C9B89E', plantable: false },
	{ type: 'fence', label: 'Fence', color: '#8B7355', plantable: false },
	{
		type: 'walkway',
		label: 'Walkway',
		color: '#D0C8B8',
		plantable: false,
	},
	{
		type: 'garden_bed',
		label: 'Garden Bed',
		color: '#7CB07A',
		plantable: true,
	},
	{ type: 'lawn', label: 'Lawn', color: '#90C77D', plantable: true },
]

export const BLOCK_TYPE_MAP = Object.fromEntries(
	BLOCK_TYPES.map((bt) => [bt.type, bt])
) as Record<BlockType, BlockTypeConfig>
