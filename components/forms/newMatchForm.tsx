import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Match, Tournament, Athlete } from '@/database/types';
import CustomInput from '../commons/CustomInput';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';

type MatchFormData = Omit<Match, 'id'>;

interface Props {
  tournament: Tournament;
  akaAthlete: Athlete;
  aoAthlete: Athlete;
  onSubmit: (data: MatchFormData) => Promise<void>;
}

const calculateScore = (values: Partial<MatchFormData>, prefix: 'ao' | 'aka') => {
  // Tecniche da 1 punto
  const onePointTechniques = [
    `${prefix}Kizami`,
    `${prefix}JyakuJodan`,
    `${prefix}JyakuChudan`,
  ].reduce((sum, key) => {
    const value = Number(values[key as keyof MatchFormData]) || 0;
    return sum + value * 1;
  }, 0);

  // tecniche da 2 punti 
  const twoPointTechniques = [
    `${prefix}ChudanMawashi`,
  ].reduce((sum, key) => {
    const value = Number(values[key as keyof MatchFormData]) || 0; 
    return sum + value * 2; 
  }, 0)

  // Tecniche da 3 punti
  const threePointTechniques = [
    `${prefix}JodanMawashi`,
    `${prefix}Uramawashi`,
    `${prefix}Sweep`,
  ].reduce((sum, key) => {
    const value = Number(values[key as keyof MatchFormData]) || 0;
    return sum + value * 3;
  }, 0);

  return onePointTechniques + twoPointTechniques + threePointTechniques;
};

const NewMatchForm = ({ tournament, akaAthlete, aoAthlete, onSubmit }: Props) => {
  const { control, watch, setValue, handleSubmit } = useForm<MatchFormData>({
    defaultValues: {
      tournamentId: tournament.id,
      akaAthleteId: akaAthlete.AthleteId,
      aoAthleteId: aoAthlete.AthleteId,

      aoScore: 0,
      akaScore: 0,

      aoKizami: 0,
      aoJyakuJodan: 0,
      aoJyakuChudan: 0,

      aoJodanMawashi: 0,
      aoChudanMawashi: 0,
      aoUramawashi: 0,
      aoSweep: 0, 

      akaKizami: 0,
      akaJyakuJodan: 0, 
      akaJyakuChudan: 0, 

      akaJodanMawashi: 0,
      akaChudanMawashi: 0,
      akaUramawashi: 0,
      akaSweep: 0, 

      matchDescription: '',
      aoSummary: '',
      akaSummary: '',
    }
  });

  // Osserva tutti i campi delle tecniche
  const values = watch();

  // Aggiorna i punteggi quando cambiano i valori delle tecniche
  useEffect(() => {
    // Calcola e imposta aoScore
    const newAoScore = calculateScore(values, 'ao');
    setValue('aoScore', newAoScore);
    
    // Calcola e imposta akaScore
    const newAkaScore = calculateScore(values, 'aka');
    setValue('akaScore', newAkaScore);
  }, [
    values.aoKizami,
    values.aoJyakuJodan,
    values.aoJyakuChudan,
    values.aoJodanMawashi,
    values.aoChudanMawashi,
    values.aoUramawashi,
    values.aoSweep, 
    values.akaKizami,
    values.akaJyakuJodan,
    values.akaJyakuChudan, 
    values.akaJodanMawashi,
    values.akaChudanMawashi,
    values.akaUramawashi,
    values.akaSweep, 
    setValue
  ]);

  const { theme } = useTheme(); 

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Scores Display */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreLabel, {color: theme.textPrimary}]}>{aoAthlete.firstname}</Text>
            <Text style={[styles.scoreLabel, {color: theme.textPrimary}]}>{aoAthlete.lastname}</Text>
            <Text style={[styles.scoreValue, {color: theme.textPrimary}]}>{values.aoScore}</Text>
          </View>
          <Text style={[styles.vsText, {color: theme.textPrimary}]}>VS</Text>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreLabel, {color: theme.textPrimary}]}>{akaAthlete.firstname}</Text>
            <Text style={[styles.scoreLabel, {color: theme.textPrimary}]}>{akaAthlete.lastname}</Text>
            <Text style={[styles.scoreValue, {color: theme.textPrimary}]}>{values.akaScore}</Text>
          </View>
        </View>

        <View style={styles.valueBox}>
          <CustomInput name="Kizami" color="blue" control={control} fieldName="aoKizami" />
          <CustomInput name="Kizami" color="red" control={control} fieldName="akaKizami" />
        </View>

        <View style={styles.valueBox}>
          <CustomInput name="Jyaku Jodan" color="blue" control={control} fieldName="aoJyakuJodan" />
          <CustomInput name="Jyaku Jodan" color="red" control={control} fieldName="akaJyakuJodan" />
        </View>

        <View style={styles.valueBox}>
          <CustomInput name="Jyaku Chudan" color="blue" control={control} fieldName="aoJyakuChudan" />
          <CustomInput name='Jyaku Chudan' color='red' control={control} fieldName='akaJyakuChudan' /> 
        </View>

        <View style={styles.valueBox}>
          <CustomInput name="Jod. Mawashi" color="blue" control={control} fieldName="aoJodanMawashi" />
          <CustomInput name="Jod. Mawashi" color="red" control={control} fieldName="akaJodanMawashi" />
        </View>

        <View style={styles.valueBox}>
          <CustomInput name="Chud. Mawashi" color="blue" control={control} fieldName="aoChudanMawashi" />
          <CustomInput name="Chud. Mawashi" color="red" control={control} fieldName="akaChudanMawashi" />
        </View>

        <View style={styles.valueBox}>
          <CustomInput name="Uramawashi" color="blue" control={control} fieldName="aoUramawashi" />
          <CustomInput name="Uramawashi" color="red" control={control} fieldName="akaUramawashi" />
        </View>

        <View style={styles.valueBox}>
          <CustomInput name='Spazzata' color='blue' control={control} fieldName='aoSweep' />
          <CustomInput name='Spazzata' color='red' control={control} fieldName='akaSweep' />
        </View>


        <Controller
        control={control}
        rules={{}}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>Note Incontro</Text>
            <TextInput
              style={[styles.input, {borderColor: theme.border, color: theme.textPrimary}]}
              onBlur={onBlur}
              multiline
              onChangeText={onChange}
              value={value}
            ></TextInput>
          </View>
          )}
        name='matchDescription'
        />

      <Controller
        control={control}
        rules={{}}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>Riassunto {aoAthlete.firstname + " " + aoAthlete.lastname}</Text>
            <TextInput
              style={[styles.input, {borderColor: theme.border, color: theme.textPrimary}]}
              onBlur={onBlur}
              multiline
              onChangeText={onChange}
              value={value}
            ></TextInput>
          </View>
        )}
        name='aoSummary'
        />

      <Controller
        control={control}
        rules={{}}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, {color: theme.textPrimary}]}>Riassunto {akaAthlete.firstname + " " + akaAthlete.lastname}</Text>
            <TextInput
              style={[styles.input, {borderColor: theme.border, color: theme.textPrimary}]}
              onBlur={onBlur}
              multiline
              onChangeText={onChange}
              value={value}
            ></TextInput>
          </View>
        )}
        name='akaSummary'
        />

        <View style={{
          flex: 1,  
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
          <Ionicons name='information-circle' size={18} color={theme.textPrimary} />
          <Text style={{fontSize: 12, fontFamily: 'RobotoLight', color: theme.textPrimary}}>Le descrizioni possono essere modificate successivamente.</Text>
        </View>

        {/* Salva Incontro Button */}
        <TouchableOpacity style={[styles.addMatchBanner, {backgroundColor: theme.cardBackground}]} onPress={handleSubmit(onSubmit)}>
          <Text style={[styles.addMatchLabel, {color: theme.accent}]}>Salva Incontro</Text>
          <Ionicons name="bookmark" size={24} color={theme.accent} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, 
    marginBottom: 5,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: 'RobotoMedium'
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: 'RobotoBold',
    marginTop: 5,
  },
  vsText: {
    fontSize: 18,
    fontFamily: 'RobotoBold', 
    textAlign: 'center',
  },
  valueBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 18,
    fontFamily: 'RobotoBold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  addMatchBanner: {
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addMatchLabel: {
    fontSize: 18,
    fontFamily: 'RobotoBold'
  },
});

export default NewMatchForm;