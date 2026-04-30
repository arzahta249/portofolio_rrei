import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harum Refa Rakhmawati | Portfolio",
  description:
    "Portfolio modern Harum Refa Rakhmawati, mahasiswi Bisnis Digital Universitas Pancasakti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
