import { useState } from 'react'
import { ScrollView, View, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'
import type { ThemeMode } from '@/lib/theme'
import type { AIProvider } from '@/lib/ai'
import { geocodeZip } from '@/lib/weather'
import {
	Text,
	Card,
	TextInput,
	Button,
	SegmentedControl,
} from '@/components/ui'
import { useSetting } from './hooks/useSetting'
import { useUpdateSetting } from './hooks/useUpdateSetting'
import { useApiKey, useSetApiKey } from './hooks/useApiKey'

function LocationSection() {
	const { theme } = useTheme()
	const { spacing } = theme
	const zipSetting = useSetting('zip')
	const locationName = useSetting('location_name')
	const updateSetting = useUpdateSetting()
	const [zip, setZip] = useState('')
	const [geocoding, setGeocoding] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleGeocode = async () => {
		if (!zip.trim()) return
		setGeocoding(true)
		setError(null)
		try {
			const result = await geocodeZip(zip.trim())
			if (!result) {
				setError('Location not found')
				return
			}
			await updateSetting.mutateAsync({ key: 'zip', value: zip.trim() })
			await updateSetting.mutateAsync({
				key: 'lat',
				value: String(result.lat),
			})
			await updateSetting.mutateAsync({
				key: 'lon',
				value: String(result.lon),
			})
			await updateSetting.mutateAsync({
				key: 'location_name',
				value: `${result.name}, ${result.country}`,
			})
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		} catch {
			setError('Failed to geocode')
		} finally {
			setGeocoding(false)
		}
	}

	return (
		<Card style={{ gap: spacing[3] }}>
			<Text variant="headline">Location</Text>
			{locationName.data && (
				<Text variant="body" color={theme.colors.textSecondary}>
					{locationName.data}
				</Text>
			)}
			<View style={{ flexDirection: 'row', gap: spacing[2] }}>
				<View style={{ flex: 1 }}>
					<TextInput
						placeholder={zipSetting.data ?? 'Zip code'}
						value={zip}
						onChangeText={setZip}
						keyboardType="number-pad"
						maxLength={5}
						returnKeyType="done"
						error={error ?? undefined}
					/>
				</View>
				<Button
					title={geocoding ? '' : 'Lookup'}
					onPress={handleGeocode}
					loading={geocoding}
					disabled={geocoding || !zip.trim()}
					style={{ alignSelf: 'flex-start', marginTop: 0 }}
				/>
			</View>
		</Card>
	)
}

function ApiKeysSection() {
	const { theme } = useTheme()
	const { spacing } = theme
	const [provider, setProvider] = useState<AIProvider>('openai')
	const apiKey = useApiKey(provider)
	const setApiKey = useSetApiKey()
	const [keyInput, setKeyInput] = useState('')
	const [saving, setSaving] = useState(false)

	const maskedKey = apiKey.data
		? `${apiKey.data.slice(0, 6)}${'*'.repeat(20)}`
		: null

	const handleSave = async () => {
		if (!keyInput.trim()) return
		setSaving(true)
		try {
			await setApiKey.mutateAsync({ provider, apiKey: keyInput.trim() })
			setKeyInput('')
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		} finally {
			setSaving(false)
		}
	}

	return (
		<Card style={{ gap: spacing[3] }}>
			<Text variant="headline">AI Provider</Text>
			<SegmentedControl
				segments={[
					{ value: 'openai' as AIProvider, label: 'OpenAI' },
					{ value: 'anthropic' as AIProvider, label: 'Anthropic' },
				]}
				selected={provider}
				onChange={setProvider}
			/>
			{maskedKey && (
				<Text variant="subheadline" color={theme.colors.textSecondary}>
					Current: {maskedKey}
				</Text>
			)}
			<TextInput
				placeholder="API key"
				value={keyInput}
				onChangeText={setKeyInput}
				secureTextEntry
				autoCapitalize="none"
				autoCorrect={false}
			/>
			<Button
				title="Save Key"
				onPress={handleSave}
				loading={saving}
				disabled={saving || !keyInput.trim()}
			/>
		</Card>
	)
}

function ThemeSection() {
	const { theme, mode, setMode } = useTheme()
	const { spacing } = theme

	return (
		<Card style={{ gap: spacing[3] }}>
			<Text variant="headline">Theme</Text>
			<SegmentedControl
				segments={[
					{ value: 'system' as ThemeMode, label: 'System' },
					{ value: 'light' as ThemeMode, label: 'Light' },
					{ value: 'dark' as ThemeMode, label: 'Dark' },
				]}
				selected={mode}
				onChange={setMode}
			/>
		</Card>
	)
}

export function SettingsScreen() {
	const { theme } = useTheme()
	const insets = useSafeAreaInsets()
	const { spacing } = theme

	return (
		<ScrollView
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
			}}
			contentContainerStyle={{
				paddingTop: insets.top + spacing[4],
				paddingHorizontal: spacing[4],
				paddingBottom: insets.bottom + spacing[8],
				gap: spacing[4],
			}}
		>
			<Text variant="largeTitle">Settings</Text>
			<LocationSection />
			<ApiKeysSection />
			<ThemeSection />
		</ScrollView>
	)
}
