-- ============================================================
-- Linky App — Supabase Schema
-- ============================================================

-- 프로필 (row 1개 고정)
create table if not exists profile (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  display_name text not null default 'My Links',
  bio text,
  avatar_emoji text not null default '✨',
  avatar_url text,
  theme text not null default 'dark',
  accent_color text not null default '#7c3aed',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 링크 목록
create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  icon text not null default '🔗',
  is_active boolean not null default true,
  order_index integer not null default 0,
  click_count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 활성화
alter table profile enable row level security;
alter table links enable row level security;

-- 공개 읽기 (공개 페이지용)
create policy "public_read_profile" on profile for select using (true);
create policy "public_read_active_links" on links for select using (is_active = true);

-- 서비스 롤 키로만 쓰기 (API route에서 service_role key 사용)
-- anon은 읽기만 허용됨

-- 기본 프로필 row 삽입
insert into profile (id, display_name, bio, avatar_emoji, theme, accent_color)
values ('00000000-0000-0000-0000-000000000001', 'My Links', '링크 모음 페이지입니다', '✨', 'dark', '#7c3aed')
on conflict (id) do nothing;

-- 샘플 링크
insert into links (title, url, description, icon, order_index) values
  ('AI 무인도 생존 테스트', 'https://mac-call-app.vercel.app/ai-quiz', '나의 AI 서바이벌 지수는?', '🏝️', 0)
on conflict do nothing;
