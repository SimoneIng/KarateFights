import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAthletes } from '@/database/hooks';
import { Athlete } from '@/database/types';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Divider from '@/components/commons/Divider';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@/context/ThemeProvider';
import { showMessage } from "react-native-flash-message";
import { useDatabaseStore } from '@/context/DatabaseProvider';

type FormData = {
  features: string;
  tactics: string;
};

const AthleteDetailPage = () => {
  const { athletes, updateAthlete, deleteAthlete } = useDatabaseStore();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useLocalSearchParams();
  const athleteId = id as string;

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      features: athlete?.features || '',
      tactics: athlete?.tactics || ''
    }
  });

  const { theme } = useTheme(); 

  useEffect(() => {
    const ath = athletes.find(athlete => athlete.AthleteId === parseInt(athleteId))
    if(ath !== undefined){
      setAthlete(ath)
    } else {
      router.back()
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!athlete) return;

    try {
      const updatedAthlete = {
        ...athlete,
        features: data.features,
        tactics: data.tactics
      };

      await updateAthlete(athlete.AthleteId, data.features, data.tactics);
      setAthlete(updatedAthlete);
      setIsEditing(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleModifyAthleteInfos = () => {
    // Reset form with current athlete values when entering edit mode
    reset({
      features: athlete?.features || '',
      tactics: athlete?.tactics || ''
    });
    setIsEditing(true);
  };

  const showDeleteMessage = () => {
    showMessage({
      message: 'Atleta Eliminato',
      type: 'danger',
      floating: true,
      style: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        gap: 10,
      }, 
      icon: () => <Ionicons name='checkmark-circle-outline' size={24} color='#fff' />
    })
  }

  const handleDeleteAthlete = () => {
    deleteAthlete(parseInt(athleteId))
      .then(result => {
        setAthlete(null);
        // messaggio di eliminazione con FlashCard
        showDeleteMessage(); 
        router.back();
      })
      .catch(error => alert(error));
  };

  const handleCancel = () => {
    // Reset form to current athlete values when cancelling
    reset({
      features: athlete?.features || '',
      tactics: athlete?.tactics || ''
    });
    setIsEditing(false);
  };

  return (
    <View style={[styles.mainContainer, {backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.athleteName, {color: theme.textPrimary}]}>{athlete?.firstname + " " + athlete?.lastname}</Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.label, {color: theme.textPrimary}]}>Caratteristiche</Text>
        {isEditing ? (
          <Controller
            control={control}
            name="features"
            rules={{ required: false }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, {color: theme.textPrimary}]}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        ) : (
          <Text style={[styles.text, {color: theme.textSecondary}]}>{athlete?.features}</Text>
        )}
      </View>

      <View style={styles.container}>
        <Text style={[styles.label, {color: theme.textPrimary}]}>Punti Deboli</Text>
        {isEditing ? (
          <Controller
            control={control}
            name="tactics"
            rules={{ required: false }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, {color: theme.textSecondary}]}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        ) : (
          <Text style={[styles.text, {color: theme.textSecondary}]}>{athlete?.tactics}</Text>
        )}
      </View>

      {/* <View style={styles.container}>
        <Text style={styles.label}>Statistiche</Text>
        <Divider />
      </View> */}

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <Pressable 
              onPress={handleSubmit(onSubmit)} 
              style={[styles.button, {backgroundColor: '#2a9d8f'}]}
            >
              <Text style={styles.buttonLabel}>Salva</Text>
              <Ionicons name="checkmark" size={24} color="#fff" />
            </Pressable>
            <Pressable 
              onPress={handleCancel} 
              style={[styles.button, {backgroundColor: '#e76f51'}]}
            >
              <Text style={styles.buttonLabel}>Annulla</Text>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </>
        ) : (
          <>
            <Pressable 
              onPress={handleModifyAthleteInfos} 
              style={[styles.button, {backgroundColor: '#264653'}]}
            >
              <Text style={styles.buttonLabel}>Modifica</Text>
              <Ionicons name="build-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable 
              onPress={handleDeleteAthlete} 
              style={[styles.button, {backgroundColor: '#e76f51'}]}
            >
              <Text style={styles.buttonLabel}>Elimina</Text>
              <Ionicons name="trash-bin" size={24} color="#fff" />
            </Pressable>
          </>
        )}
      </View>

    </View>
  );
};

export default AthleteDetailPage;

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexGrow: 1,
    padding: 10,
    justifyContent: 'space-around',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  container: {
    marginVertical: 10,
    borderBottomWidth: 0.5, 
  },
  text: {
    marginLeft: 5,
    marginTop: 5 
  }, 
  athleteName: {
    fontSize: 32,
    fontFamily: 'RobotoBold'
  },
  label: {
    fontSize: 18,
    fontFamily: 'RobotoBold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonLabel: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'RobotoBold',
    marginRight: 10
  }
});