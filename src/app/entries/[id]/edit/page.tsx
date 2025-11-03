import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DeleteConfirmButton from './DeleteConfirmButton';
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

  // Normalize defaults for inputs
  const playedOn = entry.played_on ?? new Date().toISOString().slice(0, 10);
  const duration = entry.duration_min ?? 0;
  const piece = entry.piece ?? '';
  const bpm = entry.bpm ?? '';
  const tagsComma = (entry.tags ?? []).join(', ');
  const rating = entry.rating ?? 3;
  const notes = entry.notes ?? '';

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

      {/* UPDATE FORM */}
      <form
        action={updateEntry}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow"
      >
        <input type="hidden" name="id" value={entry.id} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="played_on">Date</Label>
            <Input
              id="played_on"
              name="played_on"
              type="date"
              defaultValue={playedOn}
            />
          </div>

          <div>
            <Label htmlFor="duration_min">Minutes</Label>
            <Input
              id="duration_min"
              name="duration_min"
              type="number"
              min={0}
              defaultValue={duration}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="piece">Piece / Focus</Label>
          <Input
            id="piece"
            name="piece"
            defaultValue={piece}
            placeholder="e.g., ii–V–I drills"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="bpm">BPM (optional)</Label>
            <Input
              id="bpm"
              name="bpm"
              type="number"
              min={1}
              max={400}
              defaultValue={bpm as any}
            />
          </div>

          <div>
            <Label htmlFor="rating">Rating (1–5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={5}
              defaultValue={rating}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={tagsComma}
            placeholder="scales, arpeggios"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={5} defaultValue={notes} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
      {/* DELETE FORM lives here to keep dashboard simple for now */}
      <form action={deleteEntry}>
        <input type="hidden" name="id" value={entry.id} />
        <DeleteConfirmButton />
      </form>
    </div>
  );
}
