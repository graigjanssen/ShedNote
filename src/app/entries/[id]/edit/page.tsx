import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EntryForm from '@/components/EntryForm';
import DeleteEntryButton from '@/components/DeleteEntryButton';
import { Button, Input, Label, Textarea } from '@/components/ui';
import { updateEntry, deleteEntry } from './actions';

type PracticeEntry = {
  id: string;
  user_id: string;
  played_on: string | null; // ISO date (yyyy-mm-dd)
  duration_min: number | null;
  piece: string | null;
  bpm: number | null;
  tags: string[] | null;
  rating: number | null;
  notes: string | null;
};

/**
 * Server Component:
 * - Authenticates user
 * - Fetches entry by id + user ownership
 * - Renders a prefilled form
 * - Posts to server actions for update/delete
 */
export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { id } = await params;
  const supabase = await createClient(); // read-only, tag-aware
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) notFound();
  const uid = userData.user.id;

  // Scope the fetch to the current user for safety (RLS also protects)
  const { data: entry, error } = await supabase
    .from('practice_entries')
    .select(
      'id, user_id, played_on, duration_min, piece, bpm, tags, rating, notes'
    )
    .eq('id', id)
    .eq('user_id', uid)
    .single<PracticeEntry>();

  if (error || !entry) notFound();

  const defaults = {
    played_on: (entry.played_on ?? '').slice(0, 10),
    duration_min: String(entry.duration_min ?? ''),
    piece: entry.piece ?? '',
    bpm: entry.bpm == null ? '' : String(entry.bpm),
    tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : '',
    rating: entry.rating == null ? '3' : String(entry.rating),
    notes: entry.notes ?? '',
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Edit Entry</h1>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-300 underline underline-offset-4 hover:text-white"
        >
          Back to Dashboard
        </Link>
      </div>

      <EntryForm
        action={updateEntry}
        defaultValues={defaults}
        submitLabel="Save Changes"
      />
      {/* DELETE FORM lives here to keep dashboard simple for now */}
      <form id="delete-entry-form" action={deleteEntry} className="mt-3">
        <input type="hidden" name="id" value={entry.id} />
        <DeleteEntryButton formId="delete-entry-form" />
      </form>
    </div>
  );
}
