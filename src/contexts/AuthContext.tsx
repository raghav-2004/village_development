import React, { createContext, useContext } from 'react';
import { autoLogin } from '../lib/mockAPI';

// Get a static user that will never change
const DEFAULT_AUTH_DATA = autoLogin();

interface User {
  id: string;
  email: string;
  role: 'villager' | 'admin' | 'official';
}

interface AuthContextType {
  user: User;
  login: () => void;
  logout: () => void;
  register: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create a static context with pre-defined values
const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_AUTH_DATA.user,
  login: () => {},
  logout: () => {},
  register: () => {},
  isLoading: false,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always return the default user without any state changes
  const authValue = {
    user: DEFAULT_AUTH_DATA.user,
    isLoading: false,
    error: null,
    login: () => {
      console.log('Login called - demo mode, no action needed');
    },
    logout: () => {
      console.log('Logout called - demo mode, no action needed');
    },
    register: () => {
      console.log('Register called - demo mode, no action needed');
    }
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}