import React, { useEffect } from 'react'
import { Tabs } from 'expo-router';
import TabIcon from '@/components/commons/tabIcon';
import { useTheme } from '@/context/ThemeProvider';
import ProfileHeader from '@/components/headers/ProfileHeader';
import TabHeader from '@/components/headers/TabHeader';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar'
import CustomTabBar from '@/components/CustomTabBar';

const TabsLayoutTabs = () => {

  const { theme } = useTheme(); 

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true, 
        animation: 'shift'
      }}
    >
        <Tabs.Screen name='tournaments' options={{
          header: () => <TabHeader title='Gare' />, 
        }} />
        <Tabs.Screen name='athletes' options={{
          header: () => <TabHeader title='Atleti' />, 
        }} />
        <Tabs.Screen name='matches' options={{
          header: () => <TabHeader title='Incontri' />, 
        }} />
        {/* <Tabs.Screen name='profile' options={{
          header: () => <ProfileHeader />, 
        }} /> */}
    </Tabs>
  )
}

const TabsLayout = () => {

  const { theme, isDark } = useTheme(); 

    useEffect(() => {
      NavigationBar.setBackgroundColorAsync(theme.background)
    })

  return (
    <>
      <StatusBar backgroundColor={theme.background} style={isDark ? 'dark' : 'dark'} />
      <TabsLayoutTabs /> 
    </>
  )
}

export default TabsLayout; 