import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import SearchBar from '@/components/commons/SearchBar';
import AthletesList from '@/components/lists/AthleteList';
import { router } from 'expo-router';
import { Athlete } from '@/database/types';
import CustomButton from '@/components/commons/CustomButton';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'; 
import NewAthleteForm from '@/components/forms/NewAthleteForm'; 
import { useDatabaseStore } from '@/context/DatabaseProvider';

const Athletes = () => {
  // 1. Hooks al livello più alto
  const { theme } = useTheme(); 
  const { athletes, isLoadingAthletes } = useDatabaseStore()

  useEffect(() => {
    !isLoadingAthletes && setFilteredAthletes(athletes)
  }, [isLoadingAthletes])

  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]); 

  const filterAthletes = useCallback((searchString: string) => {
    if (!searchString.trim()) {
      setFilteredAthletes(athletes);
      return;
    }
    const filtered = athletes.filter(athlete => 
      // implementa la tua logica di filtro qui
      athlete.firstname.toLowerCase().includes(searchString.toLowerCase()) || 
      athlete.lastname.toLowerCase().includes(searchString.toLowerCase())
    );
    setFilteredAthletes(filtered);
  }, [athletes]);

  const handleAthleteSelection = useCallback((id: number) => {
    router.navigate(`/athlete/${id.toString()}`); 
  }, []);

  {/* Bottom Sheet */}
  const snapPoints = useMemo(() => ['70%'], []); 

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
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container, {backgroundColor: theme.background}]}>
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

    </ScrollView>
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