-- 0001_init.sql
-- Initial schema for Седмично Меню

create extension if not exists "pgcrypto";

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  prep_time_minutes int,
  instructions text,
  default_servings int not null default 4,
  kcal_per_serving numeric,
  protein_per_serving numeric,
  carbs_per_serving numeric,
  fat_per_serving numeric,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  name text not null,
  quantity numeric not null,
  unit text not null,
  category text not null
);

create table if not exists meal_plan (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  meal_type text not null,
  recipe_id uuid not null references recipes(id) on delete cascade,
  servings numeric not null default 1,
  unique (date, meal_type, recipe_id)
);

create index if not exists meal_plan_date_idx on meal_plan(date);
create index if not exists ingredients_recipe_id_idx on ingredients(recipe_id);

-- Single-user app: enable public access via anon key.
alter table recipes enable row level security;
alter table ingredients enable row level security;
alter table meal_plan enable row level security;

do $$ begin
  create policy "public read recipes" on recipes for select using (true);
  create policy "public write recipes" on recipes for all using (true) with check (true);
  create policy "public read ingredients" on ingredients for select using (true);
  create policy "public write ingredients" on ingredients for all using (true) with check (true);
  create policy "public read meal_plan" on meal_plan for select using (true);
  create policy "public write meal_plan" on meal_plan for all using (true) with check (true);
exception when duplicate_object then null;
end $$;
