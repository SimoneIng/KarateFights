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
import { ActivityIndicator, Alert, View, Text } from 'react-native';
import { useDatabaseStore } from '@/context/DatabaseProvider';
import SettingsHeader from '@/components/headers/SettingsHeader';
import useUpdates from '@/hooks/useUpdates';

SplashScreen.preventAutoHideAsync(); 

const StackLayout = () => {

  const { theme } = useTheme();

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: theme.background
      }
      }}>
      <Stack.Screen name='index' /> 
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='(auth)' />
      
      {/* Modals */}
      <Stack.Screen name="modals/newMatch" options={{
        presentation: 'fullScreenModal', 
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
  const { theme } = useTheme(); 
  const { checkForUpdates, isCheckingUpdate, updateError } = useUpdates(); 

  const [loaded] = useFonts({
    'RobotoExtraLight': require('../assets/fonts/RobotoMono-ExtraLight.ttf'),  
    'RobotoLigtht': require('../assets/fonts/RobotoMono-Light.ttf'), 
    'RobotoRegular': require('../assets/fonts/RobotoMono-Regular.ttf'), 
    'RobotoMedium': require('../assets/fonts/RobotoMono-Medium.ttf'), 
    'RobotoBold': require('../assets/fonts/RobotoMono-Bold.ttf'), 
  }); 

  useEffect(() => {
    if (!__DEV__) checkForUpdates();
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
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </View>
    );
  }

  if(updateError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 21, textAlign: 'center' }}>Errore durante l'aggiornamento: {updateError}</Text>
      </View>
    )
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
