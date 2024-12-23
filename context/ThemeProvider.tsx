import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors, lightTheme, darkTheme } from '@/constants/Colors';

interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

// Creazione del context con tipo
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {}
});

// Hook personalizzato tipizzato
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve essere usato all\'interno di un ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme 
}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(() => false);

  // Chiave per memorizzare il tema in AsyncStorage
  const THEME_STORAGE_KEY = 'user_theme_preference';

  // Recupera la preferenza del tema al montaggio
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        } else if (!initialTheme) {
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Errore durante il recupero della preferenza del tema:', error);
      }
    };
    loadThemePreference();
  }, [systemColorScheme, initialTheme]);

  // Salva la preferenza del tema ogni volta che cambia
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
      } catch (error) {
        console.error('Errore durante il salvataggio della preferenza del tema:', error);
      }
    };
    saveThemePreference();
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Esporta anche i temi per possibile uso diretto
export const themes = {
  light: lightTheme,
  dark: darkTheme
};
