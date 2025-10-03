"use client";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { useAuth } from "@/components/AuthProvider";


export default function Home() {
  const { user, loading } = useAuth();
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Glow accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/20 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[110px]" />
      </div>

      <main className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-6 py-24 text-center sm:gap-10 sm:py-28">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Adaptive UI Research Assistant
          </span>
        </h1>
        <p className="max-w-2xl text-balance text-slate-300 sm:text-lg">
          Measure attention and personalize the learning experience in real time. Sign in to begin, or jump straight into the attention test if you’re already signed in.
        </p>

        {user ? (
          <>
            <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
              Signed in as <span className="font-semibold text-white">{user.email || user.displayName}</span>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/attention"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Take the Test
              </Link>
              <SignOutButton className="inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:ring-offset-2 focus:ring-offset-slate-900" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Sign in to continue
            </Link>
            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                <div className="mb-1 text-sm font-semibold text-white">Real-time Focus</div>
                <div className="text-sm text-slate-300">Capture attention signals to adapt content delivery.</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                <div className="mb-1 text-sm font-semibold text-white">Personalised UI</div>
                <div className="text-sm text-slate-300">Tailor components based on cognitive load and progress.</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                <div className="mb-1 text-sm font-semibold text-white">Seamless Experience</div>
                <div className="text-sm text-slate-300">Designed for clarity, speed, and accessibility.</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
