export interface ForumPost {
  id: string;
  topicId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export const forumPosts: ForumPost[] = [
  {
    id: 'post-1',
    topicId: 'world-cup',
    userId: 'user-1',
    content:
      'That last-minute equalizer completely changed how I read the group standings. Who else thinks the table looks wide open now?',
    timestamp: '6m',
  },
  {
    id: 'post-2',
    topicId: 'world-cup',
    userId: 'user-2',
    content:
      'The midfield press in the second half was the real story. Curious what lineup everyone expects for the next match.',
    timestamp: '19m',
  },
  {
    id: 'post-3',
    topicId: 'world-cup',
    userId: 'user-3',
    content:
      'Traveling fans are making the atmosphere unreal in the host cities. Best away-day experience you have seen so far?',
    timestamp: '31m',
  },
  {
    id: 'post-4',
    topicId: 'world-cup',
    userId: 'user-4',
    content:
      'VAR calls have been inconsistent again. Should the tournament use stricter review standards from the knockout round?',
    timestamp: '48m',
  },
  {
    id: 'post-5',
    topicId: 'life-in-miami',
    userId: 'user-5',
    content:
      'Moved to South Beach last month and the morning runs along the water still feel surreal. Any quieter coffee spots nearby?',
    timestamp: '12m',
  },
  {
    id: 'post-6',
    topicId: 'life-in-miami',
    userId: 'user-6',
    content:
      'Wynwood rent jumped again, but the gallery openings and late food trucks make it hard to leave. Worth it or time to move north?',
    timestamp: '25m',
  },
  {
    id: 'post-7',
    topicId: 'life-in-miami',
    userId: 'user-7',
    content:
      'Brickell during rush hour is chaos, though the metro mover saves my commute more than I expected.',
    timestamp: '37m',
  },
  {
    id: 'post-8',
    topicId: 'life-in-miami',
    userId: 'user-8',
    content:
      'Calle Ocho on a Sunday is unmatched. Looking for family-run spots that are not on every tourist list.',
    timestamp: '52m',
  },
  {
    id: 'post-9',
    topicId: 'travel',
    userId: 'user-9',
    content:
      'Booked a long layover on purpose and it turned into the best part of the trip. What cities are perfect for a 10-hour stopover?',
    timestamp: '8m',
  },
  {
    id: 'post-10',
    topicId: 'travel',
    userId: 'user-10',
    content:
      'One-bag travel finally clicked for me after ditching half my packing list. What is the one item you refuse to leave behind?',
    timestamp: '21m',
  },
  {
    id: 'post-11',
    topicId: 'travel',
    userId: 'user-11',
    content:
      'Slow travel beat rushing five cities in a week. Spent four days in one neighborhood and actually learned the place.',
    timestamp: '34m',
  },
  {
    id: 'post-12',
    topicId: 'travel',
    userId: 'user-12',
    content:
      'I keep a running map of small museums and markets in every city I visit. Drop your most underrated stop below.',
    timestamp: '46m',
  },
  {
    id: 'post-13',
    topicId: 'fashion',
    userId: 'user-13',
    content:
      'Vintage denim jackets are having a moment again. Found a perfect washed indigo piece at a flea market this weekend.',
    timestamp: '14m',
  },
  {
    id: 'post-14',
    topicId: 'fashion',
    userId: 'user-14',
    content:
      'Street style outside the shows was better than half the runway looks. Looser silhouettes and worn-in sneakers everywhere.',
    timestamp: '27m',
  },
  {
    id: 'post-15',
    topicId: 'fashion',
    userId: 'user-15',
    content:
      'Minimal wardrobes are trending, but I still want one statement piece per season. What is your current go-to item?',
    timestamp: '39m',
  },
  {
    id: 'post-16',
    topicId: 'fashion',
    userId: 'user-16',
    content:
      'Thrift rotation challenge: styled the same black blazer four ways this week. Post your best remix ideas.',
    timestamp: '55m',
  },
];

export function getPostsForTopic(topicId: string | null): ForumPost[] {
  if (!topicId) {
    return forumPosts;
  }

  return forumPosts.filter((post) => post.topicId === topicId);
}
