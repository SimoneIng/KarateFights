import { View, StyleSheet, Text, ScrollView } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import SearchBar from '@/components/commons/SearchBar';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/commons/CustomButton';
import MatchList from '@/components/lists/MatchList';
import { MatchWithAthletes } from '@/database/types';
import { router } from 'expo-router';
import { useMatches } from '@/database/hooks';
import { useDatabaseStore } from '@/context/DatabaseProvider';

const Matches = () => {
  
  const { theme } = useTheme(); 
  const { matches, isLoadingMatches } = useDatabaseStore() 

  useEffect(() => {
    !isLoadingMatches && setFilteredMatches(matches)
  }, [isLoadingMatches])

  const [filteredMatches, setFilteredMatches] = useState<MatchWithAthletes[]>([]); 

  const filterMatches = useCallback((searchString: string) => {
    if (!searchString.trim()) {
      setFilteredMatches(matches);
      return;
    }
    const filter = matches.filter(match => 
      match.akaAthlete.firstname.toLowerCase().includes(searchString.toLowerCase()) ||
      match.akaAthlete.lastname.toLowerCase().includes(searchString.toLowerCase()) || 
      match.aoAthlete.firstname.toLowerCase().includes(searchString.toLowerCase()) ||
      match.aoAthlete.lastname.toLowerCase().includes(searchString.toLowerCase())
    )
    setFilteredMatches(filter)
  }, [matches]);

  const handleNewMatchPressButton = () => {
    router.push('/modals/selectTournament')
  }

  const handleMatchSelection = (id: number) => {
    router.push(`/match/${id.toString()}`)
  } 

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container, {backgroundColor: theme.background}]}>

      <SearchBar onSearch={(searchString) => {
        filterMatches(searchString); 
      }} />

      <CustomButton 
        title='Aggiungi Incontro' 
        iconName="add-circle-outline" 
        handlePress={handleNewMatchPressButton} 
      />

      <MatchList matches={filteredMatches} onSelectedMatch={handleMatchSelection} />

    </ScrollView>
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