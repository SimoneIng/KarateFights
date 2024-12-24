import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MatchWithAthletes, Tournament } from '@/database/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeProvider';
import MatchList from '@/components/lists/MatchList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/commons/CustomButton';
import { showMessage } from 'react-native-flash-message';
import { useDatabaseStore } from '@/context/DatabaseProvider';

const TournamentDetailPage = () => {

  const { tournaments, matches, deleteTournament } = useDatabaseStore(); 
  const [tournament, setTournament] = useState<Tournament | null>(null); 
  const [tournamentMatches, setTournamentMatches] = useState<MatchWithAthletes[]>([]); 

  const { theme } = useTheme(); 
  const { top } = useSafeAreaInsets(); 

  const { id } = useLocalSearchParams(); 
  const tournamentId = id as string; 


  useEffect(() => {
    const tourn = tournaments.find(tournament => tournament.id === parseInt(tournamentId))
    const matcs = matches.filter(match => match.tournamentId === parseInt(tournamentId))

    if(tourn !== undefined && matcs !== undefined){
      setTournament(tourn)
      setTournamentMatches(matcs)
    } else {
      router.back() 
    }

  }, []); 

  const showDeleteMessage = () => {
    showMessage({
      message: 'Gara Eliminata',
      type: 'danger',
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

  const handleDeleteTournament = () => {
    deleteTournament(parseInt(tournamentId))
     .then(result => {
      setTournament(null); 
      // messaggio di eliminazione gara 
      showDeleteMessage(); 
      router.back();
     })
     .catch(error => alert(error)); 
  }

  const handleNewMatch = () => {

    const tournamentParams = JSON.stringify(tournament); 

    router.push({
      pathname: '/modals/selectAthletes', 
      params: { tournamentParams }
    })
  }

  const matchSelection = (id: number) => {
    router.push(`/match/${id.toString()}`)
  }

  return (
    <>
    <View style={[styles.header, {paddingTop: top+10, backgroundColor: theme.background}]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name='arrow-back-circle' size={36} color={theme.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.header} onPress={handleDeleteTournament}>
        <Ionicons name='trash-bin' size={24} color={theme.error} />
      </TouchableOpacity>
    </View>
    <View style={[styles.mainContainer, {backgroundColor: theme.background}]} >  
      <View style={styles.headerContainer} >
        <Text style={[styles.mainLabel, {color: theme.textPrimary, fontFamily: 'RobotoBold'}]} >{tournament?.name}</Text>
        <Text style={[styles.submainLabel, {color: theme.textSecondary, fontFamily: 'RobotoRegular'}]} >{tournament?.date}</Text>
      </View>
      {/* Lista incontri con scroll orizzontale */}
      <View style={{gap: 10, flex: 1}}>
        <CustomButton title='Aggiungi Incontro' handlePress={handleNewMatch} iconName='add-circle-outline' />
        <MatchList matches={tournamentMatches} onSelectedMatch={matchSelection} />
      </View>
    </View>
    </>
  )
    
}

export default TournamentDetailPage; 

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex', 
    flex: 1,  
    gap: 30, 
    paddingTop: 10, 
    paddingHorizontal: 10 
  },
  header: {
    display: 'flex', 
    paddingHorizontal: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  }, 
  headerContainer: {
    display: 'flex', 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 20,
    gap: 5
  }, 
  label: {
    fontSize: 21, 
    fontWeight: '600'
  }, 
  mainLabel: {
    fontSize: 26, 
    fontWeight: '600', 
  }, 
  submainLabel: {
    fontSize: 16, 
    fontWeight: '500', 
  }
});