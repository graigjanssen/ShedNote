'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { createActionClient } from '@/lib/supabase/action-client';
import { entryCreateSchema } from '@/lib/schemas/entry';

/**
 * Update an existing entry.
 * Accepts the same fields as Create, plus `id`.
 * Uses RLS for row ownership.
 */

export async function updateEntry(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) throw new Error('Missing entry ID');

  const supabase = await createActionClient();

  // Current user (for tag invalidation and safety checks)
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw new Error('Not Authenticated');
  const uid = userData.user.id;

  // Parse/normalize inputs with Zod (same shape as Create)
  const raw = {
    played_on: formData.get('played_on'),
    duration_min: formData.get('duration_min'),
    piece: formData.get('piece'),
    bpm: formData.get('bpm'),
    tags: formData.get('tags') ?? '', // comma string in UI → array via schema
    rating: formData.get('rating'),
    notes: formData.get('notes') ?? '',
  };

  const parsed = entryCreateSchema.parse(raw);

  const { error } = await supabase
    .from('practice_entries')
    .update({
      played_on: parsed.played_on.toISOString().slice(0, 10), // store as yyyy-mm-dd
      duration_min: parsed.duration_min,
      piece: parsed.piece,
      bpm: parsed.bpm ?? null,
      tags: parsed.tags,
      rating: parsed.rating,
      notes: parsed.notes ?? '',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  // Revalidate the user-scoped dashboard tag (matches your server client tagging)
  revalidateTag(`entries${uid}`);
  redirect('/');
}

/**
 * Delete an entry by id.
 */
export async function deleteEntry(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) throw new Error('Missing entry ID');

  const supabase = await createActionClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw new Error('Not Authenticated');
  const uid = userData.user.id;

  const { error } = await supabase
    .from('practice_entries')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidateTag(`entries:${uid}`);
  redirect('/');
}
