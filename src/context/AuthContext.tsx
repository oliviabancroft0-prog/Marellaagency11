import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import { syncUserProfile } from '../lib/setup';
import type { UserSchema, AuthSession } from '@insforge/sdk';

interface AuthContextType {
  user: UserSchema | null;
  profile: any | null;
  session: AuthSession | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data.user) {
        setUser(null);
        setProfile(null);
        setSession(null);
      } else {
        const currentUser = data.user;
        setUser(currentUser);
        
        // Fetch profile
        let { data: profileData } = await insforge.database
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!profileData) {
          // If profile doesn't exist, sync it now
          await syncUserProfile();
          // Re-fetch
          const { data: retriedProfile } = await insforge.database
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          profileData = retriedProfile;
        }
        
        // Merge with auth metadata for things that might not be in DB yet (e.g. if column hasn't been added)
        // We use full_name prefixes as fallbacks for status
        const rawName = profileData?.full_name || '';
        const rolePending = rawName.includes('ROLE_PENDING:');
        const onboardingPending = rawName.includes('ONBOARDING_PENDING:');
        const isCreator = rawName.includes('ROLE_CREATOR:');
        const isFan = rawName.includes('ROLE_FAN:');
        
        const cleanName = rawName
          .replace('ROLE_PENDING:', '')
          .replace('ONBOARDING_PENDING:', '')
          .replace('ROLE_CREATOR:', '')
          .replace('ROLE_FAN:', '');

        let role = profileData?.role;
        if (!role) {
          if (isCreator) role = 'creator';
          else if (isFan) role = 'fan';
          else if (rolePending) role = null;
        }

        const isAdmin = currentUser.email === 'oliviabancroft0@gmail.com';

        const enrichedProfile = profileData ? {
          ...profileData,
          displayName: cleanName,
          role: isAdmin ? 'admin' : role,
          isAdmin,
          onboarding_completed: (profileData.onboarding_completed ?? (!onboardingPending && role !== null)) || isAdmin
        } : null;
        
        setProfile(enrichedProfile);

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
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshAuth }}>
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
