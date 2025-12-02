import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AppHeader from '@/components/AppHeader';
import EntryForm from '@/components/EntryForm';
import DeleteEntryButton from '@/components/DeleteEntryButton';
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
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: entry, error } = await supabase
    .from('practice_entries')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !entry) {
    return notFound();
  }

  const defaults = {
    played_on: entry.played_on ?? '',
    duration_min: entry.duration_min?.toString() ?? '',
    piece: entry.piece ?? '',
    bpm: entry.bpm?.toString() ?? '',
    tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : '',
    rating: (entry.rating ?? 3).toString(),
    notes: entry.notes ?? '',
  };

  const deleteFormId = `delete-entry-${entry.id}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Edit Entry</h1>
          <Link
            href="/"
            className="text-sm text-zinc-300 underline underline-offset-4 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        <EntryForm
          action={updateEntry}
          defaultValues={defaults}
          submitLabel="Save Changes"
          secondaryAction={
            <form
              id={deleteFormId}
              action={deleteEntry}
              className="w-full max-w-xs"
            >
              <input type="hidden" name="id" value={entry.id} />
              <DeleteEntryButton
                formId={deleteFormId}
                size="sm"
                ariaLabel="Delete entry"
                className="w-full"
              />
            </form>
          }
        />
      </main>
    </div>
  );
}
