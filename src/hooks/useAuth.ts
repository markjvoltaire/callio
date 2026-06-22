import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

export function getUsername(user: User): string {
  const metadata = user.user_metadata as { username?: string } | undefined;

  if (metadata?.username) {
    return metadata.username;
  }

  if (user.email) {
    return user.email.split('@')[0];
  }

  return 'member';
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      if (isMounted) {
        setSession(nextSession);
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isLoading,
    isLoggedIn: Boolean(session),
  };
}
