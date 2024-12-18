import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Tournament } from '@/database/types';
import { useTheme } from '@/context/ThemeProvider';

interface TournamentsListProps {
  tournaments: Tournament[]; 
  onSelectedTournament: (id: number) => void; 
}

interface TournamentItemProps {
  tournament: Tournament; 
  onPress: (id: number) => void; 
}

const TorunamentCard = ({ tournament, onPress }:TournamentItemProps) => {
    
    const { theme } = useTheme(); 

    return (
        <TouchableOpacity onPress={() => onPress(tournament.id)} style={[styles.tournamentCard, {backgroundColor: theme.cardBackground}]}>
            <View style={styles.container}>
                <Text style={[styles.title, {color: '#fff'}]}>{tournament.name}</Text>
                <Text style={[styles.subTitle, {color: '#ccc'}]}>{tournament.date}</Text>
            </View>
            <Ionicons name='arrow-forward-circle-outline' size={24} color={theme.accent} />
        </TouchableOpacity>
    )
}

const TournamentList = ({ tournaments, onSelectedTournament }:TournamentsListProps) => {

    const { theme } = useTheme(); 

    return (
        <FlatList 
            data={tournaments}
            contentContainerStyle={styles.contentContainer}
            renderItem={({item}) => <TorunamentCard tournament={item} onPress={() => onSelectedTournament(item.id)} />}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.text, {color: theme.textPrimary}]}>Nessuna Gara</Text>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    tournamentCard: {
        marginVertical: 5, 
        paddingVertical: 20,
        paddingHorizontal: 15, 
        borderRadius: 5, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    }, 
    container: {
        display: 'flex', 
        flexDirection: 'column',  
        justifyContent: 'space-between', 
    }, 
    title: {
        textAlign: 'center', 
        fontSize: 18, 
        fontFamily: 'RobotoMono-Bold'
    }, 
    subTitle: {
        fontSize: 14, 
        fontFamily: 'RobotoMono-Regular', 
        marginTop: 3, 
        marginLeft: 10
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

export default TournamentList; 