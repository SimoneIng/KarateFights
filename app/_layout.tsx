import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeProvider';
import { useFonts } from 'expo-font'; 
import { SessionProvider } from '@/context/SessionProvider';
import { initializeDatabase } from '@/database/Database';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AthleteHeader from '@/components/headers/AthleteHeader';
import FlashMessage from "react-native-flash-message";
import { Alert } from 'react-native';
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

  const [loaded] = useFonts({
    'RobotoExtraLight': require('../assets/fonts/RobotoMono-ExtraLight.ttf'),  
    'RobotoLigtht': require('../assets/fonts/RobotoMono-Light.ttf'), 
    'RobotoRegular': require('../assets/fonts/RobotoMono-Regular.ttf'), 
    'RobotoMedium': require('../assets/fonts/RobotoMono-Medium.ttf'), 
    'RobotoBold': require('../assets/fonts/RobotoMono-Bold.ttf'), 
  }); 

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Controlla se è disponibile un aggiornamento
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // Scarica l'aggiornamento
          await Updates.fetchUpdateAsync();
          // Applica l'aggiornamento e riavvia l'app
          await Updates.reloadAsync();
        }
      } catch (error) {
        // Gestisci eventuali errori
        console.log(error)
        Alert.alert("Errore durante l'aggiornamento", error as string);
      }
    }

    checkForUpdates();
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
