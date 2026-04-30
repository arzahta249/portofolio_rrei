create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Penulisan', 'Videografi', 'Menggambar')),
  description text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.comments enable row level security;

create policy "Projects can be read by everyone"
  on public.projects for select
  using (true);

create policy "Projects can be inserted by everyone"
  on public.projects for insert
  with check (true);

create policy "Comments can be read by everyone"
  on public.comments for select
  using (true);

create policy "Comments can be inserted by everyone"
  on public.comments for insert
  with check (true);

insert into public.projects (title, category, description, image_url)
values
  (
    'Cerita Brand Kopi Lokal',
    'Penulisan',
    'Copywriting lembut untuk kampanye digital dengan gaya storytelling yang dekat dan hangat.',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80'
  ),
  (
    'Mini Vlog Kampus',
    'Videografi',
    'Konsep video pendek tentang rutinitas kreatif mahasiswi Bisnis Digital di lingkungan kampus.',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80'
  ),
  (
    'Ilustrasi Produk Manis',
    'Menggambar',
    'Eksplorasi visual produk dengan karakter lucu, palet pink, dan detail yang playful.',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80'
  )
on conflict do nothing;
