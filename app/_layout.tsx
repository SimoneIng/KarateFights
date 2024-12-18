import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '@/context/ThemeProvider';
import { useFonts } from 'expo-font'; 
import { SessionProvider } from '@/context/SessionProvider';
import { SQLiteProvider } from 'expo-sqlite';
import { setupQueries } from '@/database/Database';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AthleteHeader from '@/components/headers/AthleteHeader';
import FlashMessage from "react-native-flash-message";

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
    </Stack>
  )

}

const RootLayout = () => {

  const [loaded] = useFonts({
    'RobotoExtraLight': require('../assets/fonts/RobotoMono-ExtraLight.ttf'),  
    'RobotoLigtht': require('../assets/fonts/RobotoMono-Light.ttf'), 
    'RobotoRegular': require('../assets/fonts/RobotoMono-Regular.ttf'), 
    'RobotoMedium': require('../assets/fonts/RobotoMono-Medium.ttf'), 
    'RobotoBold': require('../assets/fonts/RobotoMono-Bold.ttf'), 
  }); 

  useEffect(() => {
    if(loaded){
      SplashScreen.hideAsync(); 
    }
  }, [loaded]); 
  
  if(!loaded){
    return null; 
  }

  return (
    <SQLiteProvider 
    databaseName='KarateFightsDB.db' 
    onInit={async (db) => {
      for(const query of setupQueries){
        await db.execAsync(query); 
        }
    }}>
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
    </SQLiteProvider>
  )
}

export default RootLayout; 
