import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui';

type Range = 'all' | 'week' | 'month';

async function fetchEntries(uid: string, range: Range) {
  const supabase = await createClient(`entries:${uid}`);

  let q = supabase
    .from('practice_entries')
    .select('id, played_on, duration_min, piece, bpm, tags, rating, notes')
    .eq('user_id', uid)
    .order('played_on', { ascending: false })
    .order('created_at', { ascending: false });

  const today = new Date();

  if (range === 'week') {
    const d = new Date(today);
    d.setDate(d.getDate() - 7);
    q = q.gte('played_on', d.toISOString().slice(0, 10));
  } else if (range === 'month') {
    const d = new Date(today);
    d.setDate(d.getMonth() - 1);
    q = q.gte('played_on', d.toISOString().slice(0, 10));
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

function RangeLink({
  value,
  active,
  children,
}: {
  value: Range;
  active: boolean;
  children: React.ReactNode;
}) {
  const href = value === 'all' ? '/dashboard' : `/dashboard?range=${value}`;
  return (
    <Link
      href={href}
      className={active ? 'underline' : 'text-zinc-400 hover:underline'}
    >
      {children}
    </Link>
  );
}
export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { range: Range };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-neutral-400">
          Please{' '}
          <a href="/login" className="underline">
            sign in
          </a>
        </p>
      </div>
    );
  }

  const uid = user.id;
  const range = (searchParams?.range ?? 'all') as Range;
  const entries = await fetchEntries(uid, range);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center justify-end gap-4">
          <Link href="/entries/new" className="underline">
            New entry
          </Link>
          <form action="/signout" method="post">
            <Button>Sign out</Button>
          </form>
        </div>
      </header>

      <nav className="flex gap-4 text-sm">
        <RangeLink value="all" active={range === 'all'}>
          All
        </RangeLink>
        <RangeLink value="week" active={range === 'week'}>
          This week
        </RangeLink>
        <RangeLink value="month" active={range === 'month'}>
          This month
        </RangeLink>
      </nav>
      <ul className="rounded-lg border border-zinc-800 divide-y divide-zinc-800">
        {entries.length === 0 && (
          <li className="p-4 text-zinc-400">
            No entries yet.{' '}
            <Link className="underline" href="/entries/new">
              Add one
            </Link>
          </li>
        )}
        {entries.map((e) => (
          <li key={e.id} className="p-4">
            <div className="font-medium">
              {e.played_on} - {e.piece}
            </div>
            <div className="text-sm text-zinc-400">
              {e.duration_min} min
              {e.bpm ? ` · ${e.bpm} bpm` : ''}
              {Array.isArray(e.tags) && e.tags.length
                ? ` · ${e.tags.join(', ')}`
                : ''}
              {e.rating ? ` · ★${e.rating}` : ''}
            </div>
            <div>
              <Link
                href={`/entries/${e.id}/edit`}
                className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
