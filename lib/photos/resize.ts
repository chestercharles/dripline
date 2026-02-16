import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

interface ResizeResult {
	fullUri: string
	thumbnailUri: string
}

export async function resizePhoto(uri: string): Promise<ResizeResult> {
	const full = await manipulateAsync(
		uri,
		[{ resize: { width: 1200 } }],
		{ compress: 0.8, format: SaveFormat.JPEG }
	)

	const thumbnail = await manipulateAsync(
		uri,
		[{ resize: { width: 200 } }],
		{ compress: 0.6, format: SaveFormat.JPEG }
	)

	return {
		fullUri: full.uri,
		thumbnailUri: thumbnail.uri,
	}
}
