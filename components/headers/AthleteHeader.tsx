import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const AthleteHeader = () => {

    const { theme, isDark } = useTheme();  
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingTop: top+20, backgroundColor: theme.background}]}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name='arrow-back-circle' size={41} color={theme.accent} />
            </TouchableOpacity>
            <StatusBar style={isDark ? 'light' : 'dark'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, 
        paddingBottom: 20, 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center',
    }
});

export default AthleteHeader; 