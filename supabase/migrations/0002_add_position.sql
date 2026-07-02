-- 0002_add_position.sql
-- Add position column to meal_plan for ordering meals within a day

alter table meal_plan
  add column if not exists position int not null default 0;

-- Backfill positions: for each date + meal_type, assign increasing positions by created order
do $$
declare
  r record;
  i int;
begin
  for r in select distinct date, meal_type from meal_plan loop
    i := 1;
    -- created_at may not exist in the schema; fall back to ordering by id for deterministic results
    for r in select id from meal_plan where date = r.date and meal_type = r.meal_type order by id loop
      update meal_plan set position = i where id = r.id;
      i := i + 1;
    end loop;
  end loop;
end $$;

