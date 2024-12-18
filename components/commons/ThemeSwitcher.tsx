import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';

const ThemeSwitcher = () => {

    const { theme, toggleTheme, isDark } = useTheme(); 
    
    return (
    <View>
        <Pressable onPress={toggleTheme}>
            {isDark 
                ? <Ionicons name='sunny-outline' size={24} color={theme.accent} />
                : <Ionicons name='moon-outline' size={24} color={theme.accent} />
            }     
        </Pressable>
    </View>
  )
}

export default ThemeSwitcher; 