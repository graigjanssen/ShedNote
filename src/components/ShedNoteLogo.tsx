import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';

export function ShedNoteLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-3 text-sm no-underline text-zinc-100',
        className
      )}
      aria-label="ShedNote Home"
    >
      {/* Icon image container */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-2xl overflow-hidden',
          'bg-zinc-900 border border-zinc-700',
          'shadow-[0_0_8px_rgba(16,185,129,0.25)] group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]',
          'transition-shadow',
          '-translate-y-[8px]' // optical tweak: lift logo relative to wordmark
        )}
      >
        <Image
          src="/brand/shednote-logo.png"
          alt="ShedNote logo"
          width={60}
          height={60}
          className="h-10 w-10 object-contain"
          priority
        />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-tight">
        <span className="text-[0.75rem] uppercase tracking-[0.22em] font-semibold">
          Shed
          <span className="text-emerald-400">Note</span>
        </span>
        <span className="text-[0.68rem] text-zinc-500">Practice log</span>
      </div>
    </Link>
  );
}
