// src/app/loading.tsx
import AppHeader from '@/components/AppHeader';
import { cn } from '@/lib/cn';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        {/* Skeleton header */}
        <section className="space-y-2 border-b border-zinc-800 pb-4">
          <div className="h-5 w-40 rounded bg-zinc-800 animate-pulse" />
          <div className="h-3 w-64 rounded bg-zinc-900 animate-pulse" />
        </section>

        {/* Skeleton filters */}
        <section className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <SkeletonPill />
            <SkeletonPill />
            <SkeletonPill />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SkeletonPill />
            <SkeletonPill />
            <SkeletonPill />
          </div>
        </section>

        {/* Skeleton list */}
        <section className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 w-48 rounded bg-zinc-800 animate-pulse" />
                <div className="h-3 w-64 rounded bg-zinc-900 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <span
                      key={j}
                      className="h-2 w-2 rounded-full bg-amber-400/40"
                    />
                  ))}
                </div>
                <div className="h-7 w-16 rounded bg-zinc-800 animate-pulse" />
              </div>
            </div>
          ))}
        </section>

        {/* Optional spinner */}
        <div className="flex items-center justify-center pt-4">
          <div className="h-6 w-6 animate-spin rounded-full border border-zinc-700 border-t-emerald-400" />
        </div>
      </main>
    </div>
  );
}

function SkeletonPill() {
  return (
    <span className="inline-flex h-6 w-20 items-center rounded-full bg-zinc-800/80 animate-pulse" />
  );
}
