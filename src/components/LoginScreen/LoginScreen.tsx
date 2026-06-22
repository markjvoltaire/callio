import React, { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Lock,
  User,
} from '@phosphor-icons/react';
import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import './LoginScreen.css';

export type AuthMode = 'signin' | 'signup';

type FormStatus = 'idle' | 'loading' | 'error' | 'confirmation';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface LoginScreenProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onBack?: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]+$/;

function getAuthErrorMessage(error: AuthError, mode: AuthMode): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Sign in failed. Check your email and password.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirm your email before signing in.';
  }

  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Sign in instead.';
  }

  if (mode === 'signup') {
    return 'Sign up failed. Check your details and try again.';
  }

  return 'Sign in failed. Check your credentials and try again.';
}

function validateSignInForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

function validateSignUpForm(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors = validateSignInForm(email, password);

  if (!username.trim()) {
    errors.username = 'Username is required.';
  } else if (username.trim().length < 3 || username.trim().length > 30) {
    errors.username = 'Username must be 3–30 characters.';
  } else if (!usernamePattern.test(username.trim())) {
    errors.username = 'Use letters, numbers, and underscores only.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function LoginScreen({
  mode,
  onModeChange,
  onBack,
}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>({});

  const isSignUp = mode === 'signup';
  const isSubmitting = status === 'loading';

  const switchMode = (nextMode: AuthMode) => {
    setErrors({});
    setStatus('idle');
    onModeChange(nextMode);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = isSignUp
      ? validateSignUpForm(username, email, password, confirmPassword)
      : validateSignInForm(email, password);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { username: username.trim() },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          return;
        }

        setStatus('confirmation');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setStatus('error');
      setErrors({
        general: getAuthErrorMessage(error as AuthError, mode),
      });
    }
  };

  if (status === 'confirmation') {
    return (
      <div className="login-page login-page--single">
        <section className="login-panel login-panel--centered">
          <div className="login-panel__inner">
            <div className="login-success">
              <h2 className="login-success__title">Check your email</h2>
              <p className="login-success__body">
                We sent a confirmation link to <code>{email.trim()}</code>.
                Confirm your account, then sign in.
              </p>
              <button
                type="button"
                className="login-button"
                onClick={() => switchMode('signin')}
              >
                Back to sign in
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="login-page">
      <section className="login-brand" aria-hidden="true">
        <div className="login-brand__glow login-brand__glow--one" />
        <div className="login-brand__glow login-brand__glow--two" />
        <div className="login-brand__content">
          <h1 className="login-brand__headline">
            Talk about what matters, topic by topic.
          </h1>
          <p className="login-brand__copy">
            Join curated discussions across pre-selected subjects chosen for
            focused conversation.
          </p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel__inner">
          <header className="login-panel__header">
            {onBack ? (
              <button
                type="button"
                className="login-back-button"
                onClick={onBack}
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} weight="bold" />
                Back
              </button>
            ) : null}
            <h2 className="login-panel__title">
              {isSignUp ? 'Create an account' : 'Sign in'}
            </h2>
            <p className="login-panel__subtitle">
              {isSignUp
                ? 'Pick a username and join the discussion.'
                : 'Sign in to browse topics and join the discussion.'}
            </p>
          </header>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {errors.general ? (
              <p className="login-form__alert" role="alert">
                {errors.general}
              </p>
            ) : null}

            {isSignUp ? (
              <div className="login-field">
                <label className="login-field__label" htmlFor="username">
                  Username
                </label>
                <div
                  className={`login-field__control ${
                    errors.username ? 'login-field__control--error' : ''
                  }`}
                >
                  <User
                    className="login-field__icon"
                    size={18}
                    weight="regular"
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="your_username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={
                      errors.username ? 'username-error' : undefined
                    }
                  />
                </div>
                {errors.username ? (
                  <p
                    className="login-field__error"
                    id="username-error"
                    role="alert"
                  >
                    {errors.username}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="login-field">
              <label className="login-field__label" htmlFor="email">
                Email
              </label>
              <div
                className={`login-field__control ${
                  errors.email ? 'login-field__control--error' : ''
                }`}
              >
                <EnvelopeSimple
                  className="login-field__icon"
                  size={18}
                  weight="regular"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email ? (
                <p className="login-field__error" id="email-error" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="login-field">
              <div className="login-field__label-row">
                <label className="login-field__label" htmlFor="password">
                  Password
                </label>
                {!isSignUp ? (
                  <button
                    type="button"
                    className="login-link-button"
                    disabled={isSubmitting}
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
              <div
                className={`login-field__control ${
                  errors.password ? 'login-field__control--error' : ''
                }`}
              >
                <Lock
                  className="login-field__icon"
                  size={18}
                  weight="regular"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                />
                <button
                  type="button"
                  className="login-field__toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeSlash size={18} weight="regular" />
                  ) : (
                    <Eye size={18} weight="regular" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p
                  className="login-field__error"
                  id="password-error"
                  role="alert"
                >
                  {errors.password}
                </p>
              ) : null}
            </div>

            {isSignUp ? (
              <div className="login-field">
                <label className="login-field__label" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <div
                  className={`login-field__control ${
                    errors.confirmPassword ? 'login-field__control--error' : ''
                  }`}
                >
                  <Lock
                    className="login-field__icon"
                    size={18}
                    weight="regular"
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword ? 'confirm-password-error' : undefined
                    }
                  />
                </div>
                {errors.confirmPassword ? (
                  <p
                    className="login-field__error"
                    id="confirm-password-error"
                    role="alert"
                  >
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>
            ) : null}

            {!isSignUp ? (
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isSubmitting}
                />
                <span>Keep me signed in on this device</span>
              </label>
            ) : null}

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="login-button__loading">
                  <span className="login-button__spinner" aria-hidden="true" />
                  {isSignUp ? 'Creating account' : 'Signing in'}
                </span>
              ) : isSignUp ? (
                'Create account'
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="login-panel__footer">
            {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              className="login-link-button"
              onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
              disabled={isSubmitting}
            >
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
