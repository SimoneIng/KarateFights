import React, { useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Athlete } from "@/database/types";
import { useTheme } from "@/context/ThemeProvider";
import { FlashList } from "@shopify/flash-list";

interface SelectableAthletesListProps {
  athletes: Athlete[];
  onToggleSelection: (id: number) => void;
  selectedAthletes: number[]; // Array di ID degli atleti selezionati
}

// Componente memorizzato per ogni elemento della lista
const AthleteItem = React.memo(({ item, onToggleSelection, isSelected, backgroundColor, textColor }: any) => {
  return (
    <TouchableOpacity
      onPress={() => onToggleSelection(item.AthleteId)}
      style={[styles.athleteItem, { backgroundColor }]}
    >
      <Text style={[styles.athleteName, { color: textColor }]}>
        {item.firstname} {item.lastname}
      </Text>
    </TouchableOpacity>
  );
});

const SelectableAthletesList = ({ athletes, onToggleSelection, selectedAthletes }: SelectableAthletesListProps) => {
  const { theme } = useTheme();

  // Funzione memorizzata per il rendering degli elementi
  const renderItem = useCallback(
    ({ item }: { item: Athlete }) => {
      const indexInSelection = selectedAthletes.indexOf(item.AthleteId);
      let backgroundColor = theme.cardBackground; // Default background color

      if (indexInSelection === 0) {
        backgroundColor = "#f94144"; // Rosso chiaro per il primo selezionato
      } else if (indexInSelection === 1) {
        backgroundColor = "#2196F3"; // Blu chiaro per il secondo selezionato
      }

      return (
        <AthleteItem
          item={item}
          onToggleSelection={onToggleSelection}
          isSelected={indexInSelection !== -1}
          backgroundColor={backgroundColor}
          textColor={indexInSelection !== -1 ? '#fff' : theme.accent}
        />
      );
    },
    [selectedAthletes, theme, onToggleSelection] // Dipendenze: la funzione si ricrea solo se cambiano questi valori
  );

  return (
    <FlashList
      data={athletes}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.AthleteId.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      estimatedItemSize={50}
      extraData={selectedAthletes} // Forza il re-render quando selectedAthletes cambia
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 60,
  },
  athleteItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 0.2
  },
  athleteName: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
  },
});

export default SelectableAthletesList;
