'use client';

import { useFormStatus } from 'react-dom';

export default function DeleteConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm('Delete this entry? This cannot be undone.')) {
          e.preventDefault();
        }
      }}
      disabled={pending}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
