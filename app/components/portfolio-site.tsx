"use client";

import {
  ChangeEvent,
  FormEvent,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiAssistant } from "./ai-assistant";
import {
  Comment,
  Project,
  Moment,
  journey,
  positiveEmojis,
  skills,
  socials,
  starterComments,
  starterProjects,
  toolkit,
} from "../data/portfolio";
import { COMMENT_STORAGE_KEY, readComments } from "../lib/comment-storage";
import {
  PROJECT_STORAGE_KEY,
  MOMENT_STORAGE_KEY,
  getFeaturedProjects,
  normalizeProjects,
  readProjects,
  readMoments,
  saveMoments,
} from "../lib/portfolio-storage";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";

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
  const { theme, setTheme } = useTheme();
  const { role, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [comments, setComments] = useState<Comment[]>(starterComments);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [momentGalleryPreview, setMomentGalleryPreview] = useState<{ url: string; description: string }[]>([]);
  const [videoPreview, setVideoPreview] = useState("");
  const [commentAudioName, setCommentAudioName] = useState("");
  const [isCommentRecording, setIsCommentRecording] = useState(false);
  const [commentRecordError, setCommentRecordError] = useState("");
  const [heroBurstKey, setHeroBurstKey] = useState(0);
  const commentRecorderRef = useRef<MediaRecorder | null>(null);
  const commentChunksRef = useRef<Blob[]>([]);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Penulisan",
    description: "",
    detail: "",
    image: "",
    gallery: [] as string[],
    videoUrl: "",
    featured: true,
  });
  const [uploadMode, setUploadMode] = useState<"project" | "moment">("project");
  const [momentForm, setMomentForm] = useState({
    title: "",
    description: "",
    activityDetails: "",
    executionDate: "",
    mediaUrl: "",
    mediaType: "image" as "image" | "video",
    gallery: [] as { url: string; description: string }[],
    featured: true,
  });
  const [commentForm, setCommentForm] = useState({
    name: "",
    message: "",
    emoji: "love",
    audio: "",
  });

  useEffect(() => {
    queueMicrotask(() => {
      setProjects(readProjects());
      setMoments(readMoments());
      setComments(readComments());
      setIsStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }, [isStorageReady, projects]);

  useEffect(() => {
    if (!isStorageReady) return;
    window.localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(comments));
  }, [comments, isStorageReady]);

  useEffect(() => {
    if (!isStorageReady) return;
    saveMoments(moments);
  }, [moments, isStorageReady]);

  const projectStats = useMemo(
    () => [
      { label: "Project", value: projects.length.toString().padStart(2, "0") },
      { label: "Skill Utama", value: "03" },
      { label: "Komentar", value: comments.length.toString().padStart(2, "0") },
      { label: "Tools Kreatif", value: "06", dark: true },
    ],
    [comments.length, projects.length],
  );

  const featuredProjects = useMemo(() => getFeaturedProjects(projects), [projects]);
  const featuredMoments = useMemo(() => moments.filter(m => m.featured !== false), [moments]);

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

  function handleGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(file);
          }),
      ),
    ).then((images) => {
      setGalleryPreview(images);
      setProjectForm((current) => ({ ...current, gallery: images }));
    });
  }

  function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const video = String(reader.result);
      setVideoPreview(file.name);
      setProjectForm((current) => ({ ...current, videoUrl: video }));
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
      detail: projectForm.detail.trim() || projectForm.description.trim(),
      image:
        projectForm.image ||
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      gallery: projectForm.gallery,
      videoUrl: projectForm.videoUrl.trim(),
      featured: projectForm.featured,
      createdAt: new Date().toISOString(),
    };

    setProjects((current) => [project, ...current]);
    setProjectForm({
      title: "",
      category: "Penulisan",
      description: "",
      detail: "",
      image: "",
      gallery: [],
      videoUrl: "",
      featured: true,
    });
    setPreview("");
    setGalleryPreview([]);
    setVideoPreview("");
  }

  function handleMomentMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = () => {
      setMomentForm((current) => ({
        ...current,
        mediaUrl: String(reader.result),
        mediaType: isVideo ? "video" : "image",
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleMomentGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<{ url: string; description: string }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ url: String(reader.result), description: "" });
            reader.readAsDataURL(file);
          }),
      ),
    ).then((images) => {
      setMomentGalleryPreview((current) => [...current, ...images]);
      setMomentForm((current) => ({ ...current, gallery: [...current.gallery, ...images] }));
    });
  }

  function handleMomentGalleryDescriptionChange(index: number, description: string) {
    setMomentGalleryPreview((current) => {
      const updated = [...current];
      updated[index].description = description;
      return updated;
    });
    setMomentForm((current) => {
      const updatedGallery = [...current.gallery];
      updatedGallery[index].description = description;
      return { ...current, gallery: updatedGallery };
    });
  }

  function addMoment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!momentForm.title.trim() || !momentForm.description.trim()) return;

    const moment: Moment = {
      id: crypto.randomUUID(),
      title: momentForm.title.trim(),
      description: momentForm.description.trim(),
      activityDetails: momentForm.activityDetails.trim(),
      executionDate: momentForm.executionDate || new Date().toISOString().split("T")[0],
      mediaUrl: momentForm.mediaUrl,
      mediaType: momentForm.mediaType,
      gallery: momentForm.gallery,
      featured: momentForm.featured,
      createdAt: new Date().toISOString(),
    };

    const currentMoments = readMoments();
    setMoments([moment, ...currentMoments]);
    setMomentGalleryPreview([]);
    setMomentForm({
      title: "",
      description: "",
      activityDetails: "",
      executionDate: "",
      mediaUrl: "",
      mediaType: "image",
      gallery: [],
      featured: true,
    });
  }

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commentForm.name.trim() || (!commentForm.message.trim() && !commentForm.audio)) return;

    setComments((current) => [
      {
        id: crypto.randomUUID(),
        name: commentForm.name.trim(),
        message: commentForm.message.trim(),
        emoji: commentForm.emoji,
        audio: commentForm.audio,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setCommentForm({ name: "", message: "", emoji: "love", audio: "" });
    setCommentAudioName("");
  }

  function handleCommentAudioUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCommentAudioName(file.name);
      setCommentForm((current) => ({ ...current, audio: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  async function startCommentRecording() {
    setCommentRecordError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      commentChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          commentChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(commentChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const reader = new FileReader();
        reader.onload = () => {
          setCommentAudioName("rekaman-komentar.webm");
          setCommentForm((current) => ({ ...current, audio: String(reader.result) }));
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      commentRecorderRef.current = recorder;
      setIsCommentRecording(true);
    } catch {
      setCommentRecordError("Microphone tidak bisa diakses. Izinkan akses mic di browser.");
    }
  }

  function stopCommentRecording() {
    const recorder = commentRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    recorder.stop();
    setIsCommentRecording(false);
  }

  function playHeroBurst() {
    setHeroBurstKey((current) => current + 1);
  }

  function handleProjectTilt(event: PointerEvent<HTMLElement>) {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    target.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    target.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    target.style.setProperty("--shine-x", `${((x + 1) * 50).toFixed(1)}%`);
    target.style.setProperty("--shine-y", `${((y + 1) * 50).toFixed(1)}%`);
  }

  function resetProjectTilt(event: PointerEvent<HTMLElement>) {
    const target = event.currentTarget;
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
    target.style.setProperty("--shine-x", "50%");
    target.style.setProperty("--shine-y", "50%");
  }

  function deleteComment(commentId: string) {
    setComments((current) => current.filter((comment) => comment.id !== commentId));
  }

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

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Moment", href: "#moments" },
    { label: "Timeline", href: "#journey" },
    { label: "Semua Project", href: "/projects" },
    { label: "Komentar", href: "/comments" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="text-base font-black tracking-[0.18em] text-primary-text">
            HRR
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.href} href={link.href} className="transition hover:text-primary-text">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className="transition hover:text-primary-text">
                  {link.label}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Color Switcher */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/5 p-1 rounded-full border border-black/10 shadow-sm mr-2">
              <button
                onClick={() => setTheme("pink")}
                className={`w-5 h-5 rounded-full transition-transform ${theme === 'pink' ? 'scale-110 ring-2 ring-[#ff5aa9] ring-offset-1' : 'hover:scale-110'} bg-primary`}
                aria-label="Pink Theme"
              />
              <button
                onClick={() => setTheme("yellow")}
                className={`w-5 h-5 rounded-full transition-transform ${theme === 'yellow' ? 'scale-110 ring-2 ring-[#f59e0b] ring-offset-1' : 'hover:scale-110'} bg-[#fde047]`}
                aria-label="Yellow Theme"
              />
              <button
                onClick={() => setTheme("blue")}
                className={`w-5 h-5 rounded-full transition-transform ${theme === 'blue' ? 'scale-110 ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-110'} bg-blue-400`}
                aria-label="Blue Theme"
              />
            </div>
            {role === "admin" && (
              <a
                href="#upload"
                className="hidden rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[color:var(--shadow-glow)] transition hover:-translate-y-0.5 hover:bg-primary-hover sm:inline-flex"
              >
                Upload
              </a>
            )}
            <button
              onClick={logout}
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-white/80 border border-soft-border px-5 py-2 text-sm font-bold text-muted transition hover:bg-soft-bg hover:text-foreground-dark"
              title="Ganti Akun"
            >
              Keluar
            </button>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Buka menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-soft-border bg-white text-primary-text shadow-sm md:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.3"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setIsMobileNavOpen(false)}
            className="absolute inset-0 bg-foreground-dark/35 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white p-6 shadow-2xl shadow-[color:var(--shadow-glow)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black tracking-[0.2em] text-primary-text">HRR</span>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                aria-label="Tutup menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-soft-bg text-primary-dark"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.3"
                    d="m7 7 10 10M17 7 7 17"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-9 grid gap-3">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="rounded-2xl bg-background px-4 py-4 text-base font-black text-foreground-dark"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="rounded-2xl bg-background px-4 py-4 text-base font-black text-foreground-dark"
                  >
                    {link.label}
                  </a>
                ),
              )}
              {role === "admin" && (
                <a href="#upload" onClick={() => setIsMobileNavOpen(false)} className="rounded-2xl bg-background px-4 py-4 text-base font-black text-foreground-dark">
                  Upload
                </a>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsMobileNavOpen(false);
                }}
                className="rounded-2xl bg-background px-4 py-4 text-base font-black text-foreground-dark text-left"
              >
                Ganti Akun (Keluar)
              </button>
            </div>
            {/* Mobile Color Switcher */}
            <div className="mt-6 flex items-center justify-center gap-4 bg-black/5 p-3 rounded-2xl border border-black/10 shadow-sm">
              <button
                onClick={() => setTheme("pink")}
                className={`w-8 h-8 rounded-full transition-transform ${theme === 'pink' ? 'scale-110 ring-2 ring-[#ff5aa9] ring-offset-2' : 'hover:scale-110'} bg-primary`}
                aria-label="Pink Theme"
              />
              <button
                onClick={() => setTheme("yellow")}
                className={`w-8 h-8 rounded-full transition-transform ${theme === 'yellow' ? 'scale-110 ring-2 ring-[#f59e0b] ring-offset-2' : 'hover:scale-110'} bg-[#fde047]`}
                aria-label="Yellow Theme"
              />
              <button
                onClick={() => setTheme("blue")}
                className={`w-8 h-8 rounded-full transition-transform ${theme === 'blue' ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'} bg-blue-400`}
                aria-label="Blue Theme"
              />
            </div>
            <a
              href="#upload"
              onClick={() => setIsMobileNavOpen(false)}
              className="mt-auto rounded-full bg-primary px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-[color:var(--shadow-glow)]"
            >
              Upload Project
            </a>
          </aside>
        </div>
      ) : null}

      <section id="home" className="relative px-5 pb-14 pt-32 sm:px-8 min-h-[90vh] flex items-center">
        <div className="absolute left-10 top-32 h-96 w-96 rounded-full bg-soft-bg blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-16 right-10 h-[30rem] w-[30rem] rounded-full bg-accent blur-3xl opacity-40 mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.2fr_0.8fr] w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 flex flex-col items-start"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mb-6 inline-flex rounded-full border border-soft-border bg-white/40 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-primary-dark shadow-sm"
            >
              ✨ Mahasiswi Bisnis Digital Universitas Pancasakti
            </motion.div>
            <h1 className="max-w-4xl text-6xl font-black leading-[1.1] text-foreground-dark sm:text-7xl lg:text-8xl tracking-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Harum Refa Rakhmawati</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted font-medium">
              Portfolio digital ini di gunakan untuk menampilkan karya penulisan,
              videografi, dan menggambar yang diciptakan oleh Harum Refa Rakhmawati. Karya-karya ini merupakan hasil dari proses dari ide kreatif nya sendiri.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-[color:var(--shadow-glow)] transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
              >
                Lihat Project
              </a>
              <Link
                href="/projects"
                className="rounded-full border-2 border-soft-border bg-white/50 backdrop-blur-md px-8 py-4 text-base font-bold text-primary-dark transition-all hover:-translate-y-1 hover:border-primary active:scale-95"
              >
                All Project
              </Link>
              <a
                href="#contact"
                className="rounded-full border-2 border-soft-border bg-white/50 backdrop-blur-md px-8 py-4 text-base font-bold text-primary-dark transition-all hover:-translate-y-1 hover:border-primary active:scale-95"
              >
                Hubungi Harum
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4">
              {socials.map((social, i) => (
                <motion.a
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="grid h-14 w-14 place-items-center rounded-full border border-soft-border bg-white/70 backdrop-blur-md text-primary-text shadow-sm transition-all hover:-translate-y-1.5 hover:bg-white hover:shadow-md hover:text-primary active:scale-95"
                >
                  <Icon path={social.path} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-1 relative mx-auto grid w-full max-w-lg place-items-center lg:order-2"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-8 top-12 z-20 rounded-3xl border border-white/60 bg-white/60 px-6 py-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                ✦
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary-dark">Creative Mood</p>
              <p className="text-2xl font-black text-foreground-dark mt-1">Soft & Beautiful</p>
            </motion.div>

            {/* Space filling removed */}

            <button
              type="button"
              onClick={playHeroBurst}
              className="hero-photo-orbit relative grid aspect-square w-[min(82vw,400px)] place-items-center rounded-full bg-soft-bg p-5 text-left shadow-2xl shadow-[color:var(--shadow-glow)] transition-transform hover:scale-105"
              aria-label="Mainkan animasi foto Harum"
            >
              <div className="hero-photo-glow absolute inset-0 rounded-full" />
              <div key={heroBurstKey} className="hero-burst" aria-hidden="true">
                <span>✿</span>
                <span>♡</span>
                <span>✦</span>
                <span>✿</span>
                <span>🦋</span>
                <span>🦋</span>
              </div>
              <div className="relative z-10 aspect-square w-full overflow-hidden rounded-full border-[8px] border-white/80 bg-soft-bg">
                <img
                  src="/Screenshot%202026-04-12%20151850.png"
                  alt="Foto Harum Refa Rakhmawati"
                  className="h-full w-full object-cover"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-4 left-1/2 z-20 w-[90%] -translate-x-1/2 rounded-3xl border border-white/60 bg-white/90 p-5 text-center shadow-2xl backdrop-blur-xl"
              >
                <p className="text-sm font-bold text-primary-dark">Digital Business Student</p>
                <p className="mt-1 text-lg font-black text-foreground-dark sm:text-xl">
                  Writing, video, and cute visuals.
                </p>
              </motion.div>
            </button>
          </motion.div>
        </div>
      </section>

      <section id="about" className="relative px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">About</p>
            <h2 className="mt-3 text-4xl font-black text-foreground-dark sm:text-5xl">Tentang Harum</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
            {/* Main Bio Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-2 md:row-span-2 rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 sm:p-12 shadow-xl shadow-[color:var(--shadow-glow)] transition-all hover:bg-white/60"
            >
              <p className="text-lg leading-relaxed text-muted font-medium">
                Harum Refa Rakhmawati adalah mahasiswi Universitas Pancasakti, Program Studi Bisnis Digital. 
                Ia menyukai proses merangkai ide menjadi tulisan, menangkap momen lewat videografi, 
                dan menuangkan imajinasi melalui gambar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-sm font-bold text-primary-dark transition-transform hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats Cards (Bento style) */}
            {projectStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className={`rounded-[2.5rem] border p-8 flex flex-col justify-center items-center text-center shadow-lg transition-transform hover:-translate-y-1 ${
                  stat.dark 
                    ? "bg-foreground-dark border-foreground-dark shadow-[color:var(--shadow-glow)]" 
                    : "bg-white/60 border-white/80 backdrop-blur-xl shadow-sm hover:shadow-md"
                }`}
              >
                <p className={`text-5xl font-black ${stat.dark ? "text-primary" : "text-primary-text"}`}>
                  {stat.value}
                </p>
                <p className={`mt-3 text-sm font-bold uppercase tracking-widest ${stat.dark ? "text-white/80" : "text-muted"}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">
              Timeline
            </p>
            <h2 className="mt-3 text-4xl font-black text-foreground-dark">Perjalanan Kreatif</h2>
            <div
              className="mt-7 rounded-3xl border border-soft-border bg-white p-6"
            >
              <p className="text-sm font-black uppercase text-[#9a7586]">Toolkit Favorit</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {toolkit.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-soft-bg px-4 py-2 text-sm font-bold text-primary-dark"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {journey.map((item) => (
              <article
                key={item.year}
                className="rounded-3xl border border-soft-border bg-white p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-black text-white">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-foreground-dark">{item.title}</h3>
                    <p className="mt-2 leading-7 text-muted">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="moments" className="relative px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">
                Keseharian & Inspirasi
              </p>
              <h2 className="mt-3 text-4xl font-black text-foreground-dark sm:text-5xl">Moment Harum</h2>
            </div>
            <Link
              href="/moments"
              className="inline-flex rounded-full bg-primary/10 px-6 py-3 text-sm font-black text-primary-dark transition hover:bg-primary hover:text-white"
            >
              Lihat Semua Moment &rarr;
            </Link>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredMoments.map((moment, i) => (
              <motion.article
                key={moment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-5 backdrop-blur-xl shadow-lg shadow-[color:var(--shadow-glow)] transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-soft-bg mb-5">
                  {moment.mediaType === "video" ? (
                    <video src={moment.mediaUrl} controls className="h-full w-full object-cover" />
                  ) : (
                    <img src={moment.mediaUrl} alt={moment.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="px-2">
                  <p className="text-xs font-bold text-primary-text mb-2">{formatDate(moment.executionDate || moment.createdAt)}</p>
                  <h3 className="text-xl font-black text-foreground-dark mb-2">{moment.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{moment.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="relative px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">
                Karya Pilihan
              </p>
              <h2 className="mt-3 text-4xl font-black text-foreground-dark sm:text-5xl">Featured Projects</h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex rounded-full bg-primary/10 px-6 py-3 text-sm font-black text-primary-dark transition hover:bg-primary hover:text-white"
            >
              Lihat Semua Karya &rarr;
            </Link>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={project.id}
                onPointerMove={handleProjectTilt}
                onPointerLeave={resetProjectTilt}
                className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-xl shadow-[color:var(--shadow-glow)] transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link href={`/projects/${project.id}`} className="block relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100 z-10 mix-blend-overlay" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-black text-primary-dark shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </Link>
                <div className="p-8">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted mb-3">
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="text-2xl font-black text-foreground-dark transition group-hover:text-primary">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mt-3 leading-relaxed text-muted line-clamp-2">{project.description}</p>
                  
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-soft-border pt-6">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-bold text-sm text-primary-dark transition hover:text-primary"
                    >
                      Baca Detail &rarr;
                    </Link>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(project.id)}
                        className="rounded-full bg-soft-bg p-2 text-primary-dark transition hover:bg-primary/20"
                        title="Sembunyikan dari beranda"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
                        className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                        title="Hapus project"
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AiAssistant />

      {role === "admin" && (
        <section id="upload" className="px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">
                Upload
              </p>
              <h2 className="mt-3 text-4xl font-black text-foreground-dark">Tambah {uploadMode === "project" ? "Project" : "Moment"}</h2>
              <p className="mt-4 max-w-lg leading-7 text-muted">
                {uploadMode === "project" 
                  ? "Masukkan judul, kategori, deskripsi, detail, foto, dan file video. Project bisa dipilih untuk tampil di landing page atau hanya muncul di halaman all project."
                  : "Bagikan keseharian, inspirasi, atau proses kreatif Anda. Unggah foto atau video beserta deskripsi singkat untuk mengisi Moment Harum."
                }
              </p>
              <div className="mt-8 flex rounded-full bg-soft-border/50 p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setUploadMode("project")}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition ${uploadMode === "project" ? "bg-white text-primary-dark shadow-sm" : "text-muted hover:text-foreground-dark"}`}
                >
                  Upload Project
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("moment")}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition ${uploadMode === "moment" ? "bg-white text-primary-dark shadow-sm" : "text-muted hover:text-foreground-dark"}`}
                >
                  Upload Moment
                </button>
              </div>
            </div>

            <form
              onSubmit={uploadMode === "project" ? addProject : addMoment}
              className="rounded-[2rem] border border-soft-border bg-white p-6 shadow-xl shadow-pink-100"
            >
              {uploadMode === "project" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-bold text-[#5c3c4b]">Judul Project</span>
                      <input
                        value={projectForm.title}
                        onChange={(event) =>
                          setProjectForm((current) => ({ ...current, title: event.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                        placeholder="Judul project..."
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-[#5c3c4b]">Kategori</span>
                      <select
                        value={projectForm.category}
                        onChange={(event) =>
                          setProjectForm((current) => ({ ...current, category: event.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 font-bold text-primary-dark outline-none transition focus:border-[#ff5aa9]"
                      >
                        {skills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-bold text-[#5c3c4b]">Deskripsi Singkat</span>
                    <textarea
                      value={projectForm.description}
                      onChange={(event) =>
                        setProjectForm((current) => ({ ...current, description: event.target.value }))
                      }
                      className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                      placeholder="Ceritakan project ini..."
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-sm font-bold text-[#5c3c4b]">Detail Project</span>
                    <textarea
                      value={projectForm.detail}
                      onChange={(event) =>
                        setProjectForm((current) => ({ ...current, detail: event.target.value }))
                      }
                      className="mt-2 min-h-40 w-full resize-none rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                      placeholder="Tuliskan proses, tujuan, hasil, atau cerita lengkap project..."
                    />
                  </label>

                  <label className="mt-4 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-primary">
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="sr-only" />
                    {videoPreview ? (
                      <span className="text-sm font-bold text-primary-dark">
                        Video siap disimpan: {videoPreview}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-primary-dark">
                        Klik untuk upload video project
                      </span>
                    )}
                  </label>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-primary">
                      <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
                      {preview ? (
                        <img src={preview} alt="Preview project" className="h-56 w-full rounded-2xl object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-primary-dark">
                          Klik untuk upload foto utama
                        </span>
                      )}
                    </label>
                    <label className="grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-primary">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="sr-only"
                      />
                      {galleryPreview.length > 0 ? (
                        <span className="text-sm font-bold text-primary-dark">
                          {galleryPreview.length} foto tambahan siap disimpan
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-primary-dark">
                          Klik untuk upload foto tambahan (Galeri)
                        </span>
                      )}
                    </label>
                  </div>
                  
                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-soft-bg px-4 py-3">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(event) =>
                        setProjectForm((current) => ({ ...current, featured: event.target.checked }))
                      }
                      className="h-5 w-5 accent-primary"
                    />
                    <span className="text-sm font-bold text-foreground-dark">
                      Tampilkan di Landing Page
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-bold text-[#5c3c4b]">Judul Kegiatan</span>
                      <input
                        value={momentForm.title}
                        onChange={(event) =>
                          setMomentForm((current) => ({ ...current, title: event.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                        placeholder="Judul moment..."
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-[#5c3c4b]">Tanggal Dilaksanakan</span>
                      <input
                        type="date"
                        value={momentForm.executionDate}
                        onChange={(event) =>
                          setMomentForm((current) => ({ ...current, executionDate: event.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-bold text-[#5c3c4b]">Deskripsi Singkat</span>
                    <textarea
                      value={momentForm.description}
                      onChange={(event) =>
                        setMomentForm((current) => ({ ...current, description: event.target.value }))
                      }
                      className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                      placeholder="Ceritakan momen ini secara singkat..."
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-sm font-bold text-[#5c3c4b]">Rincian Kegiatan</span>
                    <textarea
                      value={momentForm.activityDetails}
                      onChange={(event) =>
                        setMomentForm((current) => ({ ...current, activityDetails: event.target.value }))
                      }
                      className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
                      placeholder="Tuliskan rincian lengkap mengenai kegiatan ini..."
                    />
                  </label>

                  <label className="mt-4 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-primary">
                    <input type="file" accept="image/*,video/*" onChange={handleMomentMediaUpload} className="sr-only" />
                    {momentForm.mediaUrl ? (
                      momentForm.mediaType === "video" ? (
                        <video src={momentForm.mediaUrl} controls className="h-56 w-full rounded-2xl object-cover" />
                      ) : (
                        <img src={momentForm.mediaUrl} alt="Preview moment" className="h-56 w-full rounded-2xl object-cover" />
                      )
                    ) : (
                      <span className="text-sm font-bold text-primary-dark">
                        Klik untuk upload foto atau video utama
                      </span>
                    )}
                  </label>

                  <label className="mt-4 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-primary">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMomentGalleryUpload}
                      className="sr-only"
                    />
                    <span className="text-sm font-bold text-primary-dark">
                      Klik untuk upload foto tambahan (Galeri)
                    </span>
                  </label>

                  {momentGalleryPreview.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3">
                      <p className="text-sm font-bold text-[#5c3c4b]">Deskripsi Foto Tambahan:</p>
                      {momentGalleryPreview.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-2xl bg-soft-bg p-3 border border-[#f4bdd4]">
                          <img src={item.url} alt={`Preview ${idx}`} className="h-16 w-16 rounded-xl object-cover" />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleMomentGalleryDescriptionChange(idx, e.target.value)}
                            placeholder={`Cerita untuk foto ke-${idx + 1}...`}
                            className="flex-grow rounded-xl border border-[#f4bdd4] bg-white px-3 py-2 outline-none text-sm transition focus:border-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-soft-bg px-4 py-3">
                    <input
                      type="checkbox"
                      checked={momentForm.featured}
                      onChange={(event) =>
                        setMomentForm((current) => ({ ...current, featured: event.target.checked }))
                      }
                      className="h-5 w-5 accent-primary"
                    />
                    <span className="text-sm font-bold text-foreground-dark">
                      Tampilkan di Landing Page
                    </span>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="mt-6 w-full rounded-2xl bg-primary py-4 font-black text-white shadow-lg shadow-[color:var(--shadow-glow)] transition hover:bg-primary-dark active:scale-95"
              >
                Simpan {uploadMode === "project" ? "Project" : "Moment"}
              </button>
            </form>
          </div>
        </section>
      )}

      <section id="comments" className="bg-foreground-dark px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ff9ccb]">
              Komentar
            </p>
            <h2 className="mt-3 text-4xl font-black">Ruang Apresiasi</h2>
            <p className="mt-4 leading-7 text-white/75">
              Anda bisa meninggalkan komentar teks, emoji positif, atau suara.
            </p>
            <form
              onSubmit={addComment}
              className="mt-8 rounded-[2rem] bg-white/10 p-5"
            >
              <input
                value={commentForm.name}
                onChange={(event) =>
                  setCommentForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-foreground-dark outline-none"
                placeholder="Nama kamu"
              />
              <textarea
                value={commentForm.message}
                onChange={(event) =>
                  setCommentForm((current) => ({ ...current, message: event.target.value }))
                }
                className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-foreground-dark outline-none"
                placeholder="Tulis komentar..."
              />
              <div className="mt-3 grid gap-2">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff9ccb]">
                  Emoji positif
                </p>
                <div className="flex flex-wrap gap-2">
                  {positiveEmojis.map((emoji) => (
                    <button
                      key={emoji.id}
                      type="button"
                      onClick={() =>
                        setCommentForm((current) => ({ ...current, emoji: emoji.id }))
                      }
                      className={`rounded-full px-4 py-2 text-sm font-black transition ${
                        commentForm.emoji === emoji.id
                          ? "bg-[#ff9ccb] text-foreground-dark"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {emoji.symbol} {emoji.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="mt-3 grid cursor-pointer place-items-center rounded-2xl border border-dashed border-white/25 bg-white/10 px-4 py-4 text-center transition hover:bg-white/15">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleCommentAudioUpload}
                  className="sr-only"
                />
                <span className="text-sm font-black text-[#ff9ccb]">
                  {commentAudioName ? `Suara siap dikirim: ${commentAudioName}` : "Upload suara komentar"}
                </span>
              </label>
              <div className="mt-3 rounded-2xl bg-white/10 p-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={isCommentRecording ? stopCommentRecording : startCommentRecording}
                    className={`rounded-full px-5 py-3 text-sm font-black transition ${
                      isCommentRecording
                        ? "bg-white text-primary-dark"
                        : "bg-[#ff9ccb] text-foreground-dark"
                    }`}
                  >
                    {isCommentRecording ? "Stop Rekam" : "Rekam Suara"}
                  </button>
                  {commentForm.audio ? (
                    <audio controls src={commentForm.audio} className="min-w-0 flex-1" />
                  ) : null}
                </div>
                {commentRecordError ? (
                  <p className="mt-2 text-sm font-bold text-[#ff9ccb]">{commentRecordError}</p>
                ) : null}
                {isCommentRecording ? (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl bg-foreground-dark/40 px-4 py-3">
                    <span className="recording-dot" />
                    <span className="text-sm font-black text-white">Sedang merekam...</span>
                    <span className="recording-wave" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                className="mt-3 rounded-full bg-[#ff9ccb] px-6 py-3 text-sm font-black text-foreground-dark transition hover:-translate-y-0.5"
              >
                Kirim Komentar
              </button>
              <Link
                href="/comments"
                className="ml-2 inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                Lihat Semua
              </Link>
            </form>
          </div>

          <div className="max-h-[520px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-3xl bg-white p-5 text-foreground-dark"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-soft-bg text-lg font-black text-primary-dark">
                      {positiveEmojis.find((emoji) => emoji.id === comment.emoji)?.symbol || "♡"}
                    </span>
                    <div>
                      <p className="font-black">{comment.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#9a7586]">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="rounded-full border border-soft-border px-3 py-1 text-xs font-black text-primary-dark transition hover:bg-soft-bg"
                  >
                    Hapus
                  </button>
                </div>
                {comment.message ? (
                  <p className="mt-3 leading-7 text-muted">{comment.message}</p>
                ) : null}
                {comment.audio ? (
                  <audio controls src={comment.audio} className="mt-4 w-full" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 py-16 sm:px-8">
        <div
          className="mx-auto max-w-7xl rounded-[2rem] border border-soft-border bg-white p-8 text-center shadow-xl shadow-pink-100"
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">Contact</p>
          <h2 className="mt-3 text-4xl font-black text-foreground-dark">Mari Kolaborasi</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted">
            Terbuka untuk project tulisan, video pendek, konten digital, dan
            visual kreatif untuk brand atau kebutuhan kampus.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="marzaalifi@gmail.com"
              className="rounded-full bg-foreground-dark px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Email Harum
            </a>
            <a
              href="https://www.instagram.com/rrei.444?igsh=OWtndzhwaGtxZHdt"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border-main px-6 py-3 text-sm font-bold text-primary-dark transition hover:-translate-y-0.5"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
