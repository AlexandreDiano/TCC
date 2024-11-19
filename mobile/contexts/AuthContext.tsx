import React, {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserType = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  domain: string;
};

type AuthContextType = {
  token: string | null;
  user: UserType | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: UserType | null) => void;
  setRole: (role: string | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const storedRole = await AsyncStorage.getItem('role');

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedRole) {
        setRole(storedRole);
      }
    };

    loadAuthData();
  }, []);

  const value = {
    token,
    user,
    role,
    setToken,
    setUser,
    setRole,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
