import { supabase } from './supabase';

export interface ForumPostView {
  id: string;
  topicId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  timestamp: string;
  createdAtLabel: string;
}

interface DbPost {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface DbUser {
  id: string;
  username: string;
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return 'just now';
  }

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatAbsoluteTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function sortPosts(posts: ForumPostView[], newestFirst: boolean): ForumPostView[] {
  return [...posts].sort((left, right) => {
    const timeDiff =
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

    if (timeDiff !== 0) {
      return newestFirst ? -timeDiff : timeDiff;
    }

    return newestFirst
      ? right.id.localeCompare(left.id)
      : left.id.localeCompare(right.id);
  });
}

export async function fetchPosts(topicId: string | null): Promise<ForumPostView[]> {
  const newestFirst = topicId === null;

  let query = supabase
    .from('posts')
    .select('id, topic_id, user_id, content, created_at')
    .order('created_at', { ascending: !newestFirst })
    .order('id', { ascending: !newestFirst });

  if (topicId) {
    query = query.eq('topic_id', topicId);
  }

  const { data: posts, error } = await query;

  if (error) {
    throw error;
  }

  const rows = (posts ?? []) as DbPost[];

  if (rows.length === 0) {
    return [];
  }

  const userIds = Array.from(new Set(rows.map((post) => post.user_id)));

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, username')
    .in('id', userIds);

  if (usersError) {
    throw usersError;
  }

  const usernameById = new Map(
    ((users ?? []) as DbUser[]).map((user) => [user.id, user.username])
  );

  return sortPosts(
    rows.map((post) => ({
      id: post.id,
      topicId: post.topic_id,
      userId: post.user_id,
      content: post.content,
      createdAt: post.created_at,
      timestamp: formatRelativeTime(post.created_at),
      createdAtLabel: formatAbsoluteTime(post.created_at),
      username: usernameById.get(post.user_id) ?? 'unknown',
    })),
    newestFirst
  );
}

export async function createPost(
  topicId: string,
  content: string,
  userId: string
): Promise<void> {
  const trimmed = content.trim();

  if (!topicId) {
    throw new Error('Choose a topic for your post.');
  }

  if (!trimmed) {
    throw new Error('Write something before posting.');
  }

  if (trimmed.length > 300) {
    throw new Error('Posts must be 300 characters or less.');
  }

  const { error } = await supabase.from('posts').insert({
    topic_id: topicId,
    content: trimmed,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}
