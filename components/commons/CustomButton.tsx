import { Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeProvider'
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
    title: string; 
    iconName: typeof Ionicons.defaultProps;  
    handlePress: () => void; 
}

const CustomButton = ({title, iconName, handlePress}: Props) => {

  return (
    <TouchableOpacity 
      style={[styles.container, {backgroundColor: '#4361ee'}]} 
      onPress={handlePress}
    >
      <Text style={[styles.text, {color: '#fff', fontFamily: 'RobotoMono-Regular'}]}>{title}</Text> 
      <Ionicons name={iconName} size={24} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,  
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexDirection: 'row', 
    borderRadius: 5, 
    gap: 10
  }, 
  text: {
    fontSize: 18, 
    letterSpacing: 1, 
    fontWeight: '600', 
  }
});

export default CustomButton; 