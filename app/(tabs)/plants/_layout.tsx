import { Stack } from 'expo-router'

export default function PlantsLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen
				name="[id]"
				options={{ presentation: 'formSheet' }}
			/>
			<Stack.Screen
				name="create"
				options={{ presentation: 'modal' }}
			/>
			<Stack.Screen name="photos/[plantId]" />
			<Stack.Screen name="compare/[plantId]" />
			<Stack.Screen name="health/[plantId]" />
		</Stack>
	)
}
