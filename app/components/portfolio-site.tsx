"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  Comment,
  Project,
  journey,
  skills,
  socials,
  starterComments,
  starterProjects,
  toolkit,
} from "../data/portfolio";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function Icon({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="currentColor" d={path} />
    </svg>
  );
}

export function PortfolioSite() {
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [comments, setComments] = useState<Comment[]>(starterComments);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [preview, setPreview] = useState("");
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Penulisan",
    description: "",
    image: "",
  });
  const [commentForm, setCommentForm] = useState({ name: "", message: "" });

  useEffect(() => {
    queueMicrotask(() => {
      setProjects(readStorage("harum-projects", starterProjects));
      setComments(readStorage("harum-comments", starterComments));
      setIsStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    window.localStorage.setItem("harum-projects", JSON.stringify(projects));
  }, [isStorageReady, projects]);

  useEffect(() => {
    if (!isStorageReady) return;
    window.localStorage.setItem("harum-comments", JSON.stringify(comments));
  }, [comments, isStorageReady]);

  const projectStats = useMemo(
    () => [
      { label: "Project", value: projects.length.toString().padStart(2, "0") },
      { label: "Skill Utama", value: "03" },
      { label: "Komentar", value: comments.length.toString().padStart(2, "0") },
      { label: "Tools Kreatif", value: "06", dark: true },
    ],
    [comments.length, projects.length],
  );

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setPreview(image);
      setProjectForm((current) => ({ ...current, image }));
    };
    reader.readAsDataURL(file);
  }

  function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) return;

    const project: Project = {
      id: crypto.randomUUID(),
      title: projectForm.title.trim(),
      category: projectForm.category,
      description: projectForm.description.trim(),
      image:
        projectForm.image ||
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      createdAt: new Date().toISOString(),
    };

    setProjects((current) => [project, ...current]);
    setProjectForm({ title: "", category: "Penulisan", description: "", image: "" });
    setPreview("");
  }

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commentForm.name.trim() || !commentForm.message.trim()) return;

    setComments((current) => [
      {
        id: crypto.randomUUID(),
        name: commentForm.name.trim(),
        message: commentForm.message.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setCommentForm({ name: "", message: "" });
  }

  function deleteComment(commentId: string) {
    setComments((current) => current.filter((comment) => comment.id !== commentId));
  }

  function deleteProject(projectId: string) {
    setProjects((current) => current.filter((project) => project.id !== projectId));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7fb] text-[#34212b]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="text-base font-black tracking-[0.18em] text-[#d62a7c]">
            HRR
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#6f5361] md:flex">
            <a href="#about" className="transition hover:text-[#d62a7c]">
              About
            </a>
            <a href="#journey" className="transition hover:text-[#d62a7c]">
              Timeline
            </a>
            <a href="#projects" className="transition hover:text-[#d62a7c]">
              Project
            </a>
            <a href="#comments" className="transition hover:text-[#d62a7c]">
              Komentar
            </a>
            <a href="#contact" className="transition hover:text-[#d62a7c]">
              Contact
            </a>
          </div>
          <a
            href="#upload"
            className="rounded-full bg-[#ff5aa9] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-[#e83f92]"
          >
            Upload
          </a>
        </div>
      </nav>

      <section id="home" className="relative px-5 pb-14 pt-28 sm:px-8 lg:min-h-screen lg:pt-32">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-[#ffd2e8] blur-3xl" />
        <div className="absolute bottom-16 right-0 h-80 w-80 rounded-full bg-[#bde9ff] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#ffc3de] bg-white/80 px-4 py-2 text-sm font-bold text-[#c52b75] shadow-sm">
              Mahasiswi Bisnis Digital Universitas Pancasakti
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-[#2b1722] sm:text-6xl lg:text-7xl">
              Harum Refa Rakhmawati
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6f5361]">
              Portfolio digital bernuansa pink untuk menampilkan karya penulisan,
              videografi, dan menggambar dengan tampilan modern, lucu, dan mudah
              diperbarui.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="rounded-full bg-[#2b1722] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5"
              >
                Lihat Project
              </a>
              <a
                href="#contact"
                className="rounded-full border border-[#f3abc9] bg-white px-6 py-3 text-sm font-bold text-[#c52b75] transition hover:-translate-y-0.5 hover:border-[#ff5aa9]"
              >
                Hubungi Harum
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#ffd3e7] bg-white text-[#d62a7c] shadow-sm transition hover:-translate-y-1 hover:bg-[#fff0f7]"
                >
                  <Icon path={social.path} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-5 top-10 z-10 rounded-3xl bg-white px-5 py-4 shadow-xl shadow-pink-100">
              <p className="text-xs font-bold uppercase text-[#a96a86]">Creative mood</p>
              <p className="text-2xl font-black text-[#d62a7c]">Pink, soft, bold</p>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-[#ffe1ef] shadow-2xl shadow-pink-200">
              <img
                src="/Screenshot%202026-04-12%20151850.png"
                alt="Foto Harum Refa Rakhmawati"
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-3xl bg-white/88 p-5 backdrop-blur">
                <p className="text-sm font-bold text-[#d62a7c]">Digital Business Student</p>
                <p className="mt-1 text-xl font-black text-[#2b1722]">
                  Writing, video, and cute visuals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projectStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-3xl border border-[#ffd3e7] p-6 shadow-sm ${
                stat.dark ? "bg-[#2b1722]" : "bg-white"
              }`}
            >
              <p className={`text-4xl font-black ${stat.dark ? "text-[#ff9ccb]" : "text-[#d62a7c]"}`}>
                {stat.value}
              </p>
              <p className={`mt-1 text-sm font-bold uppercase ${stat.dark ? "text-white/80" : "text-[#8b6577]"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">About</p>
            <h2 className="mt-3 text-4xl font-black text-[#2b1722]">Tentang Harum</h2>
          </div>
          <div className="rounded-[2rem] border border-[#ffd3e7] bg-white p-7 shadow-sm">
            <p className="text-lg leading-8 text-[#604653]">
              Harum Refa Rakhmawati adalah mahasiswi Universitas Pancasakti,
              Program Studi Bisnis Digital. Ia menyukai proses merangkai ide
              menjadi tulisan, menangkap momen lewat videografi, dan menuangkan
              imajinasi melalui gambar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#c52b75]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
              Timeline
            </p>
            <h2 className="mt-3 text-4xl font-black text-[#2b1722]">Perjalanan Kreatif</h2>
            <div className="mt-7 rounded-3xl border border-[#ffd3e7] bg-white p-6">
              <p className="text-sm font-black uppercase text-[#9a7586]">Toolkit Favorit</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {toolkit.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#c52b75]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {journey.map((item) => (
              <article key={item.year} className="rounded-3xl border border-[#ffd3e7] bg-white p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="w-fit rounded-full bg-[#ff5aa9] px-4 py-2 text-sm font-black text-white">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-[#2b1722]">{item.title}</h3>
                    <p className="mt-2 leading-7 text-[#6f5361]">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
                Portfolio
              </p>
              <h2 className="mt-3 text-4xl font-black text-[#2b1722]">Project Terbaru</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#6f5361]">
              Semua project yang diupload akan langsung muncul di daftar ini dan
              tersimpan di browser.
            </p>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-3xl border border-[#ffd3e7] bg-[#fffafd] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#ffe4f0] px-3 py-1 text-xs font-black text-[#c52b75]">
                      {project.category}
                    </span>
                    <span className="text-xs font-semibold text-[#9a7586]">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-[#2b1722]">{project.title}</h3>
                  <p className="mt-3 leading-7 text-[#6f5361]">{project.description}</p>
                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="mt-5 rounded-full border border-[#ffd3e7] px-4 py-2 text-xs font-black text-[#c52b75] transition hover:bg-[#fff0f7]"
                  >
                    Hapus Project
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="upload" className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
              Upload
            </p>
            <h2 className="mt-3 text-4xl font-black text-[#2b1722]">Tambah Project</h2>
            <p className="mt-4 max-w-lg leading-7 text-[#6f5361]">
              Masukkan judul, kategori, deskripsi, dan gambar project. Untuk
              produksi, struktur tabel Supabase sudah aku siapkan.
            </p>
          </div>

          <form
            onSubmit={addProject}
            className="rounded-[2rem] border border-[#ffd3e7] bg-white p-6 shadow-xl shadow-pink-100"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-[#5c3c4b]">Judul</span>
                <input
                  value={projectForm.title}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, title: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                  placeholder="Nama project"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-[#5c3c4b]">Kategori</span>
                <select
                  value={projectForm.category}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                >
                  {skills.map((skill) => (
                    <option key={skill}>{skill}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-[#5c3c4b]">Deskripsi</span>
              <textarea
                value={projectForm.description}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, description: event.target.value }))
                }
                className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                placeholder="Ceritakan project ini..."
              />
            </label>

            <label className="mt-4 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-[#ff5aa9]">
              <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview project"
                  className="h-56 w-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-[#c52b75]">
                  Klik untuk upload gambar project
                </span>
              )}
            </label>

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-[#ff5aa9] px-6 py-4 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-[#e83f92]"
            >
              Simpan Project
            </button>
          </form>
        </div>
      </section>

      <section id="comments" className="bg-[#2b1722] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ff9ccb]">
              Komentar
            </p>
            <h2 className="mt-3 text-4xl font-black">Ruang Apresiasi</h2>
            <form onSubmit={addComment} className="mt-8 rounded-[2rem] bg-white/10 p-5">
              <input
                value={commentForm.name}
                onChange={(event) =>
                  setCommentForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-[#2b1722] outline-none"
                placeholder="Nama kamu"
              />
              <textarea
                value={commentForm.message}
                onChange={(event) =>
                  setCommentForm((current) => ({ ...current, message: event.target.value }))
                }
                className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-[#2b1722] outline-none"
                placeholder="Tulis komentar..."
              />
              <button
                type="submit"
                className="mt-3 rounded-full bg-[#ff9ccb] px-6 py-3 text-sm font-black text-[#2b1722] transition hover:-translate-y-0.5"
              >
                Kirim Komentar
              </button>
            </form>
          </div>

          <div className="max-h-[520px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-3xl bg-white p-5 text-[#2b1722]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{comment.name}</p>
                    <p className="mt-1 text-xs font-semibold text-[#9a7586]">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="rounded-full border border-[#ffd3e7] px-3 py-1 text-xs font-black text-[#c52b75] transition hover:bg-[#fff0f7]"
                  >
                    Hapus
                  </button>
                </div>
                <p className="mt-3 leading-7 text-[#6f5361]">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#ffd3e7] bg-white p-8 text-center shadow-xl shadow-pink-100">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">Contact</p>
          <h2 className="mt-3 text-4xl font-black text-[#2b1722]">Mari Kolaborasi</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6f5361]">
            Terbuka untuk project tulisan, video pendek, konten digital, dan
            visual kreatif untuk brand atau kebutuhan kampus.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:harum.refa@example.com"
              className="rounded-full bg-[#2b1722] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Email Harum
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#f3abc9] px-6 py-3 text-sm font-bold text-[#c52b75] transition hover:-translate-y-0.5"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
