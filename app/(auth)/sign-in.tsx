import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import { useSession } from '@/context/SessionProvider';
import { useForm, Controller } from 'react-hook-form'; 
import { router } from 'expo-router';
import { useDatabaseStore } from '@/context/DatabaseProvider';

interface FormData {
  firstname: string, 
  lastname: string
}

const SignIn = () => {

  const { theme } = useTheme(); 
  const { login } = useSession(); 
  const { addAthlete } = useDatabaseStore(); 

  const {
    control, 
    handleSubmit, 
    formState: {errors, isSubmitting}
  } = useForm<FormData>({
    defaultValues: {
      firstname: '', 
      lastname: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.firstname, data.lastname); 

      addAthlete(data.firstname, data.lastname).then(() => {

      }).catch(err => Alert.alert("Errore nella Registrazione", err)); 

      router.replace('/'); 
    } catch (error) {
      Alert.alert("Errore nel login", error as string); 
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
  
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: theme.accent }]}>KarateLogs</Text>
      </View>


      <View style={styles.form}>
        <View>
          <Text style={[styles.textLabel, { color: theme.textPrimary }]}>Nome</Text>
          <Controller
            control={control}
            rules={{
              required: 'Il nome è obbligatorio',
              minLength: {
                value: 4,
                message: 'Il nome deve contenere almeno 4 caratteri',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.textPrimary },
                  errors.firstname && { borderColor: theme.error },
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Inserisci nome"
                placeholderTextColor={theme.textSecondary}
              />
            )}
            name="firstname"
          />
          {errors.firstname && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.firstname.message}
            </Text>
          )}
        </View>

        <View>
          <Text style={[styles.textLabel, { color: theme.textPrimary }]}>Cognome</Text>
          <Controller
            control={control}
            rules={{
              required: 'Il cognome è obbligatorio',
              minLength: {
                value: 4,
                message: 'Il cognome deve contenere almeno 4 caratteri',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.textPrimary },
                  errors.lastname && { borderColor: theme.error },
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Inserisci cognome"
                placeholderTextColor={theme.textSecondary}
              />
            )}
            name="lastname"
          />
          {errors.lastname && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.lastname.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.button,
            { backgroundColor: theme.cardBackground },
          ]}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: theme.accent }]}>
            {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </Text>
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20, 
    flexDirection: 'column', 
    justifyContent: 'center', 
  }, 
  titleContainer: {
    marginBottom: 20, 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: 5 
  }, 
  text: {
    fontSize: 14, 
    textAlign: 'center',
    fontFamily: 'RobotoLight'
  }, 
  form: {
    display: 'flex',  
    gap: 10
  }, 
  titleText: {
    fontSize: 42,  
    fontFamily: 'RobotoBold'
  }, 
  textLabel: {
    fontSize: 16, 
    fontFamily: 'RobotoMedium'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontFamily: 'RobotoRegular'
  },
  inputError: {
      borderColor: '#ff4444',
  },
  errorText: {
      color: '#ff4444',
      fontSize: 12,
      marginBottom: 10,
      fontFamily: 'RobotoMedium'
  },
  button: {
      borderRadius: 5,
      padding: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  },
  buttonText: {
      fontFamily: 'RobotoBold'
  },
});

export default SignIn; 