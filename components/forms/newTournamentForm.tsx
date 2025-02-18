import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useTournaments } from '@/database/hooks';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../commons/CustomButton';
import { useTheme } from '@/context/ThemeProvider';
import { showMessage } from 'react-native-flash-message';
import { useDatabaseStore } from '@/context/DatabaseProvider';

interface Props {
  onClose: () => void; 
}

const NewTournamentForm: React.FC<Props> = ({ onClose }) => {

  const { addTournament } = useDatabaseStore(); 
  const { theme } = useTheme();

  const [date, setDate] = useState(new Date()); 
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(false); 
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date)
    hideDatePicker()
  }

  const showSuccessMessage = () => {
    showMessage({
      message: 'Gara Inserita',
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
      message: 'Errore',
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

  const handleSubmit = () => {
    if(title.length < 5){
      setError(true)
    } else {
      addTournament(title, date.toLocaleDateString()).then(() => {
        showSuccessMessage()
        onClose();
      }).catch(error => showErrorMessage()); 
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
          
        <View style={{gap: 20}}>
          <Text style={[styles.title, {color: theme.accent}]}>Nuova Gara</Text>
        </View>
          
          <View>
            <Text style={[styles.textLabel, {color: theme.textPrimary}]}>Titolo</Text>
            <TextInput style={[styles.input, {color: theme.textSecondary}]}
              placeholder='Inserisci Titolo'
              placeholderTextColor={theme.textSecondary}
              onChangeText={(title) => setTitle(title)}
              />
            {error && <Text style={{color: 'red', fontFamily: 'RobotoMedium'}}>Titolo troppo corto</Text>}  
          </View>

          <Text style={[styles.textLabel, {color: theme.textPrimary}]}>Data</Text>
          <Pressable style={[styles.button, styles.pickerButton, {backgroundColor: theme.cardBackground}]} onPress={showDatePicker} >
            <Ionicons name='calendar-clear' size={24} color={theme.textPrimary} />
            <Text style={[styles.buttonText, {color: theme.textSecondary}]} >{date.toLocaleDateString()}</Text>
          </Pressable>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode='date'
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

        <CustomButton 
            handlePress={handleSubmit} 
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
    fontFamily: 'RobotoBold', 
    fontSize: 36
  },
  textLabel: {
    fontSize: 21,
    fontFamily: 'RobotoBold'
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 5, 
    fontSize: 16,
    borderWidth: 0.5, 
    fontFamily: 'RobotoMedium'
  },
  button: {
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'RobotoMedium'
  },
  pickerButton: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  }
});

export default NewTournamentForm;