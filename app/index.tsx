import React from 'react'
import { Redirect } from 'expo-router';
import { useSession } from '@/context/SessionProvider';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/context/ThemeProvider';

const Root = () => {
    
    const { isAuthenticated, loading } = useSession(); 
    const { theme } = useTheme(); 

    if(loading){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background}}>
                <ActivityIndicator size="large" color={theme.textPrimary} />
            </View>
        )
    }

    return (
        <>
            {isAuthenticated
                ? <Redirect href="/matches" />
                : <Redirect href="/sign-in" />
            }
        </>
    )
}

export default Root;