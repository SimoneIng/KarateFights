import { View, Text, Pressable, StyleSheet, Alert, TextInput } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import { useSession } from '@/context/SessionProvider';
import { useForm, Controller } from 'react-hook-form'; 
import { router } from 'expo-router';
import { useAthletes } from '@/database/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  firstname: string, 
  lastname: string
}

const SignIn = () => {

  const { theme, isDark } = useTheme(); 
  const { login } = useSession(); 
  const { addAthlete } = useAthletes(); 

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

      // Salva nuovo utente come primo atleta e salva id in asyncstorage
      addAthlete(data.firstname, data.lastname).then(id => {
        AsyncStorage.setItem("userAthleteId", id.toString()); 
      }).catch(error => {
        Alert.alert("Errore Login", error)
      })

      router.replace('/'); 
    } catch (error) {
      Alert.alert("Errore nel login", error as string); 
    }
  }

  return (
    <View style={[styles.container, { }]}>
  
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: theme.accent }]}>Accedi</Text>
        {/* <Text style={[styles.text, {color: theme.textSecondary}]}>Una volta effettuato l'accesso le tue credenziali rimangono salvate all'interno del tuo dispositivo, insieme a tutti i dati dell'applicazione. Fai attenzione a non cancellare nulla.</Text> */}
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

        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.button,
            { backgroundColor: theme.accent },
          ]}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </Text>
        </Pressable>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginHorizontal: 20, 
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
    textAlign: 'center'
  }, 
  form: {
    display: 'flex',  
    gap: 10
  }, 
  titleText: {
    fontSize: 42,  
  }, 
  textLabel: {
    fontSize: 16, 
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  inputError: {
      borderColor: '#ff4444',
  },
  errorText: {
      color: '#ff4444',
      fontSize: 12,
      marginBottom: 10,
  },
  button: {
      borderRadius: 5,
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  },
  buttonText: {
      fontWeight: '600'
  },
});

export default SignIn; 