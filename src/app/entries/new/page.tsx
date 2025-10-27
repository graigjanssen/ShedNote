import { createEntry } from './actions';

export default function NewEntryPage() {
  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Practice Entry</h1>
      <NewEntryForm action={createEntry} />
    </div>
  );
}

import NewEntryForm from './NewEntryForm';
