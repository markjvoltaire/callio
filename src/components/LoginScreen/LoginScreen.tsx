import React, { FormEvent, useState } from 'react';
import { EnvelopeSimple, Eye, EyeSlash, Lock } from '@phosphor-icons/react';
import './LoginScreen.css';

type FormStatus = 'idle' | 'loading' | 'error';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(email: string, password: string): FormErrors {
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

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      // TODO: Replace with real auth API call when backend is ready.
      await new Promise((resolve) => window.setTimeout(resolve, 900));

      onLoginSuccess(email.trim());
    } catch {
      setStatus('error');
      setErrors({
        general: 'Sign in failed. Check your credentials and try again.',
      });
    }
  };

  const isSubmitting = status === 'loading';

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
            <h2 className="login-panel__title">Sign in</h2>
            <p className="login-panel__subtitle">
              Sign in to browse topics and join the discussion.
            </p>
          </header>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
              {errors.general ? (
                <p className="login-form__alert" role="alert">
                  {errors.general}
                </p>
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
                  <button
                    type="button"
                    className="login-link-button"
                    disabled={isSubmitting}
                  >
                    Forgot password?
                  </button>
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
                    autoComplete="current-password"
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

              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isSubmitting}
                />
                <span>Keep me signed in on this device</span>
              </label>

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="login-button__loading">
                    <span className="login-button__spinner" aria-hidden="true" />
                    Signing in
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

          <p className="login-panel__footer">
            New here?{' '}
            <button type="button" className="login-link-button">
              Create an account
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
