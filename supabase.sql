-- ===== FEEDBACK SHIELD: SUPABASE SETUP =====
-- Supabase dashboard -> SQL Editor -> New query -> i-paste tanan -> Run

create table if not exists public.users (
  id bigint generated always as identity primary key,
  user_code text unique,
  user_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  user_code text not null,
  user_name text not null,
  comment text not null,
  result text not null check (result in ('good','bad')),
  detected_words text,
  created_at timestamptz not null default now()
);

-- RLS ON, ug WALAY policies = ang publiko DILI maka-basa, maka-insert, o maka-bura
-- direkta sa tables. Ikaw ra ang makakita sa Table Editor.
alter table public.users enable row level security;
alter table public.comments enable row level security;

-- Function 1: maghimo og bag-ong user (01_user, 02_user, ...)
create or replace function public.register_user(p_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
  v_code text;
  v_name text := left(btrim(coalesce(p_name, '')), 50);
begin
  if v_name = '' then
    raise exception 'name required';
  end if;
  insert into users (user_name) values (v_name) returning id into v_id;
  v_code := lpad(v_id::text, 2, '0') || '_user';
  update users set user_code = v_code where id = v_id;
  return v_code;
end;
$$;

-- Function 2: mag-save og comment para sa usa ka user
create or replace function public.save_comment(
  p_user_code text, p_comment text, p_result text, p_detected text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  select user_name into v_name from users where user_code = p_user_code;
  if v_name is null then
    raise exception 'unknown user';
  end if;
  if p_result not in ('good', 'bad') then
    raise exception 'bad result';
  end if;
  if btrim(coalesce(p_comment, '')) = '' or length(p_comment) > 280 then
    raise exception 'bad comment';
  end if;
  insert into comments (user_code, user_name, comment, result, detected_words)
  values (p_user_code, v_name, p_comment, p_result, left(coalesce(p_detected, ''), 1000));
end;
$$;

-- Ang publiko (anon) makatawag ra niini nga duha ka functions, wala nay lain.
revoke all on function public.register_user(text) from public;
revoke all on function public.save_comment(text, text, text, text) from public;
grant execute on function public.register_user(text) to anon;
grant execute on function public.save_comment(text, text, text, text) to anon;
