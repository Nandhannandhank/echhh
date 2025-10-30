import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Profile, getCurrentUser, setCurrentUser, login as mockLogin, register as mockRegister, logout as mockLogout } from '../data/mockData';

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setProfile(currentUser);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      const newUser = mockRegister(email, password, fullName);
      setUser(newUser);
      setProfile(newUser);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Failed to create account' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const loggedInUser = mockLogin(email, password);
      if (!loggedInUser) {
        return { error: 'Invalid email or password' };
      }

      setUser(loggedInUser);
      setProfile(loggedInUser);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Failed to sign in' };
    }
  };

  const signOut = async () => {
    mockLogout();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
