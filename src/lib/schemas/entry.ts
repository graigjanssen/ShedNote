import { z } from 'zod';

const tagsFromComma = z
  .string()
  .trim()
  .transform((s) =>
    s.length === 0
      ? []
      : s
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
  );

export const entryCreateSchema = z.object({
  played_on: z.coerce.date(),
  duration_min: z.coerce.number().int().min(1),
  piece: z.string().trim().min(1),
  bpm: z.coerce
    .number()
    .int()
    .min(1)
    .max(400)
    .optional()
    .or(z.literal(NaN))
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  tags: tagsFromComma,
  rating: z.coerce.number().min(1).max(5),
  notes: z.string().trim().optional().default(''),
});

export type EntryCreateInput = z.infer<typeof entryCreateSchema>;
