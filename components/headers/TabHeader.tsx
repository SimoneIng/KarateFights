import { View, Text ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
    title: string
}


const TabHeader = ({title}: Props) => {

    const { theme } = useTheme();  
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingTop: top, backgroundColor: theme.cardBackground}]}>
            <Text style={[styles.title, {color: '#fff'}]}>{title}</Text>
            <TouchableOpacity
                onPress={() => router.push("/modals/settings")}
            >
                <Ionicons name='settings-outline' size={24} color="#fff" /> 
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
        fontFamily: 'RobotoMono-Bold'
    }
});

export default TabHeader; 