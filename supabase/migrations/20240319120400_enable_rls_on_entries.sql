-- Migration: Enable RLS on entries table
-- Description: Enable row level security and add granular CRUD policies for authenticated and anon roles on public.entries
-- Author: System
-- Date: 2024-03-19

-- enable row level security so that no default access is granted
alter table public.entries enable row level security;

-- ========================================================
-- SELECT POLICIES
-- ========================================================

-- allow authenticated users to view only their own entries
create policy "authenticated select own entries"
  on public.entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- explicitly deny anonymous users from viewing any entries
create policy "anon select entries"
  on public.entries
  for select
  to anon
  using (false);

-- ========================================================
-- INSERT POLICIES
-- ========================================================

-- allow authenticated users to insert entries attached to their own user_id
create policy "authenticated insert own entries"
  on public.entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- explicitly deny anonymous users from inserting entries
create policy "anon insert entries"
  on public.entries
  for insert
  to anon
  with check (false);

-- ========================================================
-- UPDATE POLICIES
-- ========================================================

-- allow authenticated users to update only their own entries
create policy "authenticated update own entries"
  on public.entries
  for update
  to authenticated
  using (auth.uid() = user_id);

-- explicitly deny anonymous users from updating any entries
create policy "anon update entries"
  on public.entries
  for update
  to anon
  using (false);

-- ========================================================
-- DELETE POLICIES
-- ========================================================

-- allow authenticated users to delete only their own entries
create policy "authenticated delete own entries"
  on public.entries
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- explicitly deny anonymous users from deleting any entries
create policy "anon delete entries"
  on public.entries
  for delete
  to anon
  using (false);
