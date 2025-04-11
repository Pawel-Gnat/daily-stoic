-- Migration: Create users table
-- Description: Creates the initial users table with authentication and profile data
-- Author: System
-- Date: 2024-03-19

-- Create users table
create table public.users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    name varchar(255) not null,
    password varchar(255) not null,
    created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies for authenticated users
-- Allow users to read their own profile
create policy "Users can view own profile"
    on public.users
    for select
    using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile"
    on public.users
    for update
    using (auth.uid() = id);

-- Create indexes
create index idx_users_email on public.users(email);

-- Add helpful comments
comment on table public.users is 'Table storing user profile information';
comment on column public.users.id is 'Unique identifier for the user';
comment on column public.users.email is 'User email address - must be unique';
comment on column public.users.name is 'User display name';
comment on column public.users.password is 'Hashed user password';
comment on column public.users.created_at is 'Timestamp when the user profile was created'; 