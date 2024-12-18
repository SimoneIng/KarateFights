import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Tournament, Athlete } from '@/database/types';
import { useAthletes } from '@/database/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SelectableAthletesList from '@/components/lists/SelectableAthletesList';

const SelectAthletes = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { getAthletes } = useAthletes();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<number[]>([]);

  const { tournamentParams } = useLocalSearchParams();
  const tournament: Tournament = JSON.parse(tournamentParams as string);

  const handleToggleAthleteSelection = (id: number) => {
    setSelectedAthletes((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Deseleziona l'atleta
        return prevSelected.filter((athleteId) => athleteId !== id);
      } else if (prevSelected.length < 2) {
        // Seleziona l'atleta se meno di 2 sono selezionati
        return [...prevSelected, id];
      } else {
        Alert.alert(
          "Attenzione",
          "Puoi selezionare solo due atleti. Rimuovi un atleta per selezionarne un altro."
        );
        return prevSelected;
      }
    });
  };

  const handleSelectedAthletes = () => {
    if (selectedAthletes.length === 2) {
      const aka = getAthlete(selectedAthletes[0]);
      const ao = getAthlete(selectedAthletes[1]);
      const akaParams = JSON.stringify(aka);
      const aoParams = JSON.stringify(ao);

      router.push({
        pathname: "/modals/newMatch",
        params: { tournamentParams, akaParams, aoParams },
      });
    } else {
      Alert.alert("Attenzione", "Devi selezionare esattamente due atleti per continuare.");
    }
  };

  const getAthlete = (id: number): Athlete | undefined => {
    return athletes.find((item) => item.AthleteId === id);
  };

  useEffect(() => {
    getAthletes()
      .then((response) => setAthletes(response))
      .catch((error) => {
        Alert.alert("Errore", error);
        router.back();
      });
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + 10, backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={36} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.label, { color: theme.textPrimary }]}>Step. 2/3</Text>
        <TouchableOpacity onPress={handleSelectedAthletes}>
          <Ionicons name="arrow-forward-outline" size={36} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Atleti Selezionati */}
        <View style={styles.infosContainer}>
          <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
            {tournament.name}
          </Text>
          <Text style={[styles.sublabel, { color: theme.textPrimary }]}>
            Aka: {selectedAthletes[0] ? getAthlete(selectedAthletes[0])?.firstname + " " + getAthlete(selectedAthletes[0])?.lastname : "Non selezionato"}
          </Text>
          <Text style={[styles.sublabel, { color: theme.textPrimary }]}>
            Ao: {selectedAthletes[1] ? getAthlete(selectedAthletes[1])?.firstname + " " + getAthlete(selectedAthletes[1])?.lastname : "Non selezionato"}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Seleziona Atleti
        </Text>
        <SelectableAthletesList
          athletes={athletes}
          onToggleSelection={handleToggleAthleteSelection}
          selectedAthletes={selectedAthletes}
        />
      </View>
    </View>
  );
};

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
  },
  infosContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    gap: 10, 
    marginVertical: 20
  }, 
  subtitle: {
    fontSize: 21, 
    fontFamily: 'RobotoMono-Bold'
  }, 
  sublabel: {
    fontSize: 16, 
    fontFamily: 'RobotoMono-Regular'
  }
});

export default SelectAthletes; 