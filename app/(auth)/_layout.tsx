import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useTheme } from '@/context/ThemeProvider'
import SignInHeader from '@/components/headers/SignInHeader'
import { StatusBar } from 'expo-status-bar'
import * as NavigationBar from 'expo-navigation-bar'
import { Platform } from 'react-native'

const AuthLayoutStack = () => {

  const { theme } = useTheme();

  return (
    <Stack screenOptions={{
      headerShadowVisible: false, 
      headerStyle: {
        backgroundColor: theme.background, 
      }, 
      contentStyle: {
        backgroundColor: theme.background,
      }
    }}>
        <Stack.Screen name='sign-in' options={{
          header: () => <SignInHeader />, 
        }} />
    </Stack>
  )
}

const AuthLayout = () => {

  const { theme, isDark } = useTheme();

    useEffect(() => {
      if(Platform.OS === 'android'){
        NavigationBar.setBackgroundColorAsync(theme.background)
      }
    }, [])

  return (
    <>
      <StatusBar backgroundColor={theme.background} style={isDark ? 'light' : 'dark'} />
      <AuthLayoutStack />
    </>
  )

}

export default AuthLayout; 