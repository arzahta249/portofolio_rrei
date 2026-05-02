"use client";

import { FormEvent, useEffect, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const AI_HISTORY_KEY = "harum-ai-history";

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hai, aku AI assistant di portfolio Harum. Kamu bisa tanya tentang karya, ide konten, penulisan, video, gambar, bisnis digital, atau hal umum lainnya.",
};

const aiCapabilities = [
  "Menjelaskan isi portfolio Harum",
  "Membantu ide caption dan artikel",
  "Memberi ide video pendek",
  "Membantu konsep gambar atau moodboard",
  "Menjawab pertanyaan umum pengunjung",
];

function ButterflyIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      <path
        d="M30 31C14 45 4 34 8 20c4-13 20-9 22 11Z"
        fill="#ffd3e7"
      />
      <path
        d="M34 31c16 14 26 3 22-11-4-13-20-9-22 11Z"
        fill="#bde9ff"
      />
      <path d="M30 32C17 50 6 43 9 31c2-11 16-9 21 1Z" fill="#ff5aa9" />
      <path d="M34 32c13 18 24 11 21-1-2-11-16-9-21 1Z" fill="#d8c7ff" />
      <path
        d="M32 19v27"
        fill="none"
        stroke="#2b1722"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M28 17c-5-7-12-6-15-2M36 17c5-7 12-6 15-2"
        fill="none"
        stroke="#2b1722"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function ButterflyLoader() {
  return (
    <ButterflyIcon className="butterfly-loader h-8 w-8" />
  );
}

function readHistory() {
  if (typeof window === "undefined") return [starterMessage];

  try {
    const saved = window.localStorage.getItem(AI_HISTORY_KEY);
    const parsed = saved ? (JSON.parse(saved) as ChatMessage[]) : [];
    return parsed.length > 0 ? parsed : [starterMessage];
  } catch {
    return [starterMessage];
  }
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryReady, setIsHistoryReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setMessages(readHistory());
      setIsHistoryReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isHistoryReady) return;
    window.localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(messages));
  }, [isHistoryReady, messages]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "AI sedang tidak bisa menjawab.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "Maaf, aku belum punya jawaban untuk itu.",
        },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI sedang bermasalah.");
    } finally {
      setIsLoading(false);
    }
  }

  function clearHistory() {
    setMessages([starterMessage]);
    setError("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-7 sm:right-7">
      {isOpen ? (
        <section className="mb-4 flex max-h-[78vh] w-[calc(100vw-2.5rem)] max-w-[420px] flex-col rounded-[2rem] border border-[#ffd3e7] bg-white shadow-2xl shadow-pink-200">
          <header className="flex items-center justify-between gap-3 border-b border-[#ffd3e7] p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f7] text-[#d62a7c]">
                <ButterflyIcon />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d62a7c]">
                  AI Harum
                </p>
                <p className="text-xs font-bold text-[#8b6577]">Riwayat tersimpan otomatis</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup AI"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f7] text-[#c52b75]"
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
          </header>

          <div className="border-b border-[#ffd3e7] p-4">
            <p className="text-sm font-black text-[#2b1722]">AI ini bisa bantu:</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {aiCapabilities.map((capability) => (
                <span
                  key={capability}
                  className="shrink-0 rounded-full bg-[#fff0f7] px-3 py-2 text-xs font-bold text-[#c52b75]"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pr-3 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-3xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto max-w-[86%] bg-[#ff5aa9] text-white"
                    : "mr-auto max-w-[88%] bg-[#fff0f7] text-[#34212b]"
                }`}
              >
                <p className="whitespace-pre-line leading-6">{message.content}</p>
              </div>
            ))}

            {isLoading ? (
              <div className="mr-auto max-w-[88%] rounded-3xl bg-[#fff0f7] px-4 py-3 text-[#c52b75]">
                <div className="flex items-center gap-3">
                  <ButterflyLoader />
                  <span className="text-sm font-black">AI sedang berpikir...</span>
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="mx-4 rounded-2xl bg-[#fff0f7] px-4 py-3 text-sm font-bold text-[#c52b75]">
              {error}
            </p>
          ) : null}

          <form onSubmit={sendMessage} className="grid gap-3 p-4">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-12 rounded-full border border-[#f4bdd4] bg-[#fffafd] px-5 py-3 outline-none transition focus:border-[#ff5aa9]"
              placeholder="Tanyakan sesuatu ke AI..."
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-full bg-[#2b1722] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Kirim
              </button>
              <button
                type="button"
                onClick={clearHistory}
                className="rounded-full border border-[#ffd3e7] px-5 py-3 text-sm font-black text-[#c52b75] transition hover:bg-[#fff0f7]"
              >
                Hapus Riwayat
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Buka AI assistant"
        className="ai-butterfly-button grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-white text-white shadow-2xl shadow-pink-300 transition hover:-translate-y-1"
      >
        <ButterflyIcon className="h-11 w-11" />
      </button>
    </div>
  );
}
