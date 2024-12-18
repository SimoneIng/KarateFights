import { View, StyleSheet, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import SearchBar from '@/components/commons/SearchBar';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/commons/CustomButton';
import MatchList from '@/components/lists/MatchList';
import { MatchWithAthletes } from '@/database/types';
import { router } from 'expo-router';
import { useMatches } from '@/database/hooks';

const Matches = () => {
  
  const { theme, isDark } = useTheme(); 
  const { getMatchesWithDetails } = useMatches(); 

  const [matches, setMatches] = useState<MatchWithAthletes[]>([]); 
  const [filteredMatches, setFilteredMatches] = useState<MatchWithAthletes[]>([]); 

  const filterMatches = useCallback((searchString: string) => {
    if (!searchString.trim()) {
      setFilteredMatches(matches);
      return;
    }
    // Filtrare
  }, [filteredMatches]);

  const handleNewMatchPressButton = () => {
    router.push('/modals/selectTournament')
  }

  const handleMatchSelection = (id: number) => {
    router.push(`/match/${id.toString()}`)
  }

  useEffect(() => {
    getMatchesWithDetails().then(response => {
      setMatches(response)
      setFilteredMatches(response)
    }).catch(error => Alert.alert("Errore", error))
  }, [matches]); 

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <SearchBar onSearch={filterMatches} />
      <CustomButton 
        title='Aggiungi Incontro' 
        iconName="add-circle-outline" 
        handlePress={handleNewMatchPressButton} 
      />
    <MatchList matches={filteredMatches} onSelectedMatch={handleMatchSelection} />

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, 
    gap: 10
  }, 
});

export default Matches; 