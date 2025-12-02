// src/components/AppHeader.tsx
import Link from 'next/link';
import { ShedNoteLogo } from './ShedNoteLogo';
import { Button } from './ui';
import { Plus, LogOut } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4">
        <ShedNoteLogo />

        <div className="flex items-center gap-3">
          <Link
            href="/entries/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-sm transition hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New entry</span>
          </Link>

          <form action="/signout" method="post">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-zinc-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Sign out</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
