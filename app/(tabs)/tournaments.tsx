import { StyleSheet, Alert, View, Text } from 'react-native'
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import SearchBar from '@/components/commons/SearchBar';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/commons/CustomButton';
import { Tournament } from '@/database/types';
import { useTournaments } from '@/database/hooks';
import TournamentList from '@/components/lists/TournamentList';
import { router } from 'expo-router';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'; 
import NewTournamentForm from '@/components/forms/newTournamentForm';

const Tournaments = () => {
  
  const { theme, isDark } = useTheme(); 
  const { getTournaments } = useTournaments(); 

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]); 
  const [string, setString] =  useState('');

  // Funzione per caricare i tornei
  const loadTournaments = useCallback(() => {
    getTournaments()
      .then(response => {
        setTournaments(response);
        setFilteredTournaments(response);
      })
      .catch(error => Alert.alert("Errore", error));
  }, [getTournaments]);

  useEffect(() => {
    loadTournaments(); // Carica i tornei inizialmente
  }, [loadTournaments]);

  const filterTournaments = useCallback((searchString: string) => {
    if (!searchString.trim()) {
      setFilteredTournaments(tournaments);
      return;
    }
    const filtered = tournaments.filter(tournament => 
      tournament.name.toLowerCase().includes(searchString.toLowerCase())
    );
    setFilteredTournaments(filtered);
  }, [tournaments]);

  const handleTournamentSelection = useCallback((id: number) => {
    router.navigate(`/tournament/${id.toString()}`); 
  }, []);

  {/* Bottom Sheet */}
  const snapPoints = useMemo(() => ['75%'], []); 

  const renderBackdrop = useCallback((props: any) => 
    <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
  , []); 

  const bottomSheetModalRef = useRef<BottomSheetModal>(null); 

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present(); 
  }, []); 

  const handleCloseModal = () => {
    bottomSheetModalRef.current?.dismiss();
    loadTournaments(); // Ricarica i tornei dopo l'inserimento
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <SearchBar onSearch={(searchString) => {
        filterTournaments(searchString); 
      }} />
      <Text>{string}</Text>
      <CustomButton 
        title='Aggiungi Gara' 
        iconName="add-circle-outline" 
        handlePress={handlePresentModal} 
      />
      
      <TournamentList 
        tournaments={filteredTournaments} 
        onSelectedTournament={handleTournamentSelection} 
      />

      <BottomSheetModal
        backgroundStyle={{backgroundColor: theme.background}}
        handleIndicatorStyle={{backgroundColor: theme.textPrimary}}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={[styles.bottomSheet]}>
          <NewTournamentForm onClose={handleCloseModal} />
        </BottomSheetView>
      </BottomSheetModal>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    flex: 1, 
    gap: 10
  }, 
  bottomSheet: {
    flex: 1, 
    justifyContent: 'center', 
    margin: 20
  }
});

export default Tournaments;
