import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const MatchHeader = () => {

    const { theme } = useTheme();  
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingTop: top+20, backgroundColor: theme.background}]}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name='arrow-back-outline' size={41} color={theme.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name='trash-bin-outline' size={24} color={theme.error} />
            </TouchableOpacity>
            <StatusBar style='dark' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default MatchHeader; 