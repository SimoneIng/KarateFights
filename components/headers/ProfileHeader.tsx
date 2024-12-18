import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeSwitcher from '../commons/ThemeSwitcher';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system'; 
import { useSession } from '@/context/SessionProvider';
import { destroyQueries } from '@/database/Database';
import { router } from 'expo-router';

const ProfileHeader = () => {

    const { theme, toggleTheme } = useTheme();  
    const { top } = useSafeAreaInsets();
    const { logout } = useSession();
    const db = useSQLiteContext(); 


    const deleteDatabase = async () => {
        const databaseName = 'KarateFightsDb.db'; 
        try {
          const dbPath = `${FileSystem.documentDirectory}SQLite/${databaseName}`; 
          const dbExists = await FileSystem.getInfoAsync(dbPath); 
    
          if(dbExists.exists){
            await FileSystem.deleteAsync(dbPath);
            Alert.alert("Database Eliminato");  
          }
    
        } catch(error) {
          Alert.alert('Errore', error as string); 
        }
      }
    
      const handleLogout = () => {
        // distruzione tabelle
        db.execAsync(destroyQueries)
        deleteDatabase()
        logout()
        router.navigate('/')
      }

    return (
        <View style={[styles.container, {paddingTop: top+20, backgroundColor: theme.background}]}>
            <Text style={[styles.title, {color: theme.textPrimary}]}>Impostazioni</Text>
            <TouchableOpacity onPress={toggleTheme}>
                <ThemeSwitcher />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons size={24} name='log-out-outline' color={theme.textPrimary} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 32, 
        fontFamily: 'Roboto-Bold'
    }
});

export default ProfileHeader; 