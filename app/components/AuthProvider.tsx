"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "pending" | "user" | "admin";

interface AuthContextType {
  role: Role;
  loginAsUser: () => void;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: "pending",
  loginAsUser: () => {},
  loginAsAdmin: () => false,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("pending");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedRole = window.sessionStorage.getItem("portfolio_role") as Role;
    if (storedRole === "user" || storedRole === "admin") {
      setRole(storedRole);
    }
  }, []);

  const loginAsUser = () => {
    setRole("user");
    window.sessionStorage.setItem("portfolio_role", "user");
  };

  const loginAsAdmin = (password: string) => {
    if (password === "harum123") {
      setRole("admin");
      window.sessionStorage.setItem("portfolio_role", "admin");
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole("pending");
    window.sessionStorage.removeItem("portfolio_role");
  };

  if (!isClient) return null;

  return (
    <AuthContext.Provider value={{ role, loginAsUser, loginAsAdmin, logout }}>
      <AnimatePresence mode="wait">
        {role === "pending" ? (
          <LoginGate key="login-gate" onUser={loginAsUser} onAdmin={loginAsAdmin} />
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

function LoginGate({
  onUser,
  onAdmin,
}: {
  onUser: () => void;
  onAdmin: (password: string) => boolean;
}) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdmin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-5 bg-gradient-to-br from-pink-50 via-white to-pink-100/50"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 sm:p-10 text-center backdrop-blur-xl shadow-2xl shadow-pink-200/50"
      >
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 shadow-lg shadow-pink-300/50">
          <span className="text-3xl font-black text-white">HRR</span>
        </div>

        <h1 className="mb-2 text-2xl font-black text-foreground-dark">
          Selamat Datang!
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted">
          Siapakah Anda hari ini? Mari sesuaikan pengalaman portofolio Anda.
        </p>

        <AnimatePresence mode="wait">
          {!showAdminLogin ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={onUser}
                className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-foreground-dark shadow-sm transition hover:-translate-y-1 hover:shadow-md border border-pink-100"
              >
                <span>👤</span>
                <span>Masuk sebagai Pengunjung</span>
              </button>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-4 font-bold text-white shadow-lg shadow-pink-200/50 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/80"
              >
                <span>✨</span>
                <span>Masuk sebagai Harum Refa</span>
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="admin-login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleAdminSubmit}
              className="flex flex-col gap-4"
            >
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Masukkan Sandi Rahasia..."
                  className={`w-full rounded-2xl border ${error ? "border-red-400 bg-red-50 text-red-900" : "border-pink-200 bg-white"} px-6 py-4 text-center font-bold outline-none transition focus:border-pink-500`}
                  autoFocus
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-xs font-bold text-red-500"
                    >
                      Sandi salah, coba lagi!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setPassword("");
                    setError(false);
                  }}
                  className="flex-1 rounded-2xl bg-white px-4 py-3 font-bold text-foreground-dark shadow-sm transition hover:-translate-y-0.5 border border-pink-100"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 px-4 py-3 font-bold text-white shadow-lg shadow-pink-200/50 transition hover:-translate-y-0.5"
                >
                  Masuk
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
