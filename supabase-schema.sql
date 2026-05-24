-- ============================================================
-- Candidly — Schéma Supabase
-- Coller ce SQL dans : Supabase > SQL Editor > New query
-- ============================================================

-- 1. Table profiles (extension de auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  is_pro boolean not null default false,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamp with time zone not null default now()
);

-- Active la RLS sur profiles
alter table public.profiles enable row level security;

-- Chaque utilisateur ne voit et ne modifie que son propre profil
create policy "Profil visible par l'utilisateur" on public.profiles
  for select using (auth.uid() = id);

create policy "Profil modifiable par l'utilisateur" on public.profiles
  for update using (auth.uid() = id);

-- 2. Trigger : crée automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Table candidatures
create table if not exists public.candidatures (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  entreprise text not null,
  poste text not null,
  statut text not null check (statut in ('Envoyé','Relance','Entretien','Accepté','Refusé')) default 'Envoyé',
  date_envoi date,
  date_rappel date,
  lien_offre text,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Index pour les requêtes fréquentes
create index if not exists candidatures_user_id_idx on public.candidatures(user_id);
create index if not exists candidatures_date_rappel_idx on public.candidatures(date_rappel) where date_rappel is not null;

-- RLS sur candidatures
alter table public.candidatures enable row level security;

create policy "Candidatures accessibles par leur propriétaire"
  on public.candidatures for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Trigger updated_at automatique
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.candidatures;
create trigger set_updated_at
  before update on public.candidatures
  for each row execute procedure public.set_updated_at();
