import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import ScrollButtons from "../components/ScrollButtons";
import ChannelMessage, { Msg } from "../components/ChannelMessage";


function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const channelName = process.env.NEXT_PUBLIC_CHANNEL_NAME ?? "Channel";

  async function load(scrollOnFirstLoad = false) {
    const res = await fetch("/api/messages");
    const data: Msg[] = await res.json();

    setMessages(data);
    setLoading(false);

    if (scrollOnFirstLoad) {
      queueMicrotask(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      });
    }
  }

  useEffect(() => {
    // ✅ First load → scroll to bottom
    load(true);

    // ✅ Subsequent polls → just update data, no scroll
    const iv = setInterval(() => load(false), 3000);
    return () => clearInterval(iv);
  }, []);

  // Group messages by date
  const grouped: { [date: string]: Msg[] } = {};
  messages.forEach((m) => {
    const key = formatDate(m.createdAt);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <>
      <Head>
        <title>{channelName}</title>
      </Head>
      <div className="flex justify-center min-h-screen bg-[#17212b]">
        <div className="flex flex-col h-screen w-full max-w-md border-x border-[#1c2733]">
          {/* Header */}
          <header className="px-4 py-3 flex items-center justify-between border-b border-[#1c2733] bg-[#17212b]/95 backdrop-blur sticky top-0 z-10">
            ...
          </header>

          {/* Messages (scrollable) */}
          <main
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin"
          >
            {loading ? (
              <p className="text-neutral-400">Loading messages…</p>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="text-neutral-400">No messages yet.</p>
            ) : (
              Object.entries(grouped).map(([date, msgs]) => (
                <div key={date} className="space-y-4">
                  <div className="flex justify-center">
                    <span className="bg-[#1c2733] text-neutral-400 text-xs px-3 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  {msgs.map((m) => (
                    <ChannelMessage key={m.id} message={m} />
                  ))}
                </div>
              ))
            )}
          </main>

          {/* Scroll buttons */}
          <ScrollButtons container={listRef as React.RefObject<HTMLDivElement>} />

          {/* ✅ Fixed bottom bar */}
          <div className="px-4 py-3 border-t border-[#1c2733] bg-[#17212b] shrink-0">
            <div className="rounded-full bg-[#1c2733] text-neutral-400 px-4 py-2 text-sm text-center">
              You can’t send messages in this channel
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
