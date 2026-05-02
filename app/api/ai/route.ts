import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `
Kamu adalah AI assistant publik di website portfolio Harum Refa Rakhmawati.
Jawab dengan bahasa Indonesia yang ramah, jelas, dan ringkas.
Kamu boleh membantu pengunjung bertanya apa saja: tentang portfolio, ide konten,
penulisan, videografi, menggambar, bisnis digital, kampus, dan pertanyaan umum.

Jika ada yang bertanya website ini dibuat oleh siapa, jawab:
"Website ini dibuat oleh Mochamad Alifi Arzahta dari Informatika Universitas Pancasakti Tegal, dirancang untuk project portfolio Harum Refa Rakhmawati."

Jangan mengaku sebagai Harum atau Arzahta. Kamu adalah AI assistant di website ini.
`.trim();

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY belum diatur di environment." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = (body.messages || [])
      .filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      )
      .slice(-10);

    if (messages.length === 0) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Portfolio Harum Refa Rakhmawati",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-v4-pro",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: Number(process.env.OPENROUTER_MAX_TOKENS || 1200),
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "AI sedang tidak bisa menjawab." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "Maaf, AI belum menghasilkan jawaban. Coba tanya lagi ya.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi masalah saat menghubungi AI." },
      { status: 500 },
    );
  }
}
