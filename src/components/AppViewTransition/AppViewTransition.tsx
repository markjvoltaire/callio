import React, { ReactNode, useEffect, useState } from 'react';

interface AppViewTransitionProps {
  viewKey: string;
  children: ReactNode;
}

const HOME_VIEW_KEY = 'home';

export default function AppViewTransition({
  viewKey,
  children,
}: AppViewTransitionProps) {
  const [displayKey, setDisplayKey] = useState(viewKey);
  const [content, setContent] = useState(children);
  const [isEnteringHome, setIsEnteringHome] = useState(viewKey === HOME_VIEW_KEY);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (viewKey === displayKey) {
      setContent(children);
      return;
    }

    if (viewKey === HOME_VIEW_KEY) {
      setDisplayKey(viewKey);
      setContent(children);
      setIsEnteringHome(true);
      return;
    }

    setIsEnteringHome(false);
    setDisplayKey(viewKey);
    setContent(children);
  }, [viewKey, children, displayKey]);

  useEffect(() => {
    if (!isEnteringHome) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsEnteringHome(false);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [isEnteringHome, displayKey]);

  return (
    <div
      className={[
        'app-view',
        displayKey === HOME_VIEW_KEY && isEnteringHome && isReady
          ? 'app-view--home-enter'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
    </div>
  );
}
