import { useState, useEffect, useRef } from "react";
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

const REACTIONS = ["🤯", "🔥", "💯", "💪", "💨", "❤️"];

// ✅ Detect URLs and render as <a>
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
        className="underline text-blue-500 hover:text-blue-600 break-words"
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

export default function ChannelMessage({ message }: { message: Msg }) {
  const [showReactions, setShowReactions] = useState(false);
  const [localReactions, setLocalReactions] = useState<Record<string, number>>({
    "🤯": message.reactMindBlown,
    "🔥": message.reactFire,
    "💯": message.reactHundred,
    "💨": message.reactDash,
    "❤️": message.reactHeart,
  });
  const [localViews, setLocalViews] = useState(message.views ?? 0);
  const [myReaction, setMyReaction] = useState<string | null>(null);

  const reactionRef = useRef<HTMLDivElement>(null);

  // ✅ Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        showReactions &&
        reactionRef.current &&
        !reactionRef.current.contains(e.target as Node)
      ) {
        setShowReactions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReactions]);

  // ✅ Track unique views
  useEffect(() => {
    const viewedKey = `viewed-${message.id}`;
    if (!localStorage.getItem(viewedKey)) {
      fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, views: (localViews ?? 0) + 1 }),
      }).then(() => {
        setLocalViews((v) => (v ?? 0) + 1);
        localStorage.setItem(viewedKey, "true");
      });
    }
  }, [message.id]);

  // ✅ Load my reaction
  useEffect(() => {
    const stored = localStorage.getItem(`react-${message.id}`);
    if (stored) setMyReaction(stored);
  }, [message.id]);

  const handleReact = (emoji: string) => {
    const reactKey = `react-${message.id}`;
    const next = { ...localReactions };

    if (myReaction === emoji) {
      next[emoji] = Math.max((next[emoji] ?? 1) - 1, 0);
      setMyReaction(null);
      localStorage.removeItem(reactKey);
    } else {
      if (myReaction) next[myReaction] = Math.max((next[myReaction] ?? 1) - 1, 0);
      next[emoji] = (next[emoji] ?? 0) + 1;
      setMyReaction(emoji);
      localStorage.setItem(reactKey, emoji);
    }

    fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: message.id,
        reactMindBlown: next["🤯"] ?? 0,
        reactFire: next["🔥"] ?? 0,
        reactHundred: next["💯"] ?? 0,
        reactFlex: next["💪"] ?? 0,
        reactDash: next["💨"] ?? 0,
        reactHeart: next["❤️"] ?? 0,
      }),
    });

    setLocalReactions(next);
    setShowReactions(false);
  };

  return (
    <div
      className="flex flex-col max-w-[90%] mr-auto p-2 rounded-2xl bg-[#1b2d48] text-white"
      onContextMenu={(e) => {
        e.preventDefault();
        setShowReactions(true);
      }}
      onTouchStart={() => {
        const timeout = setTimeout(() => setShowReactions(true), 600);
        const cancel = () => clearTimeout(timeout);
        window.addEventListener("touchend", cancel, { once: true });
      }}
    >
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

      {/* Content */}
      {message.content && (
        <div className="px-3 py-2 text-sm whitespace-pre-wrap break-words mb-4">
          {linkify(message.content)}
        </div>
      )}

    


      {/* Reactions */}
      {Object.entries(localReactions).some(([, c]) => c > 0) && (
        <div className="flex  gap-2 ml-2 text-lg mt-1">
          {Object.entries(localReactions)
            .filter(([, c]) => c > 0)
            .map(([emoji, count]) => (
              <span
                key={emoji}
                className={`flex bg-[#2b5278] rounded-xl p-1 items-center gap-1 ${
                  myReaction === emoji ? "font-bold text-sky-400" : ""
                }`}
              >
                {emoji} <span className="text-xs">{count}</span>
              </span>
            ))}
        </div>
      )}
      
      
       {/* Meta - rotated time bottom right */}
      <div className="flex justify-between items-end mt-1 relative">
       
        {/* Time (rotated bottom-right) */}
        <span
          className="absolute bottom-1 right-1 text-[10px] text-neutral-400 transform  origin-bottom-right"
        ><a className="pr-2">👁 {localViews} </a> 
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Reaction picker */}
      {showReactions && (
        <div
          ref={reactionRef}
          className="flex gap-3 mt-2  border p-2 rounded-xl justify-center"
        >
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              className="text-xl hover:scale-125 transition-transform"
              onClick={() => handleReact(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
