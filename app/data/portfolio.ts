export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  detail?: string;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  featured?: boolean;
  createdAt: string;
};

export type Comment = {
  id: string;
  name: string;
  message: string;
  emoji?: string;
  audio?: string;
  createdAt: string;
};

export type Moment = {
  id: string;
  title: string;
  description: string;
  activityDetails?: string;
  executionDate?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  gallery?: { url: string; description: string }[];
  featured?: boolean;
  createdAt: string;
};

export const starterMoments: Moment[] = [
  {
    id: "moment-1",
    title: "Mengikuti Seminar Bisnis Digital",
    description: "Hari ini sangat menyenangkan! Belajar banyak hal baru tentang perkembangan industri digital di Indonesia.",
    activityDetails: "Seminar ini diadakan oleh himpunan mahasiswa Bisnis Digital, mengundang praktisi dari startup terkemuka untuk membahas strategi marketing 4.0 dan analisis data.",
    executionDate: "2026-05-10",
    mediaUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80",
        description: "Materi tentang growth hacking"
      },
      {
        url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80",
        description: "Sesi tanya jawab dengan pemateri"
      }
    ],
    featured: true,
    createdAt: "2026-05-10T10:00:00.000Z",
  }
];

export const starterProjects: Project[] = [
  {
    id: "starter-writing",
    title: "Cerita Brand Kopi Lokal",
    category: "Penulisan",
    description:
      "Copywriting lembut untuk kampanye digital dengan gaya storytelling yang dekat dan hangat.",
    detail:
      "Project ini berfokus pada gaya penulisan yang manis, mudah dipahami, dan cocok untuk audiens digital. Harum mengolah pesan brand menjadi narasi pendek yang terasa dekat tanpa kehilangan tujuan promosi.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    ],
    videoUrl: "",
    featured: true,
    createdAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "starter-video",
    title: "Mini Vlog Kampus",
    category: "Videografi",
    description:
      "Konsep video pendek tentang rutinitas kreatif mahasiswi Bisnis Digital di lingkungan kampus.",
    detail:
      "Video pendek ini dirancang untuk menampilkan keseharian kreatif di kampus: mulai dari ide, pengambilan gambar, pemilihan musik, sampai ritme editing yang cocok untuk media sosial.",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80",
    ],
    videoUrl: "",
    featured: true,
    createdAt: "2026-04-04T10:00:00.000Z",
  },
  {
    id: "starter-drawing",
    title: "Ilustrasi Produk Manis",
    category: "Menggambar",
    description:
      "Eksplorasi visual produk dengan karakter lucu, palet pink, dan detail yang playful.",
    detail:
      "Ilustrasi ini mengeksplorasi karakter visual yang lembut dan playful. Cocok untuk konten promosi ringan, poster digital, dan visual pendukung presentasi.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    ],
    videoUrl: "",
    featured: true,
    createdAt: "2026-04-07T10:00:00.000Z",
  },
  {
    id: "starter-campaign",
    title: "Campaign Moodboard Pink",
    category: "Penulisan",
    description:
      "Moodboard campaign untuk konten sosial media dengan tone ceria, lembut, dan mudah diingat.",
    detail:
      "Project ini menyatukan pesan kampanye, referensi warna, copy pendek, serta gaya visual agar brand punya arah konten yang konsisten. Fokusnya adalah membuat konsep terasa ringan tapi tetap punya identitas.",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=900&q=80",
    ],
    videoUrl: "",
    featured: true,
    createdAt: "2026-04-10T10:00:00.000Z",
  },
];

export const starterComments: Comment[] = [
  {
    id: "comment-1",
    name: "Naya",
    message: "Portofolionya gemas banget, cocok untuk personal branding!",
    emoji: "love",
    audio: "",
    createdAt: "2026-04-15T08:30:00.000Z",
  },
  {
    id: "comment-2",
    name: "Raka",
    message: "Bagian project-nya enak dilihat dan gampang dipahami.",
    emoji: "spark",
    audio: "",
    createdAt: "2026-04-18T13:20:00.000Z",
  },
];

export const positiveEmojis = [
  { id: "love", label: "Love", symbol: "♡" },
  { id: "spark", label: "Keren", symbol: "✦" },
  { id: "star", label: "Favorit", symbol: "★" },
  { id: "flower", label: "Manis", symbol: "✿" },
];

export const skills = ["Penulisan", "Videografi", "Menggambar"];

export const journey = [
  {
    year: "2024",
    title: "Mulai Eksplor Bisnis Digital",
    description:
      "Belajar memahami perilaku audiens, konten, dan cara brand tampil di platform digital.",
  },
  {
    year: "2025",
    title: "Aktif Membuat Konten",
    description:
      "Mencoba format tulisan, video pendek, dan visual lucu untuk membangun gaya personal.",
  },
  {
    year: "2026",
    title: "Portfolio Dinamis",
    description:
      "Mengumpulkan karya dalam website yang bisa terus diupdate lewat fitur upload project.",
  },
];

export const toolkit = [
  "CapCut",
  "Canva",
  "Adobe Express",
  "Adobe Premiere",
  "Medium",
  "Google Docs",
  "Notion",
  "Sketchbook",
];

export const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/rrei.444?igsh=OWtndzhwaGtxZHdt",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5Zm5.2-2.35a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05Z",
  },
  {
    name: "TikTok",
    href: "https://sdgysauwy",
    path: "M16.6 5.82a6.1 6.1 0 0 0 3.57 1.14v3.03a8.95 8.95 0 0 1-3.55-.77v5.63a5.73 5.73 0 1 1-5.73-5.73c.34 0 .67.03 1 .09v3.15a2.6 2.6 0 1 0 1.7 2.44V2h3.01v3.82Z",
  },
  {
    name: "Medium",
    href: "https://medium.com/@InkBy.arumi",
    path: "M4.37 7.04a.64.64 0 0 0-.21-.54L2.6 4.62v-.28h4.85l3.75 8.22 3.3-8.22h4.62v.28l-1.34 1.29a.39.39 0 0 0-.15.37v9.47a.39.39 0 0 0 .15.37l1.31 1.29v.28h-6.6v-.28l1.36-1.32c.13-.13.13-.17.13-.37V8.07l-3.78 9.59h-.5L5.3 8.07v6.42a.88.88 0 0 0 .24.73l1.77 2.15v.28H2.3v-.28l1.77-2.15a.85.85 0 0 0 .23-.73V7.04h.07Z",
  },
];
