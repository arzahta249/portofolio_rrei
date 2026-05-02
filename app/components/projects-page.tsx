"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Project, starterProjects } from "../data/portfolio";
import {
  PROJECT_STORAGE_KEY,
  normalizeProjects,
  readProjects,
} from "../lib/portfolio-storage";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setProjects(readProjects());
      setIsStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }, [isStorageReady, projects]);

  function deleteProject(projectId: string) {
    setProjects((current) => current.filter((project) => project.id !== projectId));
  }

  function toggleFeatured(projectId: string) {
    setProjects((current) =>
      normalizeProjects(current).map((project) =>
        project.id === projectId ? { ...project, featured: !project.featured } : project,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7fb] px-5 py-10 text-[#34212b] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#f3abc9] bg-white px-4 py-2 text-sm font-black text-[#c52b75] transition hover:-translate-y-0.5"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                  d="M15 18 9 12l6-6"
                />
              </svg>
              Back
            </Link>
            <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-[#d62a7c]">
              HRR
            </Link>
          </div>
          <Link
            href="/#upload"
            className="rounded-full bg-[#ff5aa9] px-5 py-2 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
          >
            Upload Project
          </Link>
        </nav>

        <header className="mt-14 rounded-[2rem] border border-[#ffd3e7] bg-white p-7 shadow-xl shadow-pink-100">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
            Semua Project
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#2b1722] sm:text-5xl">
            Galeri Karya Harum
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#6f5361]">
            Semua project yang diupload tampil di halaman ini. Gunakan tombol landing
            untuk memilih project mana yang muncul sebagai project utama di halaman utama.
          </p>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card-3d overflow-hidden rounded-3xl border border-[#ffd3e7] bg-white shadow-sm"
            >
              <Link href={`/projects/${project.id}`}>
                <img src={project.image} alt={project.title} className="h-56 w-full object-cover" />
              </Link>
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#ffe4f0] px-3 py-1 text-xs font-black text-[#c52b75]">
                    {project.category}
                  </span>
                  <span className="text-xs font-semibold text-[#9a7586]">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <Link href={`/projects/${project.id}`}>
                  <h2 className="mt-4 text-2xl font-black text-[#2b1722] transition hover:text-[#d62a7c]">
                    {project.title}
                  </h2>
                </Link>
                <p className="mt-3 leading-7 text-[#6f5361]">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="rounded-full bg-[#2b1722] px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5"
                  >
                    Buka Detail
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(project.id)}
                    className="rounded-full border border-[#ffd3e7] px-4 py-2 text-xs font-black text-[#c52b75] transition hover:bg-[#fff0f7]"
                  >
                    {project.featured ? "Keluarkan dari Landing" : "Masukkan Landing"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="rounded-full border border-[#ffd3e7] px-4 py-2 text-xs font-black text-[#c52b75] transition hover:bg-[#fff0f7]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
