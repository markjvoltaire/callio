export interface ForumUser {
  id: string;
  username: string;
}

export const forumUsers: ForumUser[] = [
  { id: 'user-1', username: 'goal_line' },
  { id: 'user-2', username: 'pitch_report' },
  { id: 'user-3', username: 'ultra_north' },
  { id: 'user-4', username: 'cap_tactics' },
  { id: 'user-5', username: 'south_beach_run' },
  { id: 'user-6', username: 'wynwood_local' },
  { id: 'user-7', username: 'brickell_days' },
  { id: 'user-8', username: 'calle_ocho' },
  { id: 'user-9', username: 'window_seat' },
  { id: 'user-10', username: 'carry_on_only' },
  { id: 'user-11', username: 'slow_arrival' },
  { id: 'user-12', username: 'map_notes' },
  { id: 'user-13', username: 'archive_fit' },
  { id: 'user-14', username: 'street_look' },
  { id: 'user-15', username: 'runway_reply' },
  { id: 'user-16', username: 'thrift_rotation' },
];

export function getUserById(userId: string): ForumUser | undefined {
  return forumUsers.find((user) => user.id === userId);
}

export function getUserByUsername(username: string): ForumUser | undefined {
  return forumUsers.find((user) => user.username === username);
}
