// src/app/providers/AuthProvider.jsx
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session on app launch (e.g. user closed and reopened the app)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Keep session in sync with login/logout/token refresh events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = ({ email, password }) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = ({ email, password }) =>
    supabase.auth.signUp({ email, password });

  const signOut = () => supabase.auth.signOut();

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}