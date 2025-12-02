// src/app/page.tsx

import { createClient } from '@/lib/supabase/server';
import { deleteEntry } from '@/app/entries/[id]/edit/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import DeleteEntryButton from '@/components/DeleteEntryButton';
import { cn } from '@/lib/cn';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui';

type Range = 'all' | 'week' | 'month';
type Sort = 'played_desc' | 'played_asc' | 'duration_desc';

type PracticeEntry = {
  id: string;
  played_on: string | null;
  duration_min: number | null;
  piece: string | null;
  bpm: number | null;
  tags: string[] | null;
  rating: number | null;
  notes: string | null;
};

function parseRange(raw: string | string[] | undefined): Range {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === 'week' || value === 'month') return value;
  return 'all';
}

function parseSort(raw: string | string[] | undefined): Sort {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === 'played_asc' || value === 'duration_desc') return value;
  return 'played_desc';
}

async function fetchEntries(
  uid: string,
  range: Range,
  sort: Sort
): Promise<PracticeEntry[]> {
  const supabase = await createClient(`entries:${uid}`);

  let query = supabase
    .from('practice_entries')
    .select('id, played_on, duration_min, piece, bpm, tags, rating, notes')
    .eq('user_id', uid);

  const today = new Date();

  if (range === 'week') {
    const d = new Date(today);
    d.setDate(d.getDate() - 7);
    query = query.gte('played_on', d.toISOString().slice(0, 10));
  } else if (range === 'month') {
    const d = new Date(today);
    d.setMonth(d.getMonth() - 1);
    query = query.gte('played_on', d.toISOString().slice(0, 10));
  }

  if (sort === 'played_asc') {
    query = query
      .order('played_on', { ascending: true })
      .order('created_at', { ascending: true });
  } else if (sort === 'duration_desc') {
    query = query
      .order('duration_min', { ascending: false, nullsFirst: false })
      .order('played_on', { ascending: false })
      .order('created_at', { ascending: false });
  } else {
    // played_desc (default)
    query = query
      .order('played_on', { ascending: false })
      .order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as PracticeEntry[];
}

type DashboardPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const range = parseRange(searchParams?.range);
  const sort = parseSort(searchParams?.sort);

  const entries = await fetchEntries(user!.id, range, sort);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AppHeader />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        {/* Title + intro */}
        <section className="flex flex-col gap-2 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-semibold text-zinc-50">Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Track your practice sessions and see how your playing evolves over
            time.
          </p>
        </section>

        {/* Filters + sort */}
        <section className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          {/* Range pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-400">Range:</span>
            {(['all', 'week', 'month'] as Range[]).map((value) => {
              const isActive = range === value;
              const label =
                value === 'all'
                  ? 'All time'
                  : value === 'week'
                  ? 'Last 7 days'
                  : 'Last 30 days';

              const href = `/?range=${value}&sort=${sort}`;
              return (
                <Link
                  key={value}
                  href={href}
                  className={cn(
                    'rounded-full px-3 py-1 transition',
                    'border border-transparent text-zinc-300',
                    'hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-100',
                    isActive &&
                      'border-emerald-500/60 bg-emerald-500/10 text-emerald-100'
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Sort pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-400">Sort:</span>
            {(
              [
                ['played_desc', 'Newest'],
                ['played_asc', 'Oldest'],
                ['duration_desc', 'Longest'],
              ] as [Sort, string][]
            ).map(([value, label]) => {
              const isActive = sort === value;
              const href = `/?range=${range}&sort=${value}`;

              return (
                <Link
                  key={value}
                  href={href}
                  className={cn(
                    'rounded-full px-3 py-1 transition',
                    'border border-transparent text-zinc-300',
                    'hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-100',
                    isActive &&
                      'border-emerald-500/60 bg-emerald-500/10 text-emerald-100'
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Entries list */}
        <section>
          {entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 px-4 py-10 text-sm text-zinc-400">
              <p>No entries yet.</p>
              <p className="mt-2">
                <Link
                  href="/entries/new"
                  className="font-medium text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
                >
                  Add your first practice session
                </Link>{' '}
                to get started.
              </p>
            </div>
          ) : (
            <ul
              role="list"
              className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
            >
              {entries.map((entry) => (
                <DashboardEntryRow key={entry.id} entry={entry} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

type DashboardEntryRowProps = {
  entry: PracticeEntry;
};

function DashboardEntryRow({ entry }: DashboardEntryRowProps) {
  const deleteFormId = `delete-entry-${entry.id}`;

  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      {/* Left: main content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span>
            {entry.played_on
              ? new Date(entry.played_on + 'T00:00:00').toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )
              : 'No date'}
          </span>
          {entry.duration_min != null && (
            <span className="before:mx-1 before:content-['•']">
              {entry.duration_min} min
            </span>
          )}
          {entry.bpm != null && (
            <span className="before:mx-1 before:content-['•']">
              {entry.bpm} bpm
            </span>
          )}
        </div>

        <div className="mt-1 truncate text-sm font-medium text-zinc-50">
          {entry.piece || 'Untitled session'}
        </div>

        {entry.notes && entry.notes.trim().length > 0 && (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
            {entry.notes}
          </p>
        )}

        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-emerald-500/40 bg-emerald-500/5 px-2 py-0.5 text-[11px] text-emerald-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: rating + actions */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <RatingDisplay rating={entry.rating} />

        <div className="flex items-center gap-2">
          {/* Edit: icon-only, same footprint as Delete */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg p-0"
            aria-label="Edit entry"
            title="Edit entry"
          >
            <Link
              href={`/entries/${entry.id}/edit`}
              className="flex h-full w-full items-center justify-center"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>

          {/* Delete: icon-only, same footprint */}
          <form id={deleteFormId} action={deleteEntry}>
            <input type="hidden" name="id" value={entry.id} />
            <DeleteEntryButton
              formId={deleteFormId}
              size="sm"
              iconOnly
              ariaLabel="Delete entry"
              className="h-8 w-8 rounded-lg p-0"
            />
          </form>
        </div>
      </div>
    </li>
  );
}

type RatingDisplayProps = {
  rating: number | null;
};

function RatingDisplay({ rating }: RatingDisplayProps) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating ?? 0)));
  const label = `Rating: ${clamped} out of 5`;

  return (
    <div className="flex items-center gap-1" aria-label={label} title={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={cn(
            'h-2 w-2 rounded-full border border-amber-400',
            n <= clamped ? 'bg-amber-400' : 'bg-transparent'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
