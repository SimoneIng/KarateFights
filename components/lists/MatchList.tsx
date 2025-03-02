import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import { MatchWithAthletes } from '@/database/types'
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

interface MatchesListProps {
  matches: MatchWithAthletes[]; 
  onSelectedMatch: (id: number) => void; 
}

interface MatchItemProps {
  match: MatchWithAthletes; 
  onPress: (id: number) => void; 
}


const MatchCard = ({match, onPress}: MatchItemProps) => {

  const { theme } = useTheme(); 

  return (
      <TouchableOpacity
       onPress={() => onPress(match.id)} 
       style={[styles.MatchCard]}
      >   
          <View style={styles.matchSection}>
              <View style={{
                flexDirection: 'row', gap: 2, alignItems: 'center'
              }}>
                <Text style={[{color: theme.textPrimary, fontFamily: 'RobotoMedium'}]}>Ao</Text>
                <Ionicons name='ellipse' color='blue' size={14} />
              </View>
              <Text style={[styles.matchLabel, { color: theme.textPrimary }]}>{match.aoAthlete.firstname + " " + match.aoAthlete.lastname}</Text>
              <Text style={[styles.matchSubLabel, { color: theme.textSecondary }]}>{match.aoScore}</Text>
          </View>
          <View style={styles.matchSection}>
              <View style={{
                  flexDirection: 'row', gap: 2, alignItems: 'center'
              }}>
                <Text style={[{color: theme.textPrimary, fontFamily: 'RobotoMedium'}]}>Aka</Text>
                <Ionicons name='ellipse' color='red' size={14} />
              </View>
              <Text style={[styles.matchLabel, { color: theme.textPrimary }]}>{match.akaAthlete.firstname + " " + match.akaAthlete.lastname}</Text>
              <Text style={[styles.matchSubLabel, { color: theme.textSecondary }]}>{match.akaScore}</Text>
          </View>
      </TouchableOpacity>
  )
}


const MatchList = ({ matches, onSelectedMatch }: MatchesListProps) => {
  const { theme } = useTheme();

  return (
    <FlashList
      data={matches}
      contentContainerStyle={styles.contentContainer}
      renderItem={({item}) => <MatchCard match={item} onPress={() => onSelectedMatch(item.id)} />}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={true}
      estimatedItemSize={90}
      
      ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
              <Text style={[styles.text, {color: theme.textPrimary}]}>Nessun Incontro</Text>
          </View>
      )}
    />
  )
}


const styles = StyleSheet.create({
  MatchCard: {
      marginVertical: 5, 
      paddingVertical: 15,
      borderRadius: 5, 
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.05)',
      gap: 5, 
  }, 
  matchLabel: {
    fontSize: 14, 
    fontFamily: 'RobotoMedium',
    textAlign: 'center', 
  }, 
  matchSubLabel: {
    fontSize: 14, 
    fontFamily: 'RobotoLight',
    marginTop: 5
  }, 
  matchSection: {
      flex: 1,
      alignItems: 'center'
  },
  contentContainer: {
      paddingBottom: 60, 
  }, 
  emptyContainer: {
      flex: 1,   
      justifyContent: 'center', 
      alignItems: 'center'
  }, 
  text: {
      fontSize: 18, 
      fontFamily: 'RobotoBold' 
  }
});

export default MatchList; 