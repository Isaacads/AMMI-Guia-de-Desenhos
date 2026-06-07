create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  first_access_notice_seen boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, plan, first_access_notice_seen)
  values (new.id, new.email, null, 'free', false)
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  age int not null check (age between 0 and 12),
  neurodivergence text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create index if not exists children_user_id_idx on public.children (user_id);

alter table public.children enable row level security;

drop policy if exists "children_select_own" on public.children;
create policy "children_select_own"
on public.children
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own"
on public.children
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own"
on public.children
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own"
on public.children
for delete
to authenticated
using (auth.uid() = user_id);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  is_premium boolean not null default false,
  published_at timestamptz not null default now()
);

alter table public.articles enable row level security;

drop policy if exists "articles_select_freemium" on public.articles;
create policy "articles_select_freemium"
on public.articles
for select
to anon, authenticated
using (
  is_premium = false
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.plan = 'premium'
  )
);

create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year int,
  min_age int not null check (min_age >= 0),
  max_age int not null check (max_age >= min_age),
  episode_minutes int,
  genres text[] not null default '{}'::text[],
  platforms text[] not null default '{}'::text[],
  rating int not null default 0 check (rating between 0 and 10),
  narrative_pace text not null check (narrative_pace in ('lento', 'normal', 'acelerado')),
  violence text not null check (violence in ('nao', 'implicito', 'sim')),
  language text not null check (language in ('apropriada', 'questionavel', 'inapropriada')),
  educational_potential text not null check (educational_potential in ('baixo', 'medio', 'alto')),
  addiction_risk text not null check (addiction_risk in ('baixo', 'medio', 'alto')),
  sleep_impact text not null check (sleep_impact in ('baixo', 'medio', 'alto')),
  attention_effect text not null check (attention_effect in ('positivo', 'neutro', 'negativo')),
  analysis text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists shows_min_max_age_idx on public.shows (min_age, max_age);

alter table public.shows enable row level security;

drop policy if exists "shows_select_premium_only" on public.shows;
create policy "shows_select_premium_only"
on public.shows
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.plan = 'premium'
  )
);

create table if not exists public.recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists recommendation_runs_user_id_created_at_idx
on public.recommendation_runs (user_id, created_at desc);

alter table public.recommendation_runs enable row level security;

drop policy if exists "recommendation_runs_select_own" on public.recommendation_runs;
create policy "recommendation_runs_select_own"
on public.recommendation_runs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "recommendation_runs_insert_own" on public.recommendation_runs;
create policy "recommendation_runs_insert_own"
on public.recommendation_runs
for insert
to authenticated
with check (auth.uid() = user_id);

insert into public.profiles (id, email, full_name, plan)
select u.id, u.email, null, 'free'
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do nothing;
