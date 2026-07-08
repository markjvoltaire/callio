import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Airplane,
  ClockCounterClockwise,
  CoatHanger,
  SignOut,
  SoccerBall,
  Sun,
  User,
} from "@phosphor-icons/react";
import { usePosts } from "../../hooks/usePosts";
import { forumTopics } from "../../data/topics";
import { isRelativeTimestamp } from "../../lib/posts";
import ComposePost from "./ComposePost";
import HeaderClouds from "./HeaderClouds";
import "./ForumHome.css";
import "./ComposePost.css";

interface ForumHomeProps {
  userId: string;
  username?: string;
  onSignOut?: () => void;
}

const topicIcons: Record<string, React.ReactNode> = {
  "world-cup": <SoccerBall size={24} weight="regular" />,
  "life-in-miami": <Sun size={24} weight="regular" />,
  travel: <Airplane size={24} weight="regular" />,
  fashion: <CoatHanger size={24} weight="regular" />,
};

function getTopicLabel(topicId: string): string {
  return forumTopics.find((topic) => topic.id === topicId)?.title ?? "Topic";
}

function getInitials(username: string): string {
  return username
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function getPostSizeTier(content: string): "short" | "medium" | "long" {
  const length = content.trim().length;
  if (length <= 80) {
    return "short";
  }
  if (length <= 180) {
    return "medium";
  }
  return "long";
}

function scrollFeedTo(
  container: HTMLDivElement | null,
  index: number,
  smooth = false,
) {
  if (!container) {
    return;
  }

  const left = index * container.clientWidth;

  if (typeof container.scrollTo === "function") {
    container.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    return;
  }

  container.scrollLeft = left;
}

export default function ForumHome({
  userId,
  username,
  onSignOut,
}: ForumHomeProps) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const { posts, isLoading, error, refetch } = usePosts(activeTopicId);

  const feedTitle = activeTopicId ? getTopicLabel(activeTopicId) : "Callio";

  useEffect(() => {
    const initialIndex =
      activeTopicId === null ? 0 : Math.max(0, posts.length - 1);
    setActivePostIndex(initialIndex);
    scrollFeedTo(feedRef.current, initialIndex);
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
        <div className="home-sidebar__clouds" aria-hidden="true">
          <img
            className="home-sidebar__clouds-photo"
            src={`${process.env.PUBLIC_URL}/header-clouds.png`}
            alt=""
          />
        </div>
        <nav className="home-sidebar__nav">
          <button
            type="button"
            className={`home-sidebar__item ${
              activeTopicId === null ? "home-sidebar__item--active" : ""
            }`}
            onClick={() => setActiveTopicId(null)}
          >
            <ClockCounterClockwise size={24} weight="regular" />
            <span>Most recent</span>
          </button>

          <div className="home-sidebar__divider" aria-hidden="true" />

          {forumTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`home-sidebar__item ${
                activeTopicId === topic.id ? "home-sidebar__item--active" : ""
              }`}
              onClick={() => setActiveTopicId(topic.id)}
            >
              {topicIcons[topic.id]}
              <span>{topic.title}</span>
            </button>
          ))}

          <button
            type="button"
            className="home-sidebar__item home-sidebar__item--muted"
          >
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
          <HeaderClouds />
          <div className="home-feed__title">
            <h1>{feedTitle}</h1>
          </div>
          <div className="home-feed__header-actions">
            {posts.length > 0 ? (
              <p className="home-feed__count">
                {activePostIndex + 1} of {posts.length}
              </p>
            ) : null}
            <button
              type="button"
              className="home-feed__post-button"
              onClick={() => setIsComposing((current) => !current)}
            >
              Post
            </button>
          </div>
        </header>

        {isComposing ? (
          <ComposePost
            userId={userId}
            activeTopicId={activeTopicId}
            onPosted={refetch}
            onClose={() => setIsComposing(false)}
          />
        ) : null}

        <div className="home-feed__stage">
          <button
            type="button"
            className="home-feed__nav home-feed__nav--prev"
            onClick={() => goToPost(activePostIndex - 1)}
            disabled={activePostIndex === 0 || posts.length === 0 || isLoading}
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
            {isLoading ? (
              <div className="home-feed__empty">
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className="home-feed__empty">
                <p>{error}</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                const sizeTier = getPostSizeTier(post.content);

                return (
                  <article key={post.id} className="home-post">
                    <div
                      className={`home-post__card home-post__card--${sizeTier}`}
                    >
                      <div className="home-post__top">
                        <div className="home-post__avatar" aria-hidden="true">
                          {getInitials(post.username)}
                        </div>
                        <div className="home-post__meta">
                          <span className="home-post__username">
                            @{post.username}
                          </span>
                          <span className="home-post__dot">·</span>
                          {isRelativeTimestamp(post.timestamp) ? (
                            <>
                              <time
                                className="home-post__time"
                                dateTime={post.createdAt}
                              >
                                {post.timestamp}
                              </time>
                              <span className="home-post__dot">·</span>
                            </>
                          ) : null}
                          <time
                            className="home-post__timestamp"
                            dateTime={post.createdAt}
                          >
                            {post.createdAtLabel}
                          </time>
                        </div>
                        <span className="home-post__topic">
                          {getTopicLabel(post.topicId)}
                        </span>
                      </div>

                      <div className="home-post__body">
                        <p
                          className={`home-post__content home-post__content--${sizeTier}`}
                        >
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="home-feed__empty">
                <p>
                  {activeTopicId
                    ? "No posts in this topic yet."
                    : "No posts yet. Be the first to share something."}
                </p>
              </div>
            )}
          </section>

          <button
            type="button"
            className="home-feed__nav home-feed__nav--next"
            onClick={() => goToPost(activePostIndex + 1)}
            disabled={
              activePostIndex >= posts.length - 1 ||
              posts.length === 0 ||
              isLoading
            }
            aria-label="Next post"
          >
            <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </main>
    </div>
  );
}
