import React, { } from 'react'
import { Stack } from 'expo-router'
import { useTheme } from '@/context/ThemeProvider'
import SignInHeader from '@/components/headers/SignInHeader'
import { StatusBar } from 'expo-status-bar'


const AuthLayoutStack = () => {

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