import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@/context/ThemeProvider';
import { showMessage } from "react-native-flash-message";
import { useDatabaseStore } from '@/context/DatabaseProvider';

type FormData = {
  features: string;
  tactics: string;
};

const AthleteDetailPage = () => {
  const { theme, isDark } = useTheme();
  const { athletes, updateAthlete, deleteAthlete } = useDatabaseStore();
  const { id } = useLocalSearchParams();
  const athleteId = id as string;
  const athlete = athletes.find(athlete => athlete.AthleteId === parseInt(athleteId));
  const [isEditing, setIsEditing] = useState(false);

  if (!athlete) {
    router.back();
    return null;
  }

  const { control, reset, handleSubmit } = useForm<FormData>({
    defaultValues: {
      features: athlete.features || '',
      tactics: athlete.tactics || '',
    }
  });

  const showNotification = (message: string, type: 'success' | 'danger') => {
    showMessage({
      message,
      type,
      duration: 500,
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
      await updateAthlete(athlete.AthleteId, data.features, data.tactics);
      showNotification('Informazioni aggiornate con successo', 'success');
      setIsEditing(false);
    } catch (error) {
      showNotification('Errore durante l\'aggiornamento', 'danger');
    }
  };

  const handleDeleteAthlete = () => {
    Alert.alert(
      'Conferma eliminazione',
      `Sei sicuro di voler eliminare ${athlete.firstname} ${athlete.lastname}?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAthlete(parseInt(athleteId));
              showNotification('Atleta eliminato con successo', 'success');
              router.back();
            } catch (error) {
              showNotification('Errore durante l\'eliminazione', 'danger');
            }
          },
        },
      ]
    );
  };

  const InfoSection = ({ title, value, controlName }: { 
    title: string, 
    value: string, 
    controlName: keyof FormData 
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
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
              placeholderTextColor={theme.textSecondary}
              placeholder={`Inserisci ${title.toLowerCase()}...`}
            />
          )}
        />
      ) : (
        <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
          {value || `Nessuna ${title.toLowerCase()} inserita`}
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
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        pressed && styles.buttonPressed
      ]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
      <Ionicons name={icon as any} size={24} color="#fff" />
    </Pressable>
  );

  return (
    <ScrollView 
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.athleteName, { color: theme.textPrimary }]}>
          {athlete.firstname} {athlete.lastname}
        </Text>
      </View>

      <InfoSection title="Caratteristiche" value={athlete.features} controlName="features" />
      <InfoSection title="Punti Deboli" value={athlete.tactics} controlName="tactics" />

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
          <>
            <ActionButton
              onPress={() => setIsEditing(true)}
              label="Modifica"
              icon="build-outline"
              color="#264653"
            />
            <ActionButton
              onPress={handleDeleteAthlete}
              label="Elimina"
              icon="trash-bin"
              color="#e76f51"
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AthleteDetailPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 20,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  athleteName: {
    fontSize: 26,
    fontFamily: 'RobotoBold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'RobotoBold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 5,
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
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
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
  },
});