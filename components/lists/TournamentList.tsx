import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tournament } from '@/database/types';
import { useTheme } from '@/context/ThemeProvider';
import { FlashList } from '@shopify/flash-list';

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

    const renderDate = () => {
        const dateToRender = new Date(Date.parse(tournament.date))
    
        const date = dateToRender.toLocaleDateString('it-IT', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        });
    
        return date === 'Invalid Date' ? tournament.date : date; 
      };
      

    return (
        <TouchableOpacity
         onPress={() => onPress(tournament.id)} 
         style={[styles.tournamentCard]}
        >
            <View style={styles.container}>
                <Text style={[styles.title, {color: theme.textPrimary}]}>{tournament.name}</Text>
                <Text style={[styles.subTitle, {color: theme.textSecondary}]}>{renderDate()}</Text>
            </View>
            <Ionicons name='arrow-forward-circle' size={24} color={theme.textPrimary} />
        </TouchableOpacity>
    )
}

const TournamentList = ({ tournaments, onSelectedTournament }:TournamentsListProps) => {

    const { theme } = useTheme(); 

    return (
        <FlashList
            data={tournaments}
            contentContainerStyle={styles.contentContainer}
            renderItem={({item}) => <TorunamentCard tournament={item} onPress={() => onSelectedTournament(item.id)} />}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            estimatedItemSize={86}
            
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
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    }, 
    container: {
        display: 'flex', 
        flexDirection: 'column',  
        justifyContent: 'space-between', 
    }, 
    title: {
        textAlign: 'center', 
        fontSize: 16, 
        fontFamily: 'RobotoBold'
    }, 
    subTitle: {
        fontSize: 14, 
        fontFamily: 'RobotoRegular', 
        marginTop: 3, 
        marginLeft: 10,
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
        fontFamily: 'RobotoBold' 
    }
});

export default TournamentList; 