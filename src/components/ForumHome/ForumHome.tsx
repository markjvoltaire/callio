import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Airplane,
  CoatHanger,
  House,
  SignOut,
  SoccerBall,
  Sun,
  User,
} from '@phosphor-icons/react';
import { getPostsForTopic } from '../../data/posts';
import { forumTopics } from '../../data/topics';
import { getUserById } from '../../data/users';
import './ForumHome.css';

interface ForumHomeProps {
  username?: string;
  onSignOut?: () => void;
}

const topicIcons: Record<string, React.ReactNode> = {
  'world-cup': <SoccerBall size={24} weight="regular" />,
  'life-in-miami': <Sun size={24} weight="regular" />,
  travel: <Airplane size={24} weight="regular" />,
  fashion: <CoatHanger size={24} weight="regular" />,
};

function getTopicLabel(topicId: string): string {
  return forumTopics.find((topic) => topic.id === topicId)?.title ?? 'Topic';
}

function getInitials(username: string): string {
  return username.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
}

function scrollFeedTo(container: HTMLDivElement | null, index: number, smooth = false) {
  if (!container) {
    return;
  }

  const left = index * container.clientWidth;

  if (typeof container.scrollTo === 'function') {
    container.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    return;
  }

  container.scrollLeft = left;
}

export default function ForumHome({ username, onSignOut }: ForumHomeProps) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const posts = useMemo(() => getPostsForTopic(activeTopicId), [activeTopicId]);

  const feedTitle = activeTopicId ? getTopicLabel(activeTopicId) : 'Home';

  useEffect(() => {
    setActivePostIndex(0);
    scrollFeedTo(feedRef.current, 0);
  }, [activeTopicId, posts.length]);

  const goToPost = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, posts.length - 1));
    setActivePostIndex(nextIndex);
    scrollFeedTo(feedRef.current, nextIndex, true);
  };

  const handleScroll = () => {
    const container = feedRef.current;
    if (!container || container.clientWidth === 0) {
      return;
    }

    const nextIndex = Math.round(container.scrollLeft / container.clientWidth);
    if (nextIndex !== activePostIndex) {
      setActivePostIndex(nextIndex);
    }
  };

  return (
    <div className="home-layout">
      <aside className="home-sidebar" aria-label="Topic categories">
        <nav className="home-sidebar__nav">
          <button
            type="button"
            className={`home-sidebar__item ${
              activeTopicId === null ? 'home-sidebar__item--active' : ''
            }`}
            onClick={() => setActiveTopicId(null)}
          >
            <House size={24} weight="regular" />
            <span>Home</span>
          </button>

          {forumTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`home-sidebar__item ${
                activeTopicId === topic.id ? 'home-sidebar__item--active' : ''
              }`}
              onClick={() => setActiveTopicId(topic.id)}
            >
              {topicIcons[topic.id]}
              <span>{topic.title}</span>
            </button>
          ))}

          <button type="button" className="home-sidebar__item home-sidebar__item--muted">
            <User size={24} weight="regular" />
            <span>Profile</span>
          </button>

          {onSignOut ? (
            <button
              type="button"
              className="home-sidebar__item home-sidebar__item--muted"
              onClick={onSignOut}
            >
              <SignOut size={24} weight="regular" />
              <span>Sign out</span>
            </button>
          ) : null}
        </nav>
      </aside>

      <main className="home-feed">
        <header className="home-feed__header">
          <div>
            <h1>{feedTitle}</h1>
            {username ? <p className="home-feed__user">@{username}</p> : null}
          </div>
          {posts.length > 0 ? (
            <p className="home-feed__count">
              {activePostIndex + 1} of {posts.length}
            </p>
          ) : null}
        </header>

        <div className="home-feed__stage">
          <button
            type="button"
            className="home-feed__nav home-feed__nav--prev"
            onClick={() => goToPost(activePostIndex - 1)}
            disabled={activePostIndex === 0 || posts.length === 0}
            aria-label="Previous post"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>

          <section
            ref={feedRef}
            className="home-feed__track"
            aria-label="User posts"
            onScroll={handleScroll}
          >
            {posts.length > 0 ? (
              posts.map((post) => {
                const user = getUserById(post.userId);

                return (
                <article key={post.id} className="home-post">
                  <div className="home-post__card">
                    <div className="home-post__top">
                      <div className="home-post__avatar" aria-hidden="true">
                        {getInitials(user?.username ?? 'user')}
                      </div>
                      <div className="home-post__meta">
                        <span className="home-post__username">@{user?.username ?? 'unknown'}</span>
                        <span className="home-post__dot">·</span>
                        <span className="home-post__time">{post.timestamp}</span>
                      </div>
                      <span className="home-post__topic">{getTopicLabel(post.topicId)}</span>
                    </div>

                    <p className="home-post__content">{post.content}</p>
                  </div>
                </article>
                );
              })
            ) : (
              <div className="home-feed__empty">
                <p>No posts in this topic yet.</p>
              </div>
            )}
          </section>

          <button
            type="button"
            className="home-feed__nav home-feed__nav--next"
            onClick={() => goToPost(activePostIndex + 1)}
            disabled={activePostIndex >= posts.length - 1 || posts.length === 0}
            aria-label="Next post"
          >
            <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </main>
    </div>
  );
}
