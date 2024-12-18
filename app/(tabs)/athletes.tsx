import { View, StyleSheet, Alert, Text } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { StatusBar } from 'expo-status-bar';
import SearchBar from '@/components/commons/SearchBar';
import AthletesList from '@/components/lists/AthleteList';
import { router } from 'expo-router';
import { Athlete } from '@/database/types';
import CustomButton from '@/components/commons/CustomButton';
import { useAthletes } from '@/database/hooks';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'; 
import NewAthleteForm from '@/components/forms/NewAthleteForm';


const Athletes = () => {
  // 1. Hooks al livello più alto
  const { theme, isDark } = useTheme(); 
  const { getAthletes } = useAthletes(); 

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);  

  const filterAthletes = useCallback((searchString: string) => {
    if (!searchString.trim()) {
      setFilteredAthletes(athletes);
      return;
    }
    const filtered = athletes.filter(athlete => 
      // implementa la tua logica di filtro qui
      athlete.firstname.toLowerCase().includes(searchString.toLowerCase())
    );
    setFilteredAthletes(filtered);
  }, [athletes]);

  const handleAthleteSelection = useCallback((id: number) => {
    router.navigate(`/athlete/${id.toString()}`); 
  }, []);

  useEffect(() => {
    getAthletes().then(response => {
      setAthletes(response)
      setFilteredAthletes(response)
    }).catch(error => Alert.alert("Errore", error)); 
  }, [athletes]);

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
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <SearchBar onSearch={filterAthletes} />
      <CustomButton 
        title='Aggiungi Atleta' 
        iconName="add-circle-outline" 
        handlePress={handlePresentModal} 
      />
      <AthletesList 
        athletes={filteredAthletes} 
        onSelectedAthlete={handleAthleteSelection} 
      />

      {/* Bottom Sheet */}
      <BottomSheetModal
        backgroundStyle={{backgroundColor: theme.background}}
        handleIndicatorStyle={{backgroundColor: theme.textPrimary}}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={[styles.bottomSheet]}>
          <NewAthleteForm onClose={handleCloseModal} /> 
        </BottomSheetView>
      </BottomSheetModal>


      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
};

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

export default Athletes;