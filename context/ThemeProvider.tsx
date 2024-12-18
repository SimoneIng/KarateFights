import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
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
  const [isDark, setIsDark] = useState(() => {
    if (initialTheme) {
      return initialTheme === 'dark';
    }
    return systemColorScheme === 'dark';
  });

  useEffect(() => {
    if (!initialTheme) {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, initialTheme]);

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