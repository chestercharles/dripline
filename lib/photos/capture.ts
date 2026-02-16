import * as ImagePicker from 'expo-image-picker'

export async function captureFromCamera(): Promise<string | null> {
	const permission = await ImagePicker.requestCameraPermissionsAsync()
	if (!permission.granted) return null

	const result = await ImagePicker.launchCameraAsync({
		mediaTypes: ['images'],
		quality: 1,
	})

	if (result.canceled) return null
	return result.assets[0].uri
}

export async function pickFromLibrary(): Promise<string | null> {
	const permission =
		await ImagePicker.requestMediaLibraryPermissionsAsync()
	if (!permission.granted) return null

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ['images'],
		quality: 1,
	})

	if (result.canceled) return null
	return result.assets[0].uri
}
