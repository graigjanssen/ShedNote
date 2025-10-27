'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entryCreateSchema } from '@/lib/schemas/entry';
import type { z } from 'zod';
import { Label, Input, Textarea, Button } from '@/components/ui';
import { toast } from 'sonner';

// Shapes: raw input vs parsed output (RHF supports 3 generics)
type FormInput = z.input<typeof entryCreateSchema>;
type FormOutput = z.output<typeof entryCreateSchema>;

export default function NewEntryForm({
  action,
}: {
  action: (fd: FormData) => Promise<void>; // server action
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const todayISO = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(entryCreateSchema),
    defaultValues: {
      played_on: todayISO, // string for <input type="date">
      duration_min: '20',
      piece: '',
      bpm: '',
      tags: '',
      rating: '3',
      notes: '',
    },
    mode: 'onBlur',
  });

  // When RHF validation passes, submit the native form (which hits the server action).
  const onValid = () => {
    try {
      formRef.current?.requestSubmit();
    } catch (e: any) {
      toast.error(e?.message || 'Could not submit form');
    }
  };

  return (
    // Bind the Server Action here — browser will send FormData to the server
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="played_on">Date</Label>
        <Input id="played_on" type="date" {...register('played_on')} />
        {errors.played_on && (
          <p className="text-sm text-red-400">
            {String(errors.played_on.message)}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="duration_min">Duration (min)</Label>
        <Input
          id="duration_min"
          type="number"
          inputMode="numeric"
          {...register('duration_min')}
        />
        {errors.duration_min && (
          <p className="text-sm text-red-400">
            {String(errors.duration_min.message)}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="piece">Piece / Focus</Label>
        <Input id="piece" type="text" {...register('piece')} />
        {errors.piece && (
          <p className="text-sm text-red-400">
            {errors.piece.message as string}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bpm">BPM (optional)</Label>
        <Input
          id="bpm"
          type="number"
          inputMode="numeric"
          {...register('bpm')}
        />
        {errors.bpm && (
          <p className="text-sm text-red-400">{String(errors.bpm.message)}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          type="text"
          placeholder="warmup, technique"
          {...register('tags')}
        />
        {errors.tags && (
          <p className="text-sm text-red-400">{String(errors.tags.message)}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rating">Rating (1–5)</Label>
        <Input
          id="rating"
          type="number"
          inputMode="numeric"
          {...register('rating')}
        />
        {errors.rating && (
          <p className="text-sm text-red-400">
            {String(errors.rating.message)}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...register('notes')} />
        {errors.notes && (
          <p className="text-sm text-red-400">{String(errors.notes.message)}</p>
        )}
      </div>

      {/* Use type="button" so clicking doesn’t submit until RHF says it’s valid */}
      <Button
        type="button"
        onClick={handleSubmit(onValid, () => {
          toast.error('Please fix the highlighted errors.');
        })}
        className="w-full"
      >
        Save Entry
      </Button>
    </form>
  );
}
