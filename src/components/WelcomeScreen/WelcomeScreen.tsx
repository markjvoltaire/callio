import React from "react";
import "./WelcomeScreen.css";

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function WelcomeScreen({
  onSignIn,
  onSignUp,
}: WelcomeScreenProps) {
  return (
    <div className="welcome-page">
      <div
        className="welcome-page__glow welcome-page__glow--one"
        aria-hidden="true"
      />
      <div
        className="welcome-page__glow welcome-page__glow--two"
        aria-hidden="true"
      />

      <main className="welcome-page__content">
        <p className="welcome-page__eyebrow">Callio</p>
        <h1 className="welcome-page__headline">
          Talk about what matters, topic by topic.
        </h1>
        <p className="welcome-page__copy">
          Join curated discussions across pre-selected subjects chosen for
          focused conversation.
        </p>

        <div className="welcome-page__actions">
          <button
            type="button"
            className="welcome-page__button"
            onClick={onSignIn}
          >
            Sign in
          </button>
          <button
            type="button"
            className="welcome-page__button welcome-page__button--secondary"
            onClick={onSignUp}
          >
            Create an account
          </button>
        </div>
      </main>
    </div>
  );
}
