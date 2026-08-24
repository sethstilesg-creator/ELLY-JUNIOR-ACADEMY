-- ELLY JUNIOR ACADEMY production database starter schema
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'staff' check (role in ('super_admin','administrator','teacher','finance','librarian')),
  created_at timestamptz default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  admission_no text unique not null,
  full_name text not null,
  grade text not null check (grade in ('Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9')),
  gender text,
  guardian_name text,
  guardian_phone text,
  created_at timestamptz default now()
);

create table if not exists fee_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  receipt_no text,
  paid_on date not null default current_date,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  subject text not null,
  score numeric(5,2) check (score >= 0 and score <= 100),
  term text,
  created_at timestamptz default now()
);

create table if not exists library_books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  copies integer not null default 1,
  created_at timestamptz default now()
);

create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  patron text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table students enable row level security;
alter table fee_payments enable row level security;
alter table assessments enable row level security;
alter table library_books enable row level security;
alter table clubs enable row level security;

-- Starter authenticated policy. Replace with role-specific policies before production.
create policy "authenticated users can read students" on students
for select to authenticated using (true);

create policy "authenticated users can insert students" on students
for insert to authenticated with check (true);

create policy "authenticated users can update students" on students
for update to authenticated using (true) with check (true);

create policy "authenticated users can read fees" on fee_payments
for select to authenticated using (true);

create policy "authenticated users can insert fees" on fee_payments
for insert to authenticated with check (true);

create policy "authenticated users can read assessments" on assessments
for select to authenticated using (true);

create policy "authenticated users can insert assessments" on assessments
for insert to authenticated with check (true);
