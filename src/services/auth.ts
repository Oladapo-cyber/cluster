import type { User } from '@supabase/supabase-js';
import {
  clearStoredSessionTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredSessionTokens,
} from './auth-storage';
import { getSupabaseClient } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}

export interface SignupResult {
  user: AuthUser | null;
  requiresEmailConfirmation: boolean;
}

const mapUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
  fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
});

const saveSessionFromAuth = (accessToken?: string, refreshToken?: string): void => {
  if (!accessToken || !refreshToken) {
    return;
  }

  setStoredSessionTokens(accessToken, refreshToken);
};

export const signUpWithPassword = async (
  email: string,
  password: string,
  fullName?: string,
): Promise<SignupResult> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName?.trim() || undefined,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  saveSessionFromAuth(data.session?.access_token, data.session?.refresh_token);

  return {
    user: data.user ? mapUser(data.user) : null,
    requiresEmailConfirmation: !data.session,
  };
};

export const signInWithPassword = async (email: string, password: string): Promise<AuthUser> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    throw new Error(error?.message ?? 'Unable to sign in');
  }

  saveSessionFromAuth(data.session.access_token, data.session.refresh_token);
  return mapUser(data.user);
};

export const signOut = async (): Promise<void> => {
  clearStoredSessionTokens();
};

export const getAuthenticatedUser = async (): Promise<AuthUser | null> => {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }

  return mapUser(data.user);
};

export const restoreSessionIfNeeded = async (): Promise<boolean> => {
  const accessToken = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();
  if (!accessToken || !refreshToken) {
    return false;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    clearStoredSessionTokens();
    return false;
  }

  saveSessionFromAuth(data.session.access_token, data.session.refresh_token);
  return true;
};

export const attemptSessionRefresh = async (): Promise<boolean> => {
  return restoreSessionIfNeeded();
};