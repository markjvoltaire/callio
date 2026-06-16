export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  threadCount: number;
  postCount: number;
  lastActive: string;
}

export const forumTopics: ForumTopic[] = [
  {
    id: 'world-cup',
    title: 'World Cup',
    description:
      'Matches, upsets, squad talk, and everything happening on and off the pitch.',
    threadCount: 4,
    postCount: 4,
    lastActive: '6 minutes ago',
  },
  {
    id: 'life-in-miami',
    title: 'Life in Miami',
    description:
      'Neighborhoods, food spots, rent, nightlife, and what daily life feels like in the city.',
    threadCount: 4,
    postCount: 4,
    lastActive: '18 minutes ago',
  },
  {
    id: 'travel',
    title: 'Travel',
    description:
      'Routes, packing, airports, hidden cities, and trips worth planning around.',
    threadCount: 4,
    postCount: 4,
    lastActive: '11 minutes ago',
  },
  {
    id: 'fashion',
    title: 'Fashion',
    description:
      'Outfits, drops, thrift finds, runway moments, and what people are actually wearing.',
    threadCount: 4,
    postCount: 4,
    lastActive: '24 minutes ago',
  },
];

export function getTopicById(topicId: string): ForumTopic | undefined {
  return forumTopics.find((topic) => topic.id === topicId);
}
