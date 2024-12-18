import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Athlete } from '@/database/types';
import { useTheme } from '@/context/ThemeProvider';

interface AthletesListProps {
  athletes: Athlete[]; 
  onSelectedAthlete: (id: number) => void; 
}

interface AthleteItemProps {
  athlete: Athlete; 
  onPress: (id: number) => void; 
}

const AthleteCard = ({ athlete, onPress }:AthleteItemProps) => {
    
    const { theme } = useTheme(); 

    return (
        <TouchableOpacity onPress={() => onPress(athlete.AthleteId)} style={[styles.athleteCard, {backgroundColor: theme.cardBackground}]}>
            <Text style={[styles.athleteName, {color: '#fff'}]}>
                {athlete.firstname + " " + athlete.lastname}
            </Text>
            <Ionicons name='arrow-forward-circle-outline' size={24} color={theme.accent} />
        </TouchableOpacity>
    )
}

const AthletesList = ({ athletes, onSelectedAthlete }:AthletesListProps) => {

    const { theme } = useTheme(); 

    return (
        <FlatList 
            data={athletes}
            contentContainerStyle={styles.contentContainer}
            renderItem={({item}) => <AthleteCard athlete={item} onPress={() => onSelectedAthlete(item.AthleteId)} />}
            keyExtractor={item => item.AthleteId.toString()}
            showsVerticalScrollIndicator={false}
            
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.text, {color: theme.textPrimary}]}>Nessun Atleta</Text>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    athleteCard: {
        marginVertical: 5, 
        paddingVertical: 20,
        paddingHorizontal: 15, 
        borderRadius: 5, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
    }, 
    athleteName: {
        textAlign: 'center', 
        fontSize: 18, 
        fontFamily: 'RobotoMono-Bold'
    }, 
    contentContainer: {
        paddingBottom: 60, 
    }, 
    emptyContainer: {
        flex: 1,   
        justifyContent: 'center', 
        alignItems: 'center'
    }, 
    text: {
        fontSize: 18, 
        fontFamily: 'RobotoMono-Bold' 
    }
});

export default AthletesList; 