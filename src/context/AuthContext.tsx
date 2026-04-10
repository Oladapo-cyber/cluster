import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  attemptSessionRefresh,
  getAuthenticatedUser,
  restoreSessionIfNeeded,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  type AuthUser,
  type SignupResult,
} from '../services/auth';
import { AUTH_SESSION_EXPIRED_EVENT } from '../services/auth-storage';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<SignupResult>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const restored = await restoreSessionIfNeeded();
        if (!restored) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const currentUser = await getAuthenticatedUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void (async () => {
        const refreshed = await attemptSessionRefresh();
        if (!refreshed) {
          setUser(null);
          return;
        }

        const currentUser = await getAuthenticatedUser();
        setUser(currentUser);
      })();
    }, 12 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signUp: async (email, password, fullName) => {
        const result = await signUpWithPassword(email, password, fullName);
        if (result.user && !result.requiresEmailConfirmation) {
          setUser(result.user);
        }
        return result;
      },
      signIn: async (email, password) => {
        const nextUser = await signInWithPassword(email, password);
        setUser(nextUser);
      },
      logout: async () => {
        await signOut();
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};