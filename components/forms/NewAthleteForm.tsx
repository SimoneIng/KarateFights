import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAthletes } from '@/database/hooks';
import { useTheme } from '@/context/ThemeProvider';
import CustomButton from '../commons/CustomButton';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { useDatabaseStore } from '@/context/DatabaseProvider';


// Definizione del tipo per i dati del form
interface FormData {
  firstName: string;
  lastName: string;
}

interface Props {
  onClose: () => void; 
}

const NewAthleteForm = ({ onClose }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  const { addAthlete } = useDatabaseStore(); 

  const { theme } = useTheme(); 

  const showSuccessMessage = () => {
    showMessage({
      message: 'Atleta Inserito',
      type: 'success',
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

  const showErrorMessage = () => {
    showMessage({
      message: 'Atleta già creato',
      type: 'danger',
      floating: true,
      style: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        gap: 10,
      }, 
      icon: () => <Ionicons name='close' size={24} color='#fff' />
    })
  }

  const onSubmit = async (data: FormData) => {
    try {
      await addAthlete(data.firstName, data.lastName); 
      showSuccessMessage();
    } catch (error) {
      showErrorMessage()
    } finally {
      reset(); // Reset del form dopo l'invio
      onClose();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <View>
          <Text style={[styles.title, {color: theme.accent}]}>Nuovo Atleta</Text>
        </View>
        
        <View style={{gap: 20}}>
          {/* Campo Nome */}
          <Controller
            control={control}
            rules={{
              required: 'Il nome è obbligatorio',
              minLength: {
                value: 4,
                message: 'Il nome deve contenere almeno 2 caratteri',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text style={[styles.textLabel, {color: theme.textPrimary}]}>Nome</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.firstName && styles.errorText,
                    {color: theme.textPrimary, backgroundColor: theme.border}
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Inserisci il nome"
                  placeholderTextColor={theme.textPrimary}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>
                    {errors.firstName.message}
                  </Text>
                )}
              </View>
            )}
            name="firstName"
          />

          {/* Campo Cognome */}
          <Controller
            control={control}
            rules={{
              required: 'Il cognome è obbligatorio',
              minLength: {
                value: 4,
                message: 'Il cognome deve contenere almeno 2 caratteri',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text style={[styles.textLabel, {color: theme.textPrimary}]}>Cognome</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.lastName && styles.errorText,
                    {color: theme.textPrimary, backgroundColor: theme.border}
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Inserisci il cognome"
                  placeholderTextColor={theme.textPrimary}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>
                    {errors.lastName.message}
                  </Text>
                )}
              </View>
            )}
            name="lastName" 
          />
        </View>


        {/* Pulsante Submit */}
        <CustomButton 
            handlePress={handleSubmit(onSubmit)} 
            iconName="add-circle-outline"
            title='Aggiungi' 
        />


      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 20
  }, 
  title: {
    fontFamily: 'RobotoMono-Bold', 
    fontSize: 36, 
  },
  textLabel: {
    fontSize: 18, 
    fontFamily: 'RobotoMono-Bold'
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 5, 
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
  }
});

export default NewAthleteForm;