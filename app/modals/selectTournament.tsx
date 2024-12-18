import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TournamentList from '@/components/lists/TournamentList';
import { Tournament } from '@/database/types';
import { useTournaments } from '@/database/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SelectTournamentModalScreen = () => {

  const { theme } = useTheme(); 
  const { top } = useSafeAreaInsets(); 
  const { getTournaments } = useTournaments(); 
  const [tournaments, setTournaments] = useState<Tournament[]>([]); 

  const handleSelectedTournament = (id: number) => {
    const tournament = tournaments.find(item => item.id === id)

    if(tournament === undefined){
      router.back(); 
    } else {
      const tournamentParams = JSON.stringify(tournament); 

      router.push({
        pathname: '/modals/selectAthletes', 
        params: { tournamentParams }
      })
    }
  }

  useEffect(() => {
    getTournaments().then(response => {
      setTournaments(response)
    }).catch(error => { Alert.alert("Errore", error); router.back() })
  })

  return (
    <View style={[styles.container, {paddingTop: top+10, backgroundColor: theme.background}]}>
    
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name='arrow-back-outline' size={36} color={theme.textPrimary} />
      </TouchableOpacity>
      <Text style={[styles.label, {color: theme.textPrimary}]}>Step. 1/3</Text>
    </View>
    
    {/* Content */}
    <View style={styles.content}>
        <Text style={[styles.title, {color: theme.textPrimary}]}>Seleziona Gara</Text>
        <TournamentList
          tournaments={tournaments}
          onSelectedTournament={handleSelectedTournament}
        />
    </View>
    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingHorizontal: 10
  }, 
  header: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20, 
    paddingHorizontal: 20
  },
  label: {
    fontSize: 16, 
    fontFamily: 'RobotoMono-Regular'
  },
  content: {
    flex: 1,
    paddingHorizontal: 10
  }, 
  title: {
    fontSize: 32, 
    fontFamily: 'RobotoMono-Bold'
  }
});

export default SelectTournamentModalScreen; 