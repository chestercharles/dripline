export default {
	expo: {
		name: 'Dripline',
		slug: 'dripline',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/icon.png',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		splash: {
			image: './assets/splash-icon.png',
			resizeMode: 'contain',
			backgroundColor: '#ffffff',
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: 'com.dripline.app',
		},
		scheme: 'dripline',
		plugins: [
			'expo-router',
			'expo-sqlite',
			'expo-secure-store',
			[
				'expo-camera',
				{
					cameraPermission:
						'Allow Dripline to take photos of your plants.',
				},
			],
			[
				'expo-image-picker',
				{
					photosPermission:
						'Allow Dripline to access your photos to add plant images.',
				},
			],
		],
	},
}
