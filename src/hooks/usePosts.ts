import { useCallback, useEffect, useState } from 'react';
import { fetchPosts, ForumPostView } from '../lib/posts';

interface UsePostsResult {
  posts: ForumPostView[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePosts(topicId: string | null): UsePostsResult {
  const [posts, setPosts] = useState<ForumPostView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);

    fetchPosts(topicId)
      .then((nextPosts) => {
        if (isMounted) {
          setPosts(nextPosts);
        }
      })
      .catch((fetchError: Error) => {
        if (isMounted) {
          setPosts([]);
          setError(fetchError.message || 'Failed to load posts.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [topicId, reloadKey]);

  return { posts, isLoading, error, refetch };
}
