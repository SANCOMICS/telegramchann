// src/pages/edit/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const REACTIONS: Record<string, keyof MsgReactions> = {
  "🤯": "reactMindBlown",
  "🔥": "reactFire",
  "💯": "reactHundred",
  "💨": "reactDash",
  "❤️": "reactHeart",
};

type MsgReactions = {
  reactMindBlown: number;
  reactFire: number;
  reactHundred: number;
  reactDash: number;
  reactHeart: number;
};

export default function EditMessage() {
  const router = useRouter();
  const { id } = router.query;

  const [content, setContent] = useState("");
  const [views, setViews] = useState(0);
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("text");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reactions, setReactions] = useState<MsgReactions>({
    reactMindBlown: 0,
    reactFire: 0,
    reactHundred: 0,
    reactDash: 0,
    reactHeart: 0,
  });

  // ✅ Load existing message
  useEffect(() => {
    if (!id) return;
    fetch(`/api/messages?id=${id}`)
      .then((res) => res.json())
      .then((msg) => {
        setContent(msg.content || "");
        setViews(msg.views || 0);
        setMediaUrl(msg.mediaUrl || "");
        setType(msg.type || "text");

        if (msg.createdAt) {
          const d = new Date(msg.createdAt);
          if (!isNaN(d.getTime())) {
            setDate(d.toISOString().split("T")[0]);
            setTime(d.toTimeString().slice(0, 5));
          }
        }

       setReactions({
          reactMindBlown: msg.reactMindBlown ?? reactions.reactMindBlown,
          reactFire: msg.reactFire ?? reactions.reactFire,
          reactHundred: msg.reactHundred ?? reactions.reactHundred,
          reactDash: msg.reactDash ?? reactions.reactDash,
          reactHeart: msg.reactHeart ?? reactions.reactHeart,
        });

      });
  }, [id]);

  // ✅ Save updates
  const save = async () => {
    let finalUrl = mediaUrl;

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
      finalUrl = url;
    }

    const createdAt =
      date && time
        ? new Date(`${date}T${time}`).toISOString()
        : new Date().toISOString();

    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        content,
        views,
        mediaUrl: finalUrl,
        type,
        createdAt,
        ...reactions, // ✅ spread reaction columns correctly
      }),
    });

    router.push("/charrrdmin");
  };

  // ✅ Delete message
  const del = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    router.push("/charrrdmin");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-bold">Edit Message {id}</h1>

      {/* Preview */}
      <div className="p-3 rounded bg-neutral-900 space-y-2">
        {mediaUrl &&
          (type === "image" ? (
            <img src={mediaUrl} alt="preview" className="rounded max-w-full" />
          ) : (
            <video src={mediaUrl} controls className="rounded max-w-full" />
          ))}
        {content && <p className="text-neutral-200">{content}</p>}
        <p className="text-xs text-neutral-400">
          {date} {time} • 👁 {views}
        </p>
        <div className="flex gap-2 text-sm text-neutral-300">
          {Object.entries(REACTIONS).map(([emoji, key]) =>
            reactions[key] > 0 ? (
              <span key={emoji}>
                {emoji} {reactions[key]}
              </span>
            ) : null
          )}
        </div>
      </div>

      {/* Content */}
      <textarea
        className="w-full border p-2 bg-neutral-900 text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Message text"
      />

      {/* Views */}
      <input
        type="number"
        className="w-full border p-2 bg-neutral-900 text-white"
        value={views}
        onChange={(e) => setViews(Number(e.target.value))}
        placeholder="View count"
      />

      {/* Media */}
      <input
        type="text"
        className="w-full border p-2 bg-neutral-900 text-white"
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        placeholder="Existing media URL"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm text-neutral-400"
      />

      {/* Type */}
      <select
        className="w-full border p-2 bg-neutral-900 text-white"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>

      {/* Date + Time */}
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 border p-2 bg-neutral-900 text-white"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 border p-2 bg-neutral-900 text-white"
        />
      </div>

      {/* Reactions */}
      <div className="space-y-2">
        <h2 className="font-semibold">Reactions</h2>
        {Object.entries(REACTIONS).map(([emoji, key]) => (
          <div key={emoji} className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <input
              type="number"
              value={reactions[key]}
              onChange={(e) =>
                setReactions({
                  ...reactions,
                  [key]: Number(e.target.value),
                })
              }
              className="w-24 border p-1 bg-neutral-900 text-white"
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={save} className="px-4 py-2 bg-sky-600 rounded">
          Save
        </button>
        <button onClick={del} className="px-4 py-2 bg-red-600 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}
