-- Migration: Modify entries reference and drop users table
-- Description: Updates entries table to use auth.users reference, then drops the custom users table
-- Author: System
-- Date: 2024-03-19

-- First, we need to drop the existing foreign key constraint
alter table public.entries
drop constraint entries_user_id_fkey;

-- Add foreign key constraint to auth.users
alter table public.entries
add constraint entries_user_id_fkey
foreign key (user_id)
references auth.users(id) on delete cascade;

-- Drop the users table as it's no longer needed (Supabase handles auth)
drop table if exists public.users cascade;

-- Add helpful comments
comment on constraint entries_user_id_fkey on public.entries is 'References the auth.users table managed by Supabase';

-- Note: We don't need the check constraint anymore since we have a proper foreign key
-- The RLS policies we created earlier will still ensure proper access control 