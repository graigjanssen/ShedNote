'use server';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { entryCreateSchema } from '@/lib/schemas/entry';
import { createActionClient } from '@/lib/supabase/action-client';

export async function createEntry(formData: FormData) {
  const supabase = await createActionClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    throw new Error('Not authenticated');
  }
  const uid = userData.user.id;

  const raw = {
    played_on: formData.get('played_on'),
    duration_min: formData.get('duration_min'),
    piece: formData.get('piece'),
    bpm: formData.get('bpm'),
    tags: formData.get('tags'),
    rating: formData.get('rating'),
    notes: formData.get('notes'),
  };
  const parsed = entryCreateSchema.parse(raw);

  const { error: insertErr } = await supabase.from('practice_entries').insert({
    user_id: uid,
    played_on: parsed.played_on.toISOString().slice(0, 10),
    duration_min: parsed.duration_min,
    piece: parsed.piece,
    bpm: parsed.bpm ?? null,
    tags: parsed.tags,
    rating: parsed.rating,
    notes: parsed.notes ?? '',
  });
  if (insertErr) {
    throw new Error(insertErr.message);
  }
  revalidateTag(`entries:${uid}`);
  redirect('/dashboard');
}
