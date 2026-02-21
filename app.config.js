export default {
	expo: {
		name: 'Dripline',
		slug: 'dripline',
		owner: 'chet-co',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/icon.png',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		splash: {
			image: './assets/splash-icon.png',
			resizeMode: 'contain',
			backgroundColor: '#0F2417',
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: 'com.dripline.app',
			appleTeamId: 'JV7963MV4V',
			infoPlist: {
				ITSAppUsesNonExemptEncryption: false,
			},
		},
		scheme: 'dripline',
		plugins: [
			'expo-router',
			'expo-sqlite',
			'expo-secure-store',
			[
				'expo-camera',
				{
					cameraPermission: 'Allow Dripline to take photos of your plants.',
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
		extra: {
			eas: {
				projectId: 'db747518-585e-4fb4-b3fb-fd3a7610ae84',
			},
		},
	},
}
