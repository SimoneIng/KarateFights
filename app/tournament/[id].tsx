import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
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

  const { theme } = useTheme(); 
  const { top } = useSafeAreaInsets(); 

  const { id } = useLocalSearchParams(); 
  const tournamentId = id as string; 

  const tournament = tournaments.find(tournament => tournament.id === parseInt(tournamentId))
  const tournamentMatches = matches.filter(match => match.tournamentId === parseInt(tournamentId))

  if(!tournament) return null; 

  const showNotification = (message: string, type: 'success' | 'danger') => {
    showMessage({
      message,
      duration: 500,
      type,
      floating: true,
      style: styles.notification,
      icon: () => (
        <Ionicons 
          name={type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'} 
          size={24} 
          color='#fff' 
        />
      )
    });
  };

  const handleDeleteATournament = () => {
    Alert.alert(
      'Conferma eliminazione',
      `Sei sicuro di voler eliminare ${tournament.name}?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTournament(parseInt(tournamentId));
              showNotification('Atleta eliminato con successo', 'success');
              router.back();
            } catch (error) {
              showNotification('Errore durante l\'eliminazione', 'danger');
            }
          },
        },
      ]
    );
  };

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

  const renderDate = () => {
    const dateToRender = new Date(Date.parse(tournament.date))

    const date = dateToRender.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });

    return date === '' ? tournament.date : date; 
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: top }]}>
    <View style={[styles.header, {backgroundColor: theme.background}]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name='arrow-back-circle' size={36} color={theme.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.header} onPress={handleDeleteATournament}>
        <Ionicons name='trash-bin' size={24} color={theme.error} />
      </TouchableOpacity>
    </View>
    <ScrollView  
      style={styles.content} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >  
      <View style={styles.contentHeader} >
        <Text style={[styles.mainLabel, {color: theme.textPrimary, fontFamily: 'RobotoBold'}]} >{tournament?.name}</Text>
        <Text style={[styles.submainLabel, {color: theme.textSecondary, fontFamily: 'RobotoRegular'}]} >{renderDate()}</Text>
      </View>
      {/* Lista incontri con scroll orizzontale */}
      <View style={{gap: 10, flex: 1}}>
        <CustomButton title='Aggiungi Incontro' handlePress={handleNewMatch} iconName='add-circle-outline' />
        <MatchList matches={tournamentMatches} onSelectedMatch={matchSelection} />
      </View>
    </ScrollView>
    </View>
  )
    
}

export default TournamentDetailPage; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  contentHeader: {
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
    fontSize: 24,
    textAlign: 'center', 
    fontWeight: '600', 
    marginHorizontal: 20,
  }, 
  submainLabel: {
    fontSize: 16, 
    fontWeight: '500', 
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  }
});