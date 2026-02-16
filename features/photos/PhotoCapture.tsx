import { View } from 'react-native'
import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui'
import { captureFromCamera, pickFromLibrary } from '@/lib/photos/capture'

interface PhotoCaptureProps {
	onCapture: (uri: string) => void
}

export function PhotoCapture({ onCapture }: PhotoCaptureProps) {
	const { theme } = useTheme()

	const handleCamera = async () => {
		const uri = await captureFromCamera()
		if (uri) onCapture(uri)
	}

	const handleLibrary = async () => {
		const uri = await pickFromLibrary()
		if (uri) onCapture(uri)
	}

	return (
		<View style={{ gap: theme.spacing[3] }}>
			<Button title="Take Photo" onPress={handleCamera} />
			<Button
				title="Choose from Library"
				variant="outlined"
				onPress={handleLibrary}
			/>
		</View>
	)
}
