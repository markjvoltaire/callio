create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text not null,
  created_at timestamptz not null default now(),
  constraint users_username_length check (char_length(username) between 3 and 30),
  constraint users_username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

create unique index users_username_key on public.users (lower(username));
create unique index users_email_key on public.users (lower(email));
create index users_created_at_idx on public.users (created_at desc);

alter table public.users enable row level security;

create policy "users are readable by authenticated users"
  on public.users
  for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  next_username text;
  suffix integer := 0;
begin
  base_username := lower(
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    )
  );

  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '_', 'g');

  if char_length(base_username) < 3 then
    base_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  next_username := base_username;

  while exists (
    select 1
    from public.users
    where lower(username) = lower(next_username)
  ) loop
    suffix := suffix + 1;
    next_username := base_username || '_' || suffix::text;
  end loop;

  insert into public.users (id, username, email)
  values (new.id, next_username, new.email);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
