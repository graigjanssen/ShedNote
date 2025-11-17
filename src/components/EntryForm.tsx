'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { entryCreateSchema } from '@/lib/schemas/entry';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label, Input, Textarea, Button } from './ui';
import { toast } from 'sonner';

// Bind to the existing schema I/O pattern
type FormInput = z.input<typeof entryCreateSchema>;
type FormOutput = z.output<typeof entryCreateSchema>;

export default function EntryForm({
  action,
  defaultValues,
  submitLabel = 'Save',
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues: FormInput;
  submitLabel?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(entryCreateSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const onValid = () => {
    // native submit → hits the server action on <form action={...}>
    formRef.current?.requestSubmit();
  };

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {/* played_on */}
      <div>
        <Label htmlFor="played_on">Date</Label>
        <Input
          id="played_on"
          type="date"
          {...register('played_on')}
          aria-invalid={!!errors.played_on || undefined}
        />
        {errors.played_on && (
          <p className="mt-1 text-sm text-red-400">
            {errors.played_on.message as string}
          </p>
        )}
      </div>

      {/* duration_min */}
      <div>
        <Label htmlFor="duration_min">Duration (min)</Label>
        <Input
          id="duration_min"
          type="number"
          inputMode="numeric"
          {...register('duration_min')}
          aria-invalid={!!errors.duration_min || undefined}
        />
        {errors.duration_min && (
          <p className="mt-1 text-sm text-red-400">
            {errors.duration_min.message as string}
          </p>
        )}
      </div>

      {/* piece */}
      <div>
        <Label htmlFor="piece">Piece</Label>
        <Input id="piece" {...register('piece')} />
        {errors.piece && (
          <p className="mt-1 text-sm text-red-400">
            {errors.piece.message as string}
          </p>
        )}
      </div>

      {/* bpm (optional) */}
      <div>
        <Label htmlFor="bpm">BPM (optional)</Label>
        <Input
          id="bpm"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 120"
          {...register('bpm')}
          aria-invalid={!!errors.bpm || undefined}
        />
        {errors.bpm && (
          <p className="mt-1 text-sm text-red-400">
            {errors.bpm.message as string}
          </p>
        )}
      </div>

      {/* tags as comma-separated string */}
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" placeholder="scale, arpeggios" {...register('tags')} />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-400">
            {errors.tags.message as string}
          </p>
        )}
      </div>

      {/* rating 1..5 */}
      <div>
        <Label htmlFor="rating">Rating (1–5)</Label>
        <Input
          id="rating"
          type="number"
          inputMode="numeric"
          min={1}
          max={5}
          {...register('rating')}
          aria-invalid={!!errors.rating || undefined}
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-400">
            {errors.rating.message as string}
          </p>
        )}
      </div>

      {/* notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...register('notes')} />
      </div>

      <Button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit(onValid, () =>
          toast.error('Please fix the highlighted errors.')
        )}
        className="w-full"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
