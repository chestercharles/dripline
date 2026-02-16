import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { ThemeProvider } from '@/lib/theme'
import { DatabaseProvider } from '@/lib/db'
import { queryClient } from '@/lib/query/client'

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<DatabaseProvider>
						<BottomSheetModalProvider>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(tabs)" />
							</Stack>
						</BottomSheetModalProvider>
					</DatabaseProvider>
				</QueryClientProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	)
}
