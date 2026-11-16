import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, getUserProfileService } from '../lib/supabase';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  // Demo helpers when supabase is not connected
  setDemoAdmin: () => void;
  setDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'gta6_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const userProfile = await getUserProfileService(userId);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // Fallback profile if record not yet created
        setProfile({
          id: userId,
          email,
          full_name: email.split('@')[0],
          role: 'user',
          created_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      // Local demo auth check
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          setUser({
            id: parsed.id,
            email: parsed.email,
            app_metadata: {},
            user_metadata: { full_name: parsed.full_name },
            aud: 'authenticated',
            created_at: parsed.created_at,
          } as unknown as User);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
      return;
    }

    // Supabase auth subscription
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      // In demo mode: accept any login
      const isAdminEmail = email.toLowerCase().includes('admin') || password === 'admin123';
      const mockProfile: UserProfile = {
        id: 'demo-' + Date.now(),
        email,
        full_name: email.split('@')[0].toUpperCase(),
        role: isAdminEmail ? 'admin' : 'user',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockProfile));
      setProfile(mockProfile);
      setUser({
        id: mockProfile.id,
        email,
        aud: 'authenticated',
        created_at: mockProfile.created_at,
      } as unknown as User);
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || '');
    }

    return { success: true };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isConfigured) {
      const mockProfile: UserProfile = {
        id: 'demo-' + Date.now(),
        email,
        full_name: fullName || email.split('@')[0],
        role: 'user', // new signups are regular users by default
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockProfile));
      setProfile(mockProfile);
      setUser({
        id: mockProfile.id,
        email,
        aud: 'authenticated',
        created_at: mockProfile.created_at,
      } as unknown as User);
      return { success: true };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || '');
    }

    return { success: true };
  };

  const signOut = async () => {
    if (!isConfigured) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const setDemoAdmin = () => {
    const adminProfile: UserProfile = {
      id: 'demo-admin-id',
      email: 'admin@rockstargames.gta',
      full_name: 'Vice City Syndicate Admin',
      role: 'admin',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminProfile));
    setProfile(adminProfile);
    setUser({
      id: adminProfile.id,
      email: adminProfile.email,
      aud: 'authenticated',
      created_at: adminProfile.created_at,
    } as unknown as User);
  };

  const setDemoUser = () => {
    const regularProfile: UserProfile = {
      id: 'demo-user-id',
      email: 'player@vicecity.gta',
      full_name: 'Leonida Resident',
      role: 'user',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(regularProfile));
    setProfile(regularProfile);
    setUser({
      id: regularProfile.id,
      email: regularProfile.email,
      aud: 'authenticated',
      created_at: regularProfile.created_at,
    } as unknown as User);
  };

  const role: UserRole = profile?.role || 'user';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        setDemoAdmin,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
