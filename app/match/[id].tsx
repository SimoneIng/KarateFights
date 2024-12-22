import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMatches } from '@/database/hooks';
import { MatchWithAthletes, Match } from '@/database/types';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Divider from '@/components/commons/Divider';
import { showMessage } from "react-native-flash-message";
import { useDatabaseStore } from '@/context/DatabaseProvider';

type FormData = {
  matchDescription: string; 
  aoSummary: string; 
  akaSummary: string; 
}

const MatchScreen = () => {

  const { theme } = useTheme(); 
  const { top } = useSafeAreaInsets(); 
  const { matches, updateMatch, deleteMatch } = useDatabaseStore(); 
  const { id } = useLocalSearchParams(); 

  const matchId = id as string; 

  const [match, setMatch] = useState<MatchWithAthletes | null>(null)
  const [isEditing, setIsEditing] = useState<Boolean>(false); 

  useEffect(() => {
    const matc = matches.find(match => match.id === parseInt(matchId))
    if(matc !== undefined){
      setMatch(matc)
    } else {
      router.back()
    }
  }, [])


  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      matchDescription: match?.matchDescription || '', 
      aoSummary: match?.aoSummary || '', 
      akaSummary: match?.akaSummary || ''
    }
  }); 

  const onSubmit = async (data: FormData) => {
    if(!match) return; 

    try {
      const updatedFields:Partial<Match> = {
        matchDescription: data.matchDescription, 
        aoSummary: data.aoSummary, 
        akaSummary: data.akaSummary
      }

      const updatedMatch: MatchWithAthletes = {
        ...match, 
        matchDescription: data.matchDescription, 
        aoSummary: data.aoSummary, 
        akaSummary: data.akaSummary
      }

      await updateMatch(match.id, updatedFields); 
      setMatch(updatedMatch);
      setIsEditing(false); 
    } catch(error) {
      Alert.alert("Errore", error as string); 
    }
  }

  const handleModifyMatch = () => {
    reset({
      matchDescription: match?.matchDescription || '', 
      aoSummary: match?.aoSummary || '', 
      akaSummary: match?.akaSummary || ''
    })
    setIsEditing(true);
  }

  const handleDeleteMatch = () => {
    if(match != undefined){
      deleteMatch(match?.id)
      .then(result => {
       setMatch(null); 
       // messaggio di eliminazione match
       showDeleteMatch(); 
       router.back(); 
      })
      .catch(error => Alert.alert("Errore", error)); 
    }
  }

  const showDeleteMatch = () => {
    showMessage({
      message: 'Incontro Eliminato',
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

  const handleCancel = () => {
    reset({
      matchDescription: match?.matchDescription || '', 
      aoSummary: match?.aoSummary || '', 
      akaSummary: match?.akaSummary || ''
    })
    setIsEditing(false)
  }

  if(!match){
    <View>
      <Text>Errore</Text>
    </View>
  } else {
    return (
      <View style={[styles.container, {paddingTop: top+10, backgroundColor: theme.background}]}>
        <View style={[styles.header]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='arrow-back-outline' size={36} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteMatch}>
            <Ionicons name='trash-bin-outline' size={24} color={theme.error}  />
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.content]} showsVerticalScrollIndicator={false}>
            <View style={[styles.contentHeader, {flexDirection: 'column'}]}>
              <Text style={[styles.mainLabel, {color: theme.textPrimary}]}>{match.tournament.name}</Text>
              <Text style={[styles.label, {color: theme.textSecondary}]}>Data: {match.tournament.date}</Text>
            </View>

            <View style={styles.contentHeader}>
              <View style={styles.nameContainer}>
                <Text style={{ color: 'red', fontSize: 16, fontWeight: '600' }}>Aka</Text>
                <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>{match.akaAthlete.firstname + " " + match.akaAthlete.lastname}</Text>
                <Text style={{ color: 'grey', fontSize: 16, fontWeight: '600' }}>{match.akaScore}</Text>
              </View>

              <View style={styles.nameContainer}>
                <Text style={{ color: 'blue', fontSize: 16, fontWeight: '600' }}>Ao</Text>
                <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>{match.aoAthlete.firstname + " " + match.aoAthlete.lastname}</Text>
                <Text style={{ color: 'grey', fontSize: 16, fontWeight: '600' }}>{match.aoScore}</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>Descrizione Incontro</Text>
              <Divider color={theme.textSecondary} width={0.5} />
              {isEditing ? (
                <Controller
                  control={control}
                  name='matchDescription'
                  rules={{ required: false }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={[styles.input, {color: theme.textSecondary, borderColor: theme.border}]}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                    />
                  )}
                />
              ) : (
                <Text style={[styles.description, {color: theme.textSecondary}]}>{match.matchDescription}</Text>
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>Soluzioni Aka</Text>
              <Divider color={theme.textSecondary} width={0.5} />
              {isEditing ? (
                <Controller 
                  control={control}
                  name='akaSummary'
                  rules={{ required: false }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={[styles.input, {color: theme.textSecondary, borderColor: theme.border}]}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                    />
                  )}
                />
              ) : (
                <Text style={[styles.description, {color: theme.textSecondary}]}>{match.akaSummary}</Text>
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>Soluzioni Ao</Text>
              <Divider color={theme.textSecondary} width={0.5} />
              {isEditing ? (
                <Controller
                  control={control}
                  name='aoSummary'
                  rules={{ required: false }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={[styles.input, {color: theme.textSecondary, borderColor: theme.border}]}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                    />
                  )}
                />
              ) : (
                <Text style={[styles.description, {color: theme.textSecondary}]}>{match.aoSummary}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  onPress={handleSubmit(onSubmit)} 
                  style={[styles.button, {backgroundColor: '#2a9d8f'}]}
                >
                  <Text style={[styles.buttonLabel]}>Salva</Text>
                  <Ionicons name="checkmark" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleCancel} 
                  style={[styles.button, {backgroundColor: '#e76f51'}]}
                >
                  <Text style={[styles.buttonLabel]}>Annulla</Text>
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={handleModifyMatch} 
                  style={[styles.button, {backgroundColor: '#264653'}]}
                >
                  <Text style={[styles.buttonLabel]}>Modifica</Text>
                  <Ionicons name="build-outline" size={24} color="#FFF" />
                </TouchableOpacity>
              </>
            )}
            </View>
          </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10, 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column'
  }, 
  header: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',  
    paddingHorizontal: 10 
  }, 
  content: {
    flex: 1 
  },
  contentHeader: {
    display: 'flex', 
    flexDirection: 'row', 
    marginTop: 20, 
    marginVertical: 10,
    marginRight: 15,
    justifyContent: 'space-between', 
    alignItems: 'center', 
  }, 
  label: {
    fontSize: 16,
    fontFamily: 'RobotoMono-Regular'
  },
  mainLabel: {
    fontSize: 24, 
    fontFamily: 'RobotoMono-Bold'
  }, 
  nameContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  }, 
  fieldLabel: {
    fontSize: 16, 
    fontWeight: '500', 
    marginRight: 2
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
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
    color: '#FFF'
  }, 
  textContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    marginVertical: 20
  }, 
  description: {
    fontSize: 14,
    fontFamily: 'RobotoMono-Light', 
    marginLeft: 5,
    marginTop: 5 
  }, 
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1 
  }, 
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    minHeight: 100,
    textAlignVertical: 'top'
  }
  
});

export default MatchScreen; 