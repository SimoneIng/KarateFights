import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Athlete } from '@/database/types';
import { useTheme } from '@/context/ThemeProvider';
import { FlashList } from '@shopify/flash-list';

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
        <TouchableOpacity 
            onPress={() => onPress(athlete.AthleteId)} 
            style={[styles.athleteCard]}
        >
            <Text style={[styles.athleteName, {color: theme.textPrimary}]}>
                {athlete.firstname + " " + athlete.lastname}
            </Text>
            <Ionicons name='arrow-forward-circle' size={24} color={theme.textPrimary} />
        </TouchableOpacity>
    )
}

const AthletesList = ({ athletes, onSelectedAthlete }:AthletesListProps) => {

    const { theme } = useTheme(); 

    return (
        <FlashList 
            data={athletes}
            contentContainerStyle={styles.contentContainer}
            renderItem={({item}) => <AthleteCard athlete={item} onPress={() => onSelectedAthlete(item.AthleteId)} />}
            keyExtractor={item => item.AthleteId.toString()}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={64}
            
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
        backgroundColor: 'rgba(0,0,0,0.05)',
    }, 
    athleteName: {
        textAlign: 'center', 
        fontSize: 16, 
        fontFamily: 'RobotoBold'
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

export default AthletesList; 