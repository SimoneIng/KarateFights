import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Athlete } from "@/database/types";
import { useTheme } from "@/context/ThemeProvider";
import { FlashList } from "@shopify/flash-list";

interface SelectableAthletesListProps {
  athletes: Athlete[];
  onToggleSelection: (id: number) => void;
  selectedAthletes: number[]; // Array di ID degli atleti selezionati
}

const SelectableAthletesList = ({ athletes, onToggleSelection, selectedAthletes }: SelectableAthletesListProps) => {
  
    const { theme } = useTheme(); 
  
    const renderItem = ({ item }: { item: Athlete }) => {
    const indexInSelection = selectedAthletes.indexOf(item.AthleteId);
    let backgroundColor = theme.border; // Default background color

    if (indexInSelection === 0) {
      backgroundColor = "#f94144"; // Rosso chiaro per il primo selezionato
    } else if (indexInSelection === 1) {
      backgroundColor = "#2196F3"; // Blu chiaro per il secondo selezionato
    }

    return (
      <TouchableOpacity
        onPress={() => onToggleSelection(item.AthleteId)}
        style={[styles.athleteItem, { backgroundColor }]}
      >
        <Text style={[styles.athleteName, {color: theme.textPrimary}]}>
          {item.firstname} {item.lastname}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlashList
      data={athletes}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.AthleteId.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      estimatedItemSize={50}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 60
  },
  athleteItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  athleteName: {
    fontSize: 16,
  },
});

export default SelectableAthletesList;
