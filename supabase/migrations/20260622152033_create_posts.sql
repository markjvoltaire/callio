create table public.posts (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index posts_topic_id_created_at_idx
  on public.posts (topic_id, created_at desc);

create index posts_created_at_idx
  on public.posts (created_at desc);

alter table public.posts enable row level security;

create policy "posts are readable by authenticated users"
  on public.posts
  for select
  to authenticated
  using (true);

create policy "users can insert their own posts"
  on public.posts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own posts"
  on public.posts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can delete their own posts"
  on public.posts
  for delete
  to authenticated
  using (auth.uid() = user_id);
