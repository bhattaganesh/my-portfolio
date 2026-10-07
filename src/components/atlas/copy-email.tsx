'use client';

import { useRef, useState } from 'react';

/**
 * Shows an email address as selectable text with a copy button. If the clipboard is refused,
 * the address is selected so the visitor can copy it themselves.
 */
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('');
  const textRef = useRef<HTMLSpanElement>(null);

  const selectText = () => {
    const node = textRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('Email address copied.');
    } catch {
      selectText();
      setStatus('Copying was blocked. The address is selected; press Ctrl+C or ⌘C to copy it.');
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-paper px-4 py-3">
        <span ref={textRef} className="font-mono text-[15px] break-all select-all">
          {email}
        </span>
        <button type="button" onClick={copy} className="min-h-11 rounded-full border border-rule px-4 text-sm font-semibold hover:border-ink">
          Copy
        </button>
      </div>
      <p role="status" className="min-h-6 text-sm text-muted">
        {status}
      </p>
    </div>
  );
}
