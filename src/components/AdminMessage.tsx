// src/components/AdminMessage.tsx
import React from "react";

export type Msg = {
  id: number;
  author: string;
  content?: string | null;
  mediaUrl?: string | null;
  type: string;
  views: number;
  createdAt: string;

  reactMindBlown: number;
  reactFire: number;
  reactHundred: number;
  reactFlex: number;
  reactDash: number;
  reactHeart: number;
};

const REACTIONS: { emoji: string; key: keyof Msg }[] = [
  { emoji: "🤯", key: "reactMindBlown" },
  { emoji: "🔥", key: "reactFire" },
  { emoji: "💯", key: "reactHundred" },
  { emoji: "💪", key: "reactFlex" },
  { emoji: "💨", key: "reactDash" },
  { emoji: "❤️", key: "reactHeart" },
];

// ✅ Utility: turn plain text URLs into <a> links
function linkify(text: string) {
  const pattern =
    /(?:https?:\/\/[^\s]+|www\.[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?)/g;

  const nodes: (string | React.ReactNode)[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const end = pattern.lastIndex;

    // Plain text before link
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    let url = match[0];
    const trimmed = url.replace(/[),.!?;:]+$/g, "");
    const trailing = url.slice(trimmed.length);
    url = trimmed;

    let href = url;
    if (!/^https?:\/\//i.test(href)) href = "https://" + href;

    nodes.push(
      <a
        key={`lnk-${key++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-200 hover:text-blue-300 break-words"
      >
        {url}
      </a>
    );

    if (trailing) nodes.push(trailing);

    lastIndex = end;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return nodes;
}

export default function AdminMessage({ message }: { message: Msg }) {
  return (
    <div className="flex flex-col max-w-[80%] ml-auto p-2 rounded-2xl bg-sky-600/80 text-white items-end">
      {/* Media */}
      {message.mediaUrl &&
        (message.type === "image" ? (
          <img src={message.mediaUrl} className="rounded-lg max-w-full mb-2" />
        ) : (
          <video
            src={message.mediaUrl}
            controls
            className="rounded-lg max-w-full mb-2"
          />
        ))}

      {/* Content with linkify */}
      {message.content && (
        <div className="px-3 py-2 text-sm whitespace-pre-wrap break-words">
          {linkify(message.content)}
        </div>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-2 text-xs text-blue-100 mt-1">
        <span>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>👁 {message.views ?? 0}</span>
      </div>

      {/* Reaction counts */}
      <div className="flex flex-wrap gap-2 mt-1">
        {REACTIONS.map(({ emoji, key }) => {
          const count = message[key] as number;
          return count > -1 ? (
            <span
              key={key}
              className="flex items-center gap-1 bg-sky-700/70 px-2 py-1 rounded-full text-xs"
            >
              {emoji} {count}
            </span>
          ) : null;
        })}
      </div>

      {/* Edit Button */}
      <button
        className="mt-2 text-xs underline text-blue-200"
        onClick={() => (window.location.href = `/edit/${message.id}`)}
      >
        Edit message
      </button>
    </div>
  );
}
