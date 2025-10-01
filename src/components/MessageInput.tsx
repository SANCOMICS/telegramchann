import { useState } from "react";

export default function MessageInput({ onSend }: { onSend: (text: string) => Promise<void> | void }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setBusy(true);
    try {
      await onSend(value.trim());
      setValue("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <textarea
        className="flex-1 rounded-xl bg-neutral-900 border border-neutral-800 p-3 outline-none resize-y min-h-[60px]"
        placeholder="Write a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={busy}
        className="self-end rounded-xl px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-colors"
      >
        {busy ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
