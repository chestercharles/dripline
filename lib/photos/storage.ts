import { Paths, File, Directory } from 'expo-file-system'

export function getPhotoDir(plantId: number): Directory {
	return new Directory(Paths.document, 'photos', String(plantId))
}

export function ensurePhotoDir(plantId: number): Directory {
	const dir = getPhotoDir(plantId)
	if (!dir.exists) {
		dir.create()
	}
	return dir
}

export async function savePhotoFile(
	plantId: number,
	sourceUri: string,
	timestamp: number
): Promise<string> {
	const dir = ensurePhotoDir(plantId)
	const destFile = new File(dir, `${timestamp}.jpg`)
	const sourceFile = new File(sourceUri)
	sourceFile.copy(destFile)
	return destFile.uri
}

export function deletePhotoFile(filePath: string): void {
	const file = new File(filePath)
	if (file.exists) {
		file.delete()
	}
}
