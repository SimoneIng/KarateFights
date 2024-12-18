// context/SessionContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  firstname: string;
  lastname: string;
}

interface SessionContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // aggiungi stato di caricamento
  login: (firstname: string, lastname: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Stato di caricamento iniziale

  useEffect(() => {
    const checkAuthentication = async () => {
      const firstname = await AsyncStorage.getItem('firstname');
      const lastname = await AsyncStorage.getItem('lastname');
      
      if (firstname && lastname) {
        setUser({ firstname, lastname });
        setIsAuthenticated(true);
      }
      setLoading(false); // Fine caricamento
    };

    checkAuthentication();
  }, []);

  const login = async (firstname: string, lastname: string) => {
    await AsyncStorage.setItem('firstname', firstname);
    await AsyncStorage.setItem('lastname', lastname);
    setUser({ firstname, lastname });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('firstname');
    await AsyncStorage.removeItem('lastname');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SessionContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
