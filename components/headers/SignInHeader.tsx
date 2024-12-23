import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignInHeader = () => {

    const { theme, toggleTheme } = useTheme();  
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingTop: top+20, backgroundColor: theme.background}]}>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    title: {
        fontSize: 32, 
        fontFamily: 'RobotoBold'
    }
});

export default SignInHeader; 