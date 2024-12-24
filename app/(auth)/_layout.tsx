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
      headerShown: false, 
    }}>
        <Stack.Screen name='sign-in' options={{
          header: () => <SignInHeader />, 
        }} />
    </Stack>
  )
}

const AuthLayout = () => {

  return (
    <>
      <StatusBar style='dark' />
      <AuthLayoutStack />
    </>
  )

}

export default AuthLayout; 