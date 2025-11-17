'use client';
import * as React from 'react';
import { Button } from './ui';
export default function DeleteEntryButton({ formId }: { formId: string }) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  function onClick() {
    setOpen(true);
  }
  function onConfirm() {
    setBusy(true);
    try {
      (
        document.getElementById(formId) as HTMLFormElement | null
      )?.requestSubmit();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={onClick}
        disabled={busy}
        variant="danger"
        className="w-full"
      >
        {busy ? 'Deleting...' : 'Delete'}
      </Button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          aria-describedby="delete-desc"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
            <h2
              id="delete-title"
              className="mb-1 text-lg font-semibold text-zinc-100"
            >
              Delete entry?
            </h2>
            <p id="delete-desc" className="mb-4 text-sm text-zinc-300">
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                variant="danger"
              >
                {busy ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
