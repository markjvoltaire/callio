import React, { FormEvent, useEffect, useState } from 'react';
import { PaperPlaneTilt, X } from '@phosphor-icons/react';
import { forumTopics } from '../../data/topics';
import { createPost } from '../../lib/posts';
import './ComposePost.css';

interface ComposePostProps {
  userId: string;
  activeTopicId: string | null;
  onPosted: () => void;
  onClose: () => void;
}

export default function ComposePost({
  userId,
  activeTopicId,
  onPosted,
  onClose,
}: ComposePostProps) {
  const [topicId, setTopicId] = useState(activeTopicId ?? forumTopics[0]?.id ?? '');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeTopicId) {
      setTopicId(activeTopicId);
    }
  }, [activeTopicId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createPost(topicId, content, userId);
      onPosted();
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Failed to create post.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="compose-post" aria-label="Create post">
      <div className="compose-post__header">
        <h2 className="compose-post__title">New post</h2>
        <button
          type="button"
          className="compose-post__close"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>
      </div>

      <form className="compose-post__form" onSubmit={handleSubmit}>
        {error ? (
          <p className="compose-post__error" role="alert">
            {error}
          </p>
        ) : null}

        <label className="compose-post__field">
          <span className="compose-post__label">Topic</span>
          <select
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
            disabled={isSubmitting}
          >
            {forumTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </label>

        <label className="compose-post__field">
          <span className="compose-post__label">What&apos;s on your mind?</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            maxLength={300}
            disabled={isSubmitting}
            autoFocus
          />
        </label>

        <div className="compose-post__footer">
          <span className="compose-post__count">{content.length}/300</span>
          <button
            type="submit"
            className="compose-post__submit"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              'Posting...'
            ) : (
              <>
                <PaperPlaneTilt size={18} weight="bold" />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
