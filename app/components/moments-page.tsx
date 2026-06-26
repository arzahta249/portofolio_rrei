"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Moment, starterMoments } from "../data/portfolio";
import { readMoments, saveMoments } from "../lib/portfolio-storage";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(new Date(value));
}

export function MomentsPage() {
  const { theme } = useTheme();
  const { role } = useAuth();
  const [moments, setMoments] = useState<Moment[]>(starterMoments);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);

  function deleteMoment(id: string) {
    const updated = moments.filter(m => m.id !== id);
    setMoments(updated);
    saveMoments(updated);
    setSelectedMoment(null);
  }

  useEffect(() => {
    queueMicrotask(() => {
      setMoments(readMoments());
      setIsStorageReady(true);
    });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-24">
      {/* Navbar Minimalis */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-sm font-black text-primary-text hover:text-primary transition">
            &larr; Kembali
          </Link>
          <span className="text-base font-black tracking-[0.18em] text-foreground-dark">
            HRR
          </span>
          <div className="w-16" /> {/* Spacer untuk menyeimbangkan flex space-between */}
        </div>
      </nav>

      {/* Header Halaman */}
      <section className="px-5 pt-32 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-text">
              Keseharian & Inspirasi
            </p>
            <h1 className="mt-4 text-5xl font-black text-foreground-dark sm:text-6xl lg:text-7xl">
              Semua Moment
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Kumpulan cerita, ide acak, dan proses kreatif di balik layar.
              Semua hal kecil yang membuat hari menjadi lebih berwarna.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Moments (Masonry Style / Auto Fit) */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {moments.map((moment, i) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <article
                  onClick={() => setSelectedMoment(moment)}
                  className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-4 backdrop-blur-xl shadow-lg shadow-[color:var(--shadow-glow)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60"
                >
                  <div className="relative w-full overflow-hidden rounded-[2rem] bg-soft-bg mb-4">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100 z-10 mix-blend-overlay" />
                    {moment.mediaType === "video" ? (
                      <video src={moment.mediaUrl} className="w-full object-cover rounded-[2rem]" />
                    ) : (
                      <img src={moment.mediaUrl} alt={moment.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-[2rem]" />
                    )}
                    {moment.mediaType === "video" && (
                      <div className="absolute top-4 right-4 z-20 rounded-full bg-black/50 p-2 backdrop-blur-md">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-2">
                    <p className="text-xs font-bold text-primary-text mb-2">{formatDate(moment.executionDate || moment.createdAt)}</p>
                    <h3 className="text-xl font-black text-foreground-dark transition group-hover:text-primary">{moment.title}</h3>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Popup Modal */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            {/* Backdrop Blur */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
              onClick={() => setSelectedMoment(null)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-white/60 bg-white shadow-2xl shadow-pink-200/50 flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedMoment(null)}
                className="absolute top-6 right-6 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/80 backdrop-blur border border-soft-border text-foreground-dark transition hover:bg-soft-bg hover:scale-110 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Media Section */}
              <div className="md:w-3/5 bg-soft-bg flex flex-col items-center justify-center p-4">
                {selectedMoment.mediaType === "video" ? (
                  <video src={selectedMoment.mediaUrl} controls autoPlay className="max-h-[60vh] md:max-h-[75vh] w-full rounded-2xl object-contain shadow-sm" />
                ) : (
                  <img src={selectedMoment.mediaUrl} alt={selectedMoment.title} className="max-h-[60vh] md:max-h-[75vh] w-full rounded-2xl object-contain shadow-sm" />
                )}
                
                {/* Additional Gallery Images */}
                {selectedMoment.gallery && selectedMoment.gallery.length > 0 && (
                  <div className="mt-4 flex w-full gap-3 overflow-x-auto pb-2 snap-x px-2">
                    {selectedMoment.gallery.map((item, idx) => {
                      const itemUrl = typeof item === 'string' ? item : item.url;
                      const itemDesc = typeof item === 'string' ? '' : item.description;
                      return (
                        <div key={idx} className="relative flex flex-col items-center group/gallery snap-center shrink-0">
                          <img 
                            src={itemUrl} 
                            alt={`${selectedMoment.title} - foto ${idx + 1}`}
                            className="h-24 w-auto rounded-xl object-cover border border-white/40 shadow-sm transition group-hover/gallery:brightness-75" 
                          />
                          {itemDesc && (
                            <div className="absolute inset-0 flex items-end p-2 opacity-0 transition-opacity duration-300 group-hover/gallery:opacity-100">
                              <div className="w-full bg-black/60 backdrop-blur-md rounded-lg p-1.5 text-center">
                                <span className="text-[10px] font-medium text-white leading-tight line-clamp-3">{itemDesc}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="md:w-2/5 p-8 sm:p-10 flex flex-col">
                <p className="text-sm font-black uppercase tracking-widest text-primary-text mb-4">
                  {formatDate(selectedMoment.executionDate || selectedMoment.createdAt)}
                </p>
                <h2 className="text-3xl font-black text-foreground-dark mb-6">
                  {selectedMoment.title}
                </h2>
                <div className="w-12 h-1 bg-primary/30 rounded-full mb-6" />
                <div className="flex-grow overflow-y-auto pr-2">
                  <p className="text-base leading-relaxed font-semibold text-foreground-dark mb-4 whitespace-pre-wrap">
                    {selectedMoment.description}
                  </p>
                  {selectedMoment.activityDetails && (
                    <div className="mt-6 pt-6 border-t border-soft-border">
                      <p className="text-sm font-bold text-primary-dark mb-2">Rincian Kegiatan:</p>
                      <p className="text-sm leading-relaxed text-muted whitespace-pre-wrap">
                        {selectedMoment.activityDetails}
                      </p>
                    </div>
                  )}
                  {role === "admin" && (
                    <div className="mt-8 pt-4 border-t border-soft-border">
                      <button
                        onClick={() => deleteMoment(selectedMoment.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100"
                      >
                        Hapus Moment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
