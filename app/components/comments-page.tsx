"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Comment, positiveEmojis, starterComments } from "../data/portfolio";
import { COMMENT_STORAGE_KEY, readComments } from "../lib/comment-storage";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(starterComments);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [audioName, setAudioName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordError, setRecordError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [form, setForm] = useState({
    name: "",
    message: "",
    emoji: "love",
    audio: "",
  });

  useEffect(() => {
    queueMicrotask(() => {
      setComments(readComments());
      setIsStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    window.localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(comments));
  }, [comments, isStorageReady]);

  function handleAudioUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAudioName(file.name);
      setForm((current) => ({ ...current, audio: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  async function startRecording() {
    setRecordError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const reader = new FileReader();
        reader.onload = () => {
          setAudioName("rekaman-komentar.webm");
          setForm((current) => ({ ...current, audio: String(reader.result) }));
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setRecordError("Microphone tidak bisa diakses. Izinkan akses mic di browser.");
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    recorder.stop();
    setIsRecording(false);
  }

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || (!form.message.trim() && !form.audio)) return;

    setComments((current) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        message: form.message.trim(),
        emoji: form.emoji,
        audio: form.audio,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setForm({ name: "", message: "", emoji: "love", audio: "" });
    setAudioName("");
    setRecordError("");
  }

  function deleteComment(commentId: string) {
    setComments((current) => current.filter((comment) => comment.id !== commentId));
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
            href="/#comments"
            className="rounded-full bg-[#ff5aa9] px-5 py-2 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
          >
            Komentar Landing
          </Link>
        </nav>

        <header className="mt-14 rounded-[2rem] border border-[#ffd3e7] bg-white p-7 shadow-xl shadow-pink-100">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d62a7c]">
            Komentar Pengunjung
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#2b1722] sm:text-5xl">
            Pesan, Suara, dan Emoji Positif
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#6f5361]">
            Halaman ini menampilkan semua komentar pengunjung. Komentar bisa berupa
            teks, suara, atau emoji positif yang lucu.
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={addComment}
            className="rounded-[2rem] border border-[#ffd3e7] bg-white p-6 shadow-xl shadow-pink-100"
          >
            <h2 className="text-2xl font-black text-[#2b1722]">Tambah Komentar</h2>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-5 w-full rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
              placeholder="Nama kamu"
            />
            <textarea
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
              className="mt-3 min-h-32 w-full resize-none rounded-2xl border border-[#f4bdd4] bg-[#fffafd] px-4 py-3 outline-none transition focus:border-[#ff5aa9]"
              placeholder="Tulis komentar..."
            />

            <div className="mt-4">
              <p className="text-sm font-black text-[#5c3c4b]">Emoji positif</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {positiveEmojis.map((emoji) => (
                  <button
                    key={emoji.id}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, emoji: emoji.id }))}
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                      form.emoji === emoji.id
                        ? "bg-[#ff5aa9] text-white"
                        : "bg-[#fff0f7] text-[#c52b75] hover:bg-[#ffe4f0]"
                    }`}
                  >
                    {emoji.symbol} {emoji.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#f4bdd4] bg-[#fffafd] p-5 text-center transition hover:border-[#ff5aa9]">
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="sr-only" />
              <span className="text-sm font-bold text-[#c52b75]">
                {audioName ? `Suara siap dikirim: ${audioName}` : "Upload suara komentar"}
              </span>
            </label>

            <div className="mt-4 rounded-3xl bg-[#fff0f7] p-4">
              <p className="text-sm font-black text-[#5c3c4b]">Rekam langsung dari website</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`rounded-full px-5 py-3 text-sm font-black transition ${
                    isRecording ? "bg-[#2b1722] text-white" : "bg-[#ff5aa9] text-white"
                  }`}
                >
                  {isRecording ? "Stop Rekam" : "Rekam Suara"}
                </button>
                {form.audio ? <audio controls src={form.audio} className="min-w-0 flex-1" /> : null}
              </div>
              {recordError ? (
                <p className="mt-2 text-sm font-bold text-[#c52b75]">{recordError}</p>
              ) : null}
              {isRecording ? (
                <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <span className="recording-dot" />
                  <span className="text-sm font-black text-[#2b1722]">Sedang merekam...</span>
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
              className="mt-5 w-full rounded-full bg-[#ff5aa9] px-6 py-4 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
            >
              Kirim Komentar
            </button>
          </form>

          <div className="max-h-[680px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-3xl border border-[#ffd3e7] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff0f7] text-xl font-black text-[#c52b75]">
                      {positiveEmojis.find((emoji) => emoji.id === comment.emoji)?.symbol || "♡"}
                    </span>
                    <div>
                      <p className="font-black text-[#2b1722]">{comment.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#9a7586]">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="rounded-full border border-[#ffd3e7] px-3 py-1 text-xs font-black text-[#c52b75] transition hover:bg-[#fff0f7]"
                  >
                    Hapus
                  </button>
                </div>
                {comment.message ? (
                  <p className="mt-4 leading-7 text-[#6f5361]">{comment.message}</p>
                ) : null}
                {comment.audio ? <audio controls src={comment.audio} className="mt-4 w-full" /> : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
