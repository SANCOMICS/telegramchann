import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ScrollButtons from "../components/ScrollButtons";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import AdminMessage from "../components/AdminMessage"; // ✅ admin bubble

import { Msg } from "../components/ChannelMessage"; // ✅ import Msg type

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Admin() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("Admin");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [views, setViews] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/messages");
    const data: Msg[] = await res.json();
    setMessages(data);
    setLoading(false);
    queueMicrotask(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function send() {
    if (!content.trim() && !file) return;

    let mediaUrl: string | null = null;
    let type = "text";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        alert("File upload failed");
        return;
      }

      const { url } = await uploadRes.json();
      mediaUrl = url;
      type = file.type.startsWith("video") ? "video" : "image";
    }

    const createdAt =
      date && time
        ? new Date(`${date}T${time}`).toISOString()
        : new Date().toISOString();

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content.trim() || null,
        author,
        createdAt,
        views,
        mediaUrl,
        type,
      }),
    });

    // ✅ clear + reload
    setContent("");
    setFile(null);
    setDate("");
    setTime("");
    setViews(0);
    await load();
  }

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
        <title>Admin • Channel</title>
      </Head>
      <div className="flex justify-center bg-black min-h-screen">
        <div className="flex flex-col h-screen w-full max-w-md border-x border-neutral-800">
          {/* Header */}
          <header className="px-4 py-3 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex flex-col leading-tight">
                <h1 className="text-sm font-bold">Admin Panel</h1>
                <p className="text-[11px] text-neutral-400">{author}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiSearch className="text-xl text-neutral-300 cursor-pointer" />
              <FiMoreVertical className="text-xl text-neutral-300 cursor-pointer" />
            </div>
          </header>

          {/* Messages */}
          <main
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin"
          >
            {loading ? (
              <p className="text-neutral-400">Loading…</p>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="text-neutral-400">No messages yet.</p>
            ) : (
              Object.entries(grouped).map(([date, msgs]) => (
                <div key={date} className="space-y-4">
                  {/* Date separator */}
                  <div className="flex justify-center">
                    <span className="bg-neutral-900 text-neutral-400 text-xs px-3 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  {msgs.map((m) => (
                    <AdminMessage key={m.id} message={m} />
                  ))}
                </div>
              ))
            )}
          </main>
         <ScrollButtons container={listRef as React.RefObject<HTMLDivElement>} />


          {/* Composer */}
          <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-950 space-y-2">
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs text-neutral-400"
              />
              <input
                type="number"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                placeholder="Views"
                className="w-20 rounded-md bg-neutral-900 px-2 py-1 text-xs outline-none"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 rounded-md bg-neutral-900 px-2 py-1 text-xs outline-none"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 rounded-md bg-neutral-900 px-2 py-1 text-xs outline-none"
              />
            </div>
            <div className="flex gap-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a message"
                  rows={1}
                  className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm outline-none resize-none leading-snug"
                  onKeyDown={(e) => {
                    // Press Enter → new line (default)
                    // Press Ctrl+Enter or Cmd+Enter → send message
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button
                  onClick={send}
                  className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-full text-sm"
                >
                  Send
                </button>
              </div>

          </div>
        </div>
      </div>
    </>
  );
}
