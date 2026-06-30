create table if not exists public.catalog_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.catalog_items enable row level security;

drop policy if exists "Users can read their own catalog items" on public.catalog_items;
drop policy if exists "Users can insert their own catalog items" on public.catalog_items;
drop policy if exists "Users can update their own catalog items" on public.catalog_items;
drop policy if exists "Users can delete their own catalog items" on public.catalog_items;

create policy "Users can read their own catalog items"
on public.catalog_items
for select
using (auth.uid() = user_id);

create policy "Users can insert their own catalog items"
on public.catalog_items
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own catalog items"
on public.catalog_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own catalog items"
on public.catalog_items
for delete
using (auth.uid() = user_id);
