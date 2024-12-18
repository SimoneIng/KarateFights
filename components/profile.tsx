import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { useSession } from '@/context/SessionProvider'
import { StatusBar } from 'expo-status-bar';
import MatchList from '@/components/lists/MatchList';
import { useMatches } from '@/database/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MatchWithAthletes } from '@/database/types';
import { router } from 'expo-router';

const Profile = () => {
  
  const { theme, isDark } = useTheme(); 
  const { user } = useSession(); 

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.titleLabel, {color: theme.textPrimary}]}>{user?.firstname}</Text>
        <Text style={[styles.titleLabel, {color: theme.textPrimary}]}>{user?.lastname}</Text>
      </View>

    <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    flex: 1 
  }, 
  titleLabel: {
    fontSize: 28
  }, 
  label: {
    fontSize: 21, 
    fontFamily: 'RobotoMono-Medium', 
    marginBottom: 5 
  }, 
  labelContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center',  
    gap: 5
  }, 
  content: {
    marginTop: 30, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 5,  
    flex: 1
  }
});

export default Profile; 