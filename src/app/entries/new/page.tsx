import { createEntry } from './actions';
import EntryForm from '@/components/EntryForm';
export default function NewEntryPage() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const defaults = {
    played_on: todayISO,
    duration_min: '20',
    piece: '',
    bpm: '',
    tags: '',
    rating: '3',
    notes: '',
  };
  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Practice Entry</h1>
      <EntryForm
        action={createEntry}
        defaultValues={defaults}
        submitLabel="Save Entry"
      />
    </div>
  );
}
