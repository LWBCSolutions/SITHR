-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Conversations table
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Conversation',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now() not null
);

-- Indexes
create index idx_conversations_user_id on conversations(user_id);
create index idx_conversations_updated_at on conversations(updated_at desc);
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_messages_created_at on messages(created_at);

-- Enable RLS
alter table conversations enable row level security;
alter table messages enable row level security;

-- RLS Policies for conversations
create policy "Users can view own conversations"
  on conversations for select
  using (auth.uid() = user_id);

create policy "Users can create own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete own conversations"
  on conversations for delete
  using (auth.uid() = user_id);

-- RLS Policies for messages
create policy "Users can view messages in own conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can create messages in own conversations"
  on messages for insert
  with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_conversations_updated_at
  before update on conversations
  for each row
  execute function update_updated_at_column();
