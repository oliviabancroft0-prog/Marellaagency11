import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import type { UserSchema, AuthSession } from '@insforge/sdk';

interface AuthContextType {
  user: UserSchema | null;
  session: AuthSession | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error) {
        setUser(null);
        setSession(null);
      } else {
        setUser(data.user);
        // Note: SDK session getter might be needed if not in data
        const currentSession = (insforge as any).tokenManager?.getSession();
        setSession(currentSession);
      }
    } catch (err) {
      console.error('Error refreshing auth:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();

    // The SDK uses tokenManager.onTokenChange for internal updates
    if ((insforge as any).tokenManager) {
      const originalOnTokenChange = (insforge as any).tokenManager.onTokenChange;
      (insforge as any).tokenManager.onTokenChange = () => {
        if (originalOnTokenChange) originalOnTokenChange();
        refreshAuth();
      };
    }
  }, []);

  const signOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
