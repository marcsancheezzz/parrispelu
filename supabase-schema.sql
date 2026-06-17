-- Executa això a Supabase: Project > SQL Editor > New query > enganxa tot > Run

create table if not exists bookings (
  id text primary key,
  date text not null,
  time text not null,
  name text not null,
  phone text not null,
  service_id text not null,
  service_name text not null,
  pay_method text not null,
  paid boolean not null default false,
  price numeric not null,
  status text not null default 'confirmed',
  created_at bigint not null,
  created_label text,
  paid_at bigint,
  paid_label text
);

create table if not exists hours (
  dow int primary key,
  open boolean not null default false,
  morning_start text,
  morning_end text,
  afternoon_start text,
  afternoon_end text
);

create table if not exists services (
  id text primary key,
  name text not null,
  price numeric not null,
  position int not null default 0
);

-- Dades inicials d'horari (0=diumenge ... 6=dissabte). Dilluns (1) tancat.
insert into hours (dow, open, morning_start, morning_end, afternoon_start, afternoon_end) values
  (0, false, null, null, null, null),
  (1, false, '09:00', '13:00', '16:00', '19:00'),
  (2, true,  '09:00', '13:00', '16:00', '19:00'),
  (3, true,  '09:00', '13:00', '16:00', '19:00'),
  (4, true,  '09:00', '13:00', '16:00', '19:00'),
  (5, true,  '09:00', '13:00', '16:00', '19:00'),
  (6, true,  '09:00', '13:00', null, null)
on conflict (dow) do nothing;

-- Serveis inicials
insert into services (id, name, price, position) values
  ('s1', 'Tallat', 15, 0),
  ('s2', 'Tallat i barba', 15, 1),
  ('s3', 'Tenyit', 50, 2)
on conflict (id) do nothing;

-- Permet accés des de les Netlify Functions (servei amb la service_role key, no cal RLS especial,
-- però si actives Row Level Security, assegura't que la service key la pot saltar, que ho fa per defecte).
