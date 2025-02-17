import React, { useEffect, useState } from 'react'
import { SplashScreen, Stack } from 'expo-router';
import { ThemeProvider, themes, useTheme } from '@/context/ThemeProvider';
import { useFonts } from 'expo-font'; 
import { SessionProvider } from '@/context/SessionProvider';
import { initializeDatabase } from '@/database/Database';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AthleteHeader from '@/components/headers/AthleteHeader';
import FlashMessage from "react-native-flash-message";
import { ActivityIndicator, Alert, View } from 'react-native';
import { useDatabaseStore } from '@/context/DatabaseProvider';
import SettingsHeader from '@/components/headers/SettingsHeader';
import * as Updates from 'expo-updates'; 

SplashScreen.preventAutoHideAsync(); 

const StackLayout = () => {

  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name='index' /> 
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='(auth)' />
      
      {/* Modals */}
      <Stack.Screen name="modals/newMatch" options={{
        presentation: 'modal', 
        headerTitle: 'Aggiungi Incontro', 
        headerTitleAlign: 'center', 
        animation: 'slide_from_right'
      }} />
      <Stack.Screen name="modals/selectTournament" options={{
        presentation: 'modal', 
        headerTitle: 'Seleziona Gara', 
        headerTitleAlign: 'center',
        animation: 'slide_from_right'
      }} />
      <Stack.Screen name="modals/selectAthletes" options={{
        presentation: 'modal', 
        headerTitle: 'Seleziona Atleti', 
        headerTitleAlign: 'center',
        animation: 'slide_from_right'
      }} /> 
      <Stack.Screen name="athlete/[id]" options={{
        headerShown: true, 
        header: () => <AthleteHeader />, 
        animation: 'slide_from_right'
      }} />
      <Stack.Screen name="tournament/[id]" options={{
        animation: 'slide_from_right'
      }} />
      <Stack.Screen name="match/[id]" options={{
        animation: 'slide_from_right'
      }} />
      <Stack.Screen name='modals/settings' options={{
        header: () => <SettingsHeader />, 
        headerShown: true, 
        animation: 'slide_from_right', 
        presentation: 'fullScreenModal',
        headerTitle: 'Impostazioni', 
        headerTitleAlign: 'center',
      }} /> 
    </Stack>
  )

}

const RootLayout = () => {

  const { fetchAthletes, fetchMatches, fetchTournaments } = useDatabaseStore()
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const { theme } = useTheme(); 

  const [loaded] = useFonts({
    'RobotoExtraLight': require('../assets/fonts/RobotoMono-ExtraLight.ttf'),  
    'RobotoLigtht': require('../assets/fonts/RobotoMono-Light.ttf'), 
    'RobotoRegular': require('../assets/fonts/RobotoMono-Regular.ttf'), 
    'RobotoMedium': require('../assets/fonts/RobotoMono-Medium.ttf'), 
    'RobotoBold': require('../assets/fonts/RobotoMono-Bold.ttf'), 
  }); 

  async function checkForUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Riavvia l'app per applicare l'aggiornamento
        await Updates.reloadAsync();
      }
    } catch (error) {
      // Gestione degli errori
      console.error('Errore durante il controllo degli aggiornamenti:', error);
    }
  }

  useEffect(() => {
    async function checkUpdate() {
      setIsCheckingUpdate(true);
      try {
        // Verifica se siamo in modalità development
        if (!__DEV__) {
          await checkForUpdates();
        }
      } finally {
        setIsCheckingUpdate(false);
      }
    }
    
    checkUpdate();
}, []);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase()
        await fetchAthletes() 
        await fetchTournaments()
        await fetchMatches() 
      } catch(error) { 
        Alert.alert("Errore", error as string)
      }
    }
    setupDatabase()
  }, [])

  useEffect(() => {
    if(loaded){
      SplashScreen.hideAsync(); 
    }
  }, [loaded]); 
  
  if(!loaded){
    return null; 
  }

  if(isCheckingUpdate){
    return (
      // Mostra un loader o splash screen mentre verifica gli aggiornamenti
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SessionProvider>
    <ThemeProvider>
    <GestureHandlerRootView>
    <BottomSheetModalProvider>

      <StackLayout />
      <FlashMessage position='center' />

    </BottomSheetModalProvider>
    </GestureHandlerRootView>
    </ThemeProvider>
    </SessionProvider>
  )
}

export default RootLayout; 
