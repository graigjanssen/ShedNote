import { createEntry } from './actions';
import EntryForm from '@/components/EntryForm';
import AppHeader from '@/components/AppHeader';

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
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AppHeader />
      <main className="mx-auto max-w-xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-50">
          New Practice Entry
        </h1>
        <EntryForm
          action={createEntry}
          defaultValues={defaults}
          submitLabel="Save Entry"
        />
      </main>
    </div>
  );
}
