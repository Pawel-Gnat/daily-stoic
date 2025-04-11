-- Migration: Disable RLS policies
-- Description: Disables all Row Level Security policies for users and entries tables
-- Author: System
-- Date: 2024-03-19

-- Drop policies for users table
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;

-- Drop policies for entries table
drop policy if exists "Users can view own entries" on public.entries;
drop policy if exists "Users can create entries" on public.entries;
drop policy if exists "Users can update own entries" on public.entries;
drop policy if exists "Users can delete own entries" on public.entries;

-- Disable RLS on tables
alter table public.users disable row level security;
alter table public.entries disable row level security; 