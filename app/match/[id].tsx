import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MatchWithAthletes, Match } from '@/database/types';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { showMessage } from "react-native-flash-message";
import { useDatabaseStore } from '@/context/DatabaseProvider';

type FormData = {
  matchDescription: string;
  aoSummary: string;
  akaSummary: string;
}

const MatchScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { matches, updateMatch, deleteMatch } = useDatabaseStore();
  const { id } = useLocalSearchParams();
  const matchId = id as string;
  const match = matches.find(match => match.id === parseInt(matchId));

  const [isEditing, setIsEditing] = useState(false);
  const [techniquesOpen, setTechniquesOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      matchDescription: match?.matchDescription || '',
      aoSummary: match?.aoSummary || '',
      akaSummary: match?.akaSummary || ''
    }
  });

  if(!match) return null; 

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

  const onSubmit = async (data: FormData) => {
    try {
      const updatedFields: Partial<Match> = {
        matchDescription: data.matchDescription,
        aoSummary: data.aoSummary,
        akaSummary: data.akaSummary
      };

      await updateMatch(match.id, updatedFields);
      showNotification('Incontro aggiornato con successo', 'success');
      setIsEditing(false);
    } catch(error) {
      showNotification('Errore durante l\'aggiornamento', 'danger');
    }
  };

  const handleDeleteMatch = () => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questo incontro?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMatch(match.id);
              showNotification('Incontro eliminato con successo', 'success');
              router.back();
            } catch (error) {
              showNotification('Errore durante l\'eliminazione', 'danger');
            }
          },
        },
      ]
    );
  };

  const renderDate = () => {
    const dateToRender = new Date(Date.parse(match.tournament.date))

    const date = dateToRender.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });

    return date === 'Invalid Date' ? match.tournament.date : date; 
  };
  

  const TextSection = ({ 
    title, 
    value, 
    controlName 
  }: { 
    title: string, 
    value: string, 
    controlName: keyof FormData 
  }) => (
    <View style={styles.textContainer}>
      <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>{title}</Text>
      {isEditing ? (
        <Controller
          control={control}
          name={controlName}
          rules={{ required: false }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[styles.input, { 
                color: theme.textPrimary,
                backgroundColor: 'rgba(0,0,0,0.05)',
              }]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              multiline
              textAlignVertical="top"
              placeholder={`Inserisci ${title.toLowerCase()}...`}
              placeholderTextColor={theme.textSecondary}
            />
          )}
        />
      ) : (
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {value || `Scrivi qualcosa...`}
        </Text>
      )}
    </View>
  );

  const ActionButton = ({ 
    onPress, 
    label, 
    icon, 
    color 
  }: {
    onPress: () => void,
    label: string,
    icon: string,
    color: string
  }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.button, { backgroundColor: color }]}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
      <Ionicons name={icon as any} size={24} color="#FFF" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name='arrow-back-circle' size={36} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleDeleteMatch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name='trash-bin' size={24} color={theme.error} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tournamentInfo}>
          <Text style={[styles.mainLabel, { color: theme.textPrimary }]}>
            {match.tournament.name}
          </Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {renderDate()}
          </Text>
        </View>

        <View style={styles.matchupContainer}>
          <View style={{    flexDirection: 'row', justifyContent: 'space-around',}}>
          <View style={styles.athleteContainer}>
            <Text style={styles.akaLabel}>Aka</Text>
            <Text style={[styles.athleteName, { color: theme.textPrimary }]}>
              {match.akaAthlete.firstname} {match.akaAthlete.lastname}
            </Text>
          </View>

          <View style={styles.athleteContainer}>
            <Text style={styles.aoLabel}>Ao</Text>
            <Text style={[styles.athleteName, { color: theme.textPrimary }]}>
              {match.aoAthlete.firstname} {match.aoAthlete.lastname}
            </Text>
          </View>
          
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around',}}>
            <Text style={styles.score}>{match.akaScore}</Text>
            <Text style={styles.score}>{match.aoScore}</Text>
          </View>
        </View>

        <View style={styles.techniquesSection}>
          <TouchableOpacity 
            style={styles.techniquesHeader}
            onPress={() => setTechniquesOpen(prev => !prev)}
          >
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
              Tecniche
            </Text>
            <Ionicons 
              name={techniquesOpen ? 'arrow-up-circle' : 'arrow-forward-circle'} 
              size={24} 
              color={theme.textSecondary} 
            />
          </TouchableOpacity>

          {techniquesOpen && (
            <View style={styles.techContainer}>
              {[
                { label: 'Kizami', aka: match.akaKizami, ao: match.aoKizami },
                { label: 'Gyaku Jod.', aka: match.akaGyakuJodan, ao: match.aoGyakuJodan },
                { label: 'Gyaku Chud.', aka: match.akaGyakuChudan, ao: match.aoGyakuChudan },
                { label: 'Mawashi Jod.', aka: match.akaJodanMawashi, ao: match.aoJodanMawashi },
                { label: 'Mawashi Chud.', aka: match.akaChudanMawashi, ao: match.aoChudanMawashi },
                { label: 'Uramawashi', aka: match.akaUramawashi, ao: match.aoUramawashi },
                { label: 'Spazzata', aka: match.akaSweep, ao: match.aoSweep },
              ].map((technique, index) => (
                <View key={index} style={styles.techRow}>
                  <Text style={[styles.techLabel, { color: theme.textPrimary }]}>
                    {technique.label}
                  </Text>
                  <View style={styles.techScores}>
                    <Text style={[styles.techScore, { color: '#e74c3c' }]}>{technique.aka}</Text>
                    <Text style={[styles.techScore, { color: '#3498db' }]}>{technique.ao}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TextSection 
          title="Descrizione Incontro" 
          value={match.matchDescription} 
          controlName="matchDescription" 
        />
        <TextSection 
          title="Soluzioni Aka" 
          value={match.akaSummary} 
          controlName="akaSummary" 
        />
        <TextSection 
          title="Soluzioni Ao" 
          value={match.aoSummary} 
          controlName="aoSummary" 
        />

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <ActionButton
                onPress={handleSubmit(onSubmit)}
                label="Salva"
                icon="checkmark"
                color="#2a9d8f"
              />
              <ActionButton
                onPress={() => {
                  reset();
                  setIsEditing(false);
                }}
                label="Annulla"
                icon="close"
                color="#e76f51"
              />
            </>
          ) : (
            <ActionButton
              onPress={() => setIsEditing(true)}
              label="Modifica"
              icon="build-outline"
              color="#264653"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

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
  tournamentInfo: {
    alignItems: 'center',
    gap: 4,
  },
  mainLabel: {
    fontSize: 24,
    fontFamily: 'RobotoBold',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'RobotoRegular',
  },
  matchupContainer: {
    padding: 16,
    gap: 10, 
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginVertical: 10,
  },
  athleteContainer: {
    alignItems: 'center',
    flex: 1, 
    gap: 4
  },
  athleteName: {
    fontSize: 16,
    fontFamily: 'RobotoBold',
    textAlign: 'center',
  },
  akaLabel: {
    color: '#e74c3c',
    fontSize: 16,
    fontFamily: 'RobotoBold',
  },
  aoLabel: {
    color: '#3498db',
    fontSize: 16,
    fontFamily: 'RobotoBold',
  },
  score: {
    fontSize: 20,
    fontFamily: 'RobotoBold',
    color: 'grey',
  },
  techniquesSection: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  techniquesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  techContainer: {
    padding: 16,
    gap: 8,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  techLabel: {
    fontSize: 16,
    fontFamily: 'RobotoRegular',
  },
  techScores: {
    flexDirection: 'row',
    gap: 16,
  },
  techScore: {
    fontSize: 16,
    fontFamily: 'RobotoBold',
    minWidth: 30,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 18,
    fontFamily: 'RobotoBold',
  },
  textContainer: {
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: 16,
    fontFamily: 'RobotoLight',
    lineHeight: 24,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RobotoBold',
    marginRight: 8,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  }
}) 

export default MatchScreen; 