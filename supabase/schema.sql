-- NucleusAI Supabase Schema

-- Conversations table
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'New conversation',
  mode text not null default 'chatty',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  clean_content text,
  tags jsonb default '[]',
  mode text not null default 'chatty',
  created_at timestamptz not null default now()
);

-- User corrections (LEARN tags — persist indefinitely)
create table if not exists user_corrections (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete set null,
  original text not null,
  correction text not null,
  propagated boolean default false,
  created_at timestamptz not null default now()
);

-- Session memory (unresolved threads, resource inventory)
create table if not exists session_memory (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists messages_conversation_id_idx on messages(conversation_id);
create index if not exists messages_created_at_idx on messages(created_at);
create index if not exists conversations_updated_at_idx on conversations(updated_at desc);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger conversations_updated_at
  before update on conversations
  for each row execute function update_updated_at();
