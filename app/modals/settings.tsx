import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { useSession } from '@/context/SessionProvider'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '@/components/commons/CustomButton'

const Profile = () => {
  
  const { theme, toggleTheme, isDark } = useTheme(); 
  const { user } = useSession(); 

  const handleSaveData = () => {

  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.titleLabel, {color: theme.textPrimary, fontFamily: 'RobotoBold'}]}>{user?.firstname}</Text>
        <Text style={[styles.titleLabel, {color: theme.textPrimary, fontFamily: 'RobotoBold'}]}>{user?.lastname}</Text>
      </View>

      <View style={{
        flexDirection: 'column',
        gap: 10, 
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'center',
          alignItems: 'center', 
          gap: 10
        }}>
          <Text style={{color: theme.textPrimary, fontSize: 18, fontFamily: 'RobotoBold'}}>Attenzione</Text>
          <Ionicons name='warning' size={24} color={theme.error} />
        </View>
        <Text style={{color: theme.textPrimary ,fontSize: 14, alignSelf: 'center', fontFamily: 'RobotoRegular'}}>Questa sezione è ancora da completare.</Text>
      </View>

      {/* <View style={styles.buttons}>
        <CustomButton title='Cambia Tema' iconName='color-palette' handlePress={toggleTheme} />
        <CustomButton title='Salva Dati' iconName='document' handlePress={handleSaveData} />
      </View> */}

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    flex: 1, 
    gap: 30,
    justifyContent: 'space-around'
  }, 
  headerContainer: {
    padding: 30
  }, 
  titleLabel: {
    fontSize: 28
  }, 
  label: {
    fontSize: 21, 
    fontFamily: 'RobotoMedium', 
    marginBottom: 5 
  }, 
  labelContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center',  
    gap: 5
  }, 
  content: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
    padding: 20
  },
  buttons: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    gap: 10
  }
});

export default Profile; 