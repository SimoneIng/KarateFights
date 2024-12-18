import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface Props {
    title: string
}


const TabHeader = ({title}: Props) => {

    const { theme } = useTheme();  
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingTop: top+20, backgroundColor: theme.background}]}>
            <Text style={[styles.title, {color: theme.textPrimary}]}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 32, 
        fontFamily: 'RobotoMono-Bold'
    }
});

export default TabHeader; 