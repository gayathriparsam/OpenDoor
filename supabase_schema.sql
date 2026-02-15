
-- Create Leads Table
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text,
  stage text default 'New'::text,
  score integer default 0,
  last_contacted timestamp with time zone default timezone('utc'::text, now()),
  intent text,
  location text,
  budget_min bigint,
  budget_max bigint,
  timeline text,
  checklist jsonb default '{}'::jsonb,
  appointment jsonb default '{}'::jsonb,
  next_action text,
  insights jsonb default '{}'::jsonb,
  reasoning text
);

-- Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- Create policy to allow all actions for anon users (for demo purposes)
-- In production, you'd restrict this to authenticated users only
create policy "Enable all access for all users" on public.leads
  for all using (true) with check (true);

-- Insert Mock Data (Optional)
insert into public.leads (name, email, phone, stage, score, intent, location, budget_min, budget_max, timeline)
values 
  ('Sarah Jenkins', 'sarah.j@example.com', '+1 (555) 012-3456', 'New', 15, 'Buyer', 'Downtown', 450000, 600000, '3 months'),
  ('Michael Chen', 'm.chen@example.com', '+1 (555) 987-6543', 'Qualified', 95, 'Buyer', 'Westlake', 700000, 800000, 'Urgent (45 days)');
