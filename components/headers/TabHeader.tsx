import { View, Text ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform } from 'react-native';

interface Props {
    title: string
}


const TabHeader = ({title}: Props) => {

    const { theme } = useTheme();  
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, {backgroundColor: theme.cardBackground,
            paddingTop: Platform.select({
                android: top+20, 
                ios: top
            })
        }]}>
            <Text style={[styles.title, {color: theme.accent}]}>{title}</Text>
            <TouchableOpacity
                onPress={() => router.push("/modals/settings")}
            >
                <Ionicons name='settings' size={24} color={theme.accent} /> 
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    title: {
        fontSize: 32, 
        fontFamily: 'RobotoBold'
    }
});

export default TabHeader; 