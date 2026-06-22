import React, { useMemo, useState } from 'react';
import './App.css';
import AppViewTransition from './components/AppViewTransition/AppViewTransition';
import ForumHome from './components/ForumHome/ForumHome';
import LoginScreen, { AuthMode } from './components/LoginScreen/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import { getUsername, useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';

type GuestView = 'welcome' | 'login';

function App() {
  const { user, isLoading, isLoggedIn } = useAuth();
  const [guestView, setGuestView] = useState<GuestView>('welcome');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const openLogin = (mode: AuthMode) => {
    setAuthMode(mode);
    setGuestView('login');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthMode('signin');
    setGuestView('welcome');
  };

  const viewKey = useMemo(() => {
    if (isLoading) {
      return 'loading';
    }

    if (isLoggedIn && user) {
      return 'home';
    }

    if (guestView === 'login') {
      return 'login';
    }

    return 'welcome';
  }, [isLoading, isLoggedIn, user, guestView, authMode]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="app-loading" aria-live="polite" aria-busy="true">
          <span className="app-loading__spinner" aria-hidden="true" />
        </div>
      );
    }

    if (isLoggedIn && user) {
      return (
        <ForumHome
          userId={user.id}
          username={getUsername(user)}
          onSignOut={handleSignOut}
        />
      );
    }

    if (guestView === 'login') {
      return (
        <LoginScreen
          mode={authMode}
          onModeChange={setAuthMode}
          onBack={() => setGuestView('welcome')}
        />
      );
    }

    return (
      <WelcomeScreen
        onSignIn={() => openLogin('signin')}
        onSignUp={() => openLogin('signup')}
      />
    );
  }, [isLoading, isLoggedIn, user, guestView, authMode]);

  return (
    <AppViewTransition viewKey={viewKey}>{content}</AppViewTransition>
  );
}

export default App;
