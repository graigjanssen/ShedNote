import { createClient } from '@/lib/supabase/server';
import { deleteEntry } from '@/app/entries/[id]/edit/actions';
import Link from 'next/link';
import { Button } from '@/components/ui';
import DeleteEntryButton from '@/components/DeleteEntryButton';
import { Plus, LogOut, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Range = 'all' | 'week' | 'month';
type Sort = 'played_desc' | 'played_asc' | 'duration_desc';

type PracticeEntry = {
  id: string;
  played_on: string | null;
  duration_min: number | null;
  piece: string | null;
  bpm: number | null;
  tags: string[] | null;
  rating: number;
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
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Please{' '}
          <a href="/login" className="underline">
            sign in
          </a>{' '}
          to view your practice log.
        </p>
      </div>
    );
  }

  const range = parseRange(searchParams?.range);
  const sort = parseSort(searchParams?.sort);

  const entries = await fetchEntries(user.id, range, sort);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col items-start justify-between gap-4 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track your practice sessions and see how your playing evolves over
            time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/entries/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-100 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New entry</span>
          </Link>
          <form action="/signout" method="post">
            <Button size="sm" className="inline-flex items-center gap-1.5">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Sign out</span>
            </Button>
          </form>
        </div>
      </header>

      <FilterSortControls range={range} sort={sort} />

      <section
        aria-label="Practice entries"
        className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950/40"
      >
        {entries.length === 0 ? (
          <div className="px-4 py-10 text-sm text-zinc-400">
            <p>No entries yet.</p>
            <p className="mt-2">
              <Link
                href="/entries/new"
                className="underline underline-offset-4"
              >
                Add your first practice session
              </Link>{' '}
              to get started.
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-zinc-800">
            {entries.map((entry) => (
              <DashboardEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type FilterSortControlsProps = {
  range: Range;
  sort: Sort;
};

function FilterSortControls({ range, sort }: FilterSortControlsProps) {
  function makeHref(nextRange: Range, nextSort: Sort) {
    const params = new URLSearchParams();
    if (nextRange !== 'all') params.set('range', nextRange);
    if (nextSort !== 'played_desc') params.set('sort', nextSort);
    const query = params.toString();
    return query ? `/dashboard?${query}` : '/dashboard';
  }

  const rangeOptions: { value: Range; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
  ];

  const sortOptions: { value: Sort; label: string }[] = [
    { value: 'played_desc', label: 'Newest' },
    { value: 'played_asc', label: 'Oldest' },
    { value: 'duration_desc', label: 'Longest' },
  ];

  return (
    <div className="mt-2 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex rounded-full bg-zinc-900/80 p-1">
        {rangeOptions.map((opt) => {
          const active = opt.value === range;
          return (
            <Link
              key={opt.value}
              href={makeHref(opt.value, sort)}
              className={cn(
                'px-3 py-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                active
                  ? 'bg-zinc-500 text-zinc-50'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-50'
              )}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-zinc-400">Sort by</span>
        <div className="inline-flex rounded-full bg-zinc-900/80 p-1">
          {sortOptions.map((opt) => {
            const active = opt.value === sort;
            return (
              <Link
                key={opt.value}
                href={makeHref(range, opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                  active
                    ? 'bg-zinc-500 text-zinc-50'
                    : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-50'
                )}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type DashboardEntryRowProps = {
  entry: PracticeEntry;
};

function DashboardEntryRow({ entry }: DashboardEntryRowProps) {
  const dateLabel = entry.played_on
    ? new Date(entry.played_on + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date';

  const durationLabel =
    entry.duration_min && entry.duration_min > 0
      ? `${entry.duration_min} min`
      : '—';

  const deleteFormId = `delete-entry-${entry.id}`;

  return (
    <li className="flex flex-col gap-3 px-4 py-3 hover:bg-zinc-900/60 focus-within:bg-zinc-900/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
          <span>{dateLabel}</span>
          {entry.bpm && (
            <span
              aria-label={`Tempo ${entry.bpm} beats per minute`}
              className="before:content-['•'] before:mx-1"
            >
              {entry.bpm} bpm
            </span>
          )}
        </div>
        <div className="mt-1 truncate text-sm font-medium text-zinc-50">
          {entry.piece || '(Untitled piece)'}
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
      <div className="flex items-center gap-6 self-stretch sm:self-auto sm:pl-4">
        <div className="flex flex-col items-end gap-1 text-[11px] text-zinc-400">
          <span>Duration</span>
          <span className="text-sm font-medium text-zinc-50">
            {durationLabel}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="sr-only">Rating</span>
          <RatingDisplay rating={entry.rating} />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/entries/${entry.id}/edit`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-zinc-50 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Edit entry"
            title="Edit"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>

          <form id={deleteFormId} action={deleteEntry}>
            <input type="hidden" name="id" value={entry.id} />
            <DeleteEntryButton
              formId={deleteFormId}
              label="Delete"
              size="sm"
              fullWidth={false}
              iconOnly
              ariaLabel="Delete"
            />
          </form>
        </div>
      </div>
    </li>
  );
}

type RatingDisplayProps = {
  rating: number;
};

function RatingDisplay({ rating }: RatingDisplayProps) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating || 0)));
  const label = `Rating: ${clamped} out of 5`;

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              'h-2 w-2 rounded-full border border-amber-400',
              n <= clamped ? 'bg-amber-400' : 'bg-transparent'
            )}
          />
        ))}
      </div>
    </div>
  );
}
