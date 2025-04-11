-- Migration: Create entries table
-- Description: Creates the entries table for storing daily stoic journal entries
-- Author: System
-- Date: 2024-03-19

-- Create entries table
create table public.entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    what_matters_most varchar(500) not null,
    fears_of_loss varchar(500) not null,
    personal_goals varchar(500) not null,
    generated_sentence text not null,
    generate_duration interval not null,
    created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.entries enable row level security;

-- Create policies for authenticated users
-- Allow users to read their own entries
create policy "Users can view own entries"
    on public.entries
    for select
    using (auth.uid() = user_id);

-- Allow users to insert their own entries
create policy "Users can create entries"
    on public.entries
    for insert
    with check (auth.uid() = user_id);

-- Allow users to update their own entries
create policy "Users can update own entries"
    on public.entries
    for update
    using (auth.uid() = user_id);

-- Allow users to delete their own entries
create policy "Users can delete own entries"
    on public.entries
    for delete
    using (auth.uid() = user_id);

-- Create indexes
create index idx_entries_userid_createdat on public.entries(user_id, created_at);

-- Add helpful comments
comment on table public.entries is 'Table storing daily stoic journal entries';
comment on column public.entries.id is 'Unique identifier for the entry';
comment on column public.entries.user_id is 'Reference to the user who created the entry';
comment on column public.entries.what_matters_most is 'User response to what matters most question';
comment on column public.entries.fears_of_loss is 'User response to fears of loss question';
comment on column public.entries.personal_goals is 'User response to personal goals question';
comment on column public.entries.generated_sentence is 'AI-generated stoic sentence';
comment on column public.entries.generate_duration is 'Time taken to generate the AI response';
comment on column public.entries.created_at is 'Timestamp when the entry was created'; 