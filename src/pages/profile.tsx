import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

type Msg = {
  id: number;
  content?: string | null;
  author: string;
  createdAt: string;
  mediaUrl?: string | null;
  type: string; // "text" | "image" | "video"
};


export default function Profile() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
  async function load() {
    const res = await fetch("/api/messages");
    const data: Msg[] = await res.json();
    setMessages(data);

    // ✅ pick only image messages
    const imgs = data
      .filter((m) => m.type === "image" && m.mediaUrl)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)) // newest first
      .map((m) => m.mediaUrl as string);

    setImages(imgs);
  }
  load();
}, []);


  return (
    <>
      <Head>
        <title>Channel Profile</title>
      </Head>
      <div className="flex justify-center bg-black min-h-screen text-white">
        <div className="w-full max-w-md flex flex-col">
          
          {/* Header with Back */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-10">
            <Link href="/" className="text-sky-400 text-sm">
              ← Back
            </Link>
            <h1 className="text-lg ml-[25vw] font-semibold">Info</h1>
          </div>

          {/* Top Section */}
          <div className="bg-neutral-950 p-6 flex flex-col items-center">
            {/* ✅ Replace "C" gradient with image */}
            <img
              src="https://kushfly.com/wp-content/uploads/2025/03/boutiq-switch-v4.webp"
              alt="Channel Avatar"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />

            <h1 className="text-2xl font-semibold">CARTZ</h1>
            <p className="text-neutral-400 text-sm">3358 subscribers</p>
          </div>


          {/* Buttons */}
          <div className="flex justify-around border-t border-b border-neutral-800 bg-neutral-900 py-4">
            {/* 📢 Open */}
            <Link
              href="/open"
              className="flex flex-col items-center text-sky-400 hover:text-sky-300"
            >
              <span className="text-lg">📢</span>
              <span className="text-xs mt-1">Open</span>
            </Link>

            {/* ⋯ More */}
            <Link
              href="/more"
              className="flex flex-col items-center text-sky-400 hover:text-sky-300"
            >
              <span className="text-lg">⋯</span>
              <span className="text-xs mt-1">More</span>
            </Link>
          </div>

          {/* Info */}
          <div className="p-4 border-b border-neutral-800">
            <p className="text-sm mb-2">
              Tapn for delivery/shipping worldwide 📱
            </p>
            <p className="text-xs text-sky-400">@Cartz1234</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-around border-b border-neutral-800 bg-neutral-950">
            <div className="flex-1 text-center py-3 font-medium text-sky-400 border-b-2 border-sky-400">
              Media
            </div>
          </div>

          {/* Media grid */}
          <div className="grid grid-cols-3 gap-1 p-1 flex-1 overflow-y-auto">
              {images.length === 0 ? (
                <p className="col-span-3 text-center text-neutral-500 py-6">
                  No media yet
                </p>
              ) : (
                images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="media"
                    className="w-full h-32 object-cover"
                  />
                ))
              )}
            </div>

        </div>
      </div>
    </>
  );
}
