-- CareSlot password auth (run in Supabase SQL Editor once)
-- Demo logins after this: P001 / DR01 with password demo1234

create table if not exists accounts (
  user_id       text primary key,
  role          text not null check (role in ('patient', 'doctor')),
  password_hash text not null,
  created_at    timestamptz not null default now()
);

alter table accounts enable row level security;

-- scrypt hash for password: demo1234
insert into accounts (user_id, role, password_hash) values
  (
    'P001',
    'patient',
    'd9fa6c2c8a971fce38bef65f10f1644d:acc0750c5e47b74bb15e499153a58315768f113f9228fb3e6d601e50d96bf0323fa91bc6ded55c5aa11bb478d88919c1c99a90a018888f44a92ff84af968712a'
  ),
  (
    'DR01',
    'doctor',
    'd9fa6c2c8a971fce38bef65f10f1644d:acc0750c5e47b74bb15e499153a58315768f113f9228fb3e6d601e50d96bf0323fa91bc6ded55c5aa11bb478d88919c1c99a90a018888f44a92ff84af968712a'
  )
on conflict (user_id) do update
set role = excluded.role,
    password_hash = excluded.password_hash;
