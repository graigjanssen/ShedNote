'use client';

import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './ui';
import { cn } from '@/lib/cn';

type DeleteEntryButtonProps = {
  formId: string;
  label?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  iconOnly?: boolean;
  ariaLabel?: string;
  className?: string;
  variant?: string; // pass through to Button, defaults to 'danger'
};

export default function DeleteEntryButton({
  formId,
  label = 'Delete entry',
  size = 'md',
  fullWidth = true,
  iconOnly = false,
  ariaLabel,
  className,
  variant = 'danger',
}: DeleteEntryButtonProps) {
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

  function onCancel() {
    if (busy) return;
    setOpen(false);
  }

  const effectiveLabel = ariaLabel || label;

  return (
    <>
      <Button
        type="button"
        onClick={onClick}
        disabled={busy}
        variant="danger"
        size={size}
        fullWidth={fullWidth}
        className={cn(
          iconOnly &&
            'h-8 w-8 min-w-0 rounded-full p-0 inline-flex items-center justify-center',
          className
        )}
        aria-label={effectiveLabel}
        title={effectiveLabel}
      >
        {iconOnly ? (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        ) : busy ? (
          'Deleting…'
        ) : (
          label
        )}
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
            aria-hidden="true"
            onClick={onCancel}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
            <h2
              id="delete-title"
              className="mb-2 text-sm font-semibold text-zinc-100"
            >
              Delete entry?
            </h2>
            <p id="delete-desc" className="mb-4 text-xs text-zinc-400">
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                variant="danger"
                size="sm"
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
