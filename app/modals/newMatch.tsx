import { View, Text, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useMatches } from '@/database/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { Tournament, Athlete, Match } from '@/database/types';
import NewMatchForm from '@/components/forms/newMatchForm';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { useDatabaseStore } from '@/context/DatabaseProvider';

type MatchFormData = Omit<Match, 'id'>;

const NewMatch = () => {

    const { tournamentParams, akaParams, aoParams } = useLocalSearchParams(); 
    const { addMatch } = useDatabaseStore(); 
    const { theme } = useTheme(); 
    const { top } = useSafeAreaInsets();

    const tournament: Tournament = JSON.parse(tournamentParams as string)
    const akaAthlete: Athlete = JSON.parse(akaParams as string)
    const aoAthlete: Athlete = JSON.parse(aoParams as string)

    const showSuccessMessage = () => {
        showMessage({
            message: 'Incontro Creato',
            type: 'success',
            floating: true,
            style: {
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'flex-start',
            gap: 10,
            }, 
            icon: () => <Ionicons name='checkmark-circle-outline' size={24} color='#fff' />
        })
    }

    const handleSubmit = async (data: MatchFormData) => {
        addMatch(data)
         .then()
         .catch(error => Alert.alert("Errore inserimento Incontro", error))
         showSuccessMessage(); 
        router.dismissAll(); 
    }

    return (
        <View style={[styles.container, {paddingTop: top+10, backgroundColor: theme.background}]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back-outline' size={36} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.label, {color: theme.textPrimary}]}>Step. 3/3</Text>
            </View>
            <View style={styles.content}>
                <NewMatchForm 
                    tournament={tournament} 
                    akaAthlete={akaAthlete} 
                    aoAthlete={aoAthlete} 
                    onSubmit={handleSubmit} 
                    />
            </View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        paddingBottom: 20
    }, 
    header: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 20, 
        paddingHorizontal: 30
    },
    label: {
        fontSize: 16, 
        fontFamily: 'RobotoMono-Regular'
    }, 
    content: {
        flex: 1
    }
});

export default NewMatch; 