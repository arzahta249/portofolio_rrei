"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Project, starterProjects } from "../data/portfolio";
import { normalizeProjects, readProjects } from "../lib/portfolio-storage";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(new Date(value));
}

function toVideoSource(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsed.pathname.includes("/shorts/")) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/shorts/")[1]}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const [projects, setProjects] = useState<Project[]>(starterProjects);

  useEffect(() => {
    queueMicrotask(() => {
      setProjects(readProjects());
    });
  }, []);

  const project = useMemo(
    () => normalizeProjects(projects).find((item) => item.id === projectId),
    [projectId, projects],
  );

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff7fb] px-5 text-center text-[#34212b]">
        <div className="max-w-lg rounded-[2rem] border border-[#ffd3e7] bg-white p-8 shadow-xl shadow-pink-100">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
            Project Tidak Ditemukan
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#2b1722]">
            Project ini belum ada di browser kamu.
          </h1>
          <Link
            href="/projects"
            className="mt-6 inline-flex rounded-full bg-[#ff5aa9] px-6 py-3 text-sm font-black text-white"
          >
            Kembali ke Project
          </Link>
        </div>
      </main>
    );
  }

  const gallery = project.gallery || [];
  const videoSource = toVideoSource(project.videoUrl || "");
  const isEmbedVideo = videoSource.includes("youtube.com/embed");

  return (
    <main className="min-h-screen bg-[#fff7fb] px-5 py-10 text-[#34212b] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
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
          <div className="flex flex-wrap gap-2">
            <Link
              href="/projects"
              className="rounded-full border border-[#f3abc9] bg-white px-5 py-2 text-sm font-black text-[#c52b75] transition hover:-translate-y-0.5"
            >
              Semua Project
            </Link>
            <Link
              href="/"
              className="rounded-full bg-[#ff5aa9] px-5 py-2 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
            >
              Home
            </Link>
          </div>
        </nav>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="overflow-hidden rounded-[2rem] border-8 border-white bg-[#ffe1ef] shadow-2xl shadow-pink-200">
            <img src={project.image} alt={project.title} className="h-[520px] w-full object-cover" />
          </div>

          <article className="rounded-[2rem] border border-[#ffd3e7] bg-white p-7 shadow-xl shadow-pink-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#ffe4f0] px-4 py-2 text-xs font-black text-[#c52b75]">
                {project.category}
              </span>
              <span className="text-sm font-semibold text-[#9a7586]">
                {formatDate(project.createdAt)}
              </span>
              {project.featured ? (
                <span className="rounded-full bg-[#2b1722] px-4 py-2 text-xs font-black text-white">
                  Tampil di Landing
                </span>
              ) : null}
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight text-[#2b1722] sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#6f5361]">{project.description}</p>
            <div className="mt-7 rounded-3xl bg-[#fff0f7] p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c52b75]">
                Detail Project
              </p>
              <p className="mt-3 whitespace-pre-line leading-8 text-[#604653]">{project.detail}</p>
            </div>
          </article>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
                Media
              </p>
              <h2 className="mt-3 text-4xl font-black text-[#2b1722]">Foto dan Video</h2>
            </div>
          </div>

          {gallery.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {gallery.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${project.title} gallery ${index + 1}`}
                  className="h-72 w-full rounded-3xl border border-[#ffd3e7] object-cover shadow-sm"
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-3xl border border-[#ffd3e7] bg-white p-5 text-[#6f5361]">
              Belum ada foto tambahan untuk project ini.
            </p>
          )}

          {videoSource ? (
            <div className="mt-7 overflow-hidden rounded-[2rem] border border-[#ffd3e7] bg-white p-3 shadow-xl shadow-pink-100">
              {isEmbedVideo ? (
                <iframe
                  src={videoSource}
                  title={`Video ${project.title}`}
                  className="aspect-video w-full rounded-3xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={videoSource} controls className="aspect-video w-full rounded-3xl bg-black" />
              )}
            </div>
          ) : (
            <p className="mt-5 rounded-3xl border border-[#ffd3e7] bg-white p-5 text-[#6f5361]">
              Belum ada video untuk project ini.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
