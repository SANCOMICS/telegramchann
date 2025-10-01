import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ScrollButtons({
  container,
}: {
  container: React.RefObject<HTMLDivElement>;
}) {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

 useEffect(() => {
    const el = container.current;
    if (!el) return;

    function check() {
        if (!el) return; // extra safeguard
        const nearTop = el.scrollTop < 50;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
        setShowTop(!nearTop);
        setShowBottom(!nearBottom);
    }

    el.addEventListener("scroll", check);
    check();
    return () => el.removeEventListener("scroll", check);
    }, [container]);


  return (
    <div className="fixed bottom-20 right-6 flex flex-col gap-3 z-50">
      {showTop && (
        <button
          onClick={() =>
            container.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="w-10 h-10 rounded-full bg-[#1c2733] text-white flex items-center justify-center shadow-md border border-white/20 hover:bg-[#2b5278] transition"
        >
          <FiChevronUp />
        </button>
      )}
      {showBottom && (
        <button
          onClick={() =>
            container.current?.scrollTo({
              top: container.current.scrollHeight,
              behavior: "smooth",
            })
          }
          className="w-10 h-10 rounded-full bg-[#1c2733] text-white flex items-center justify-center shadow-md border border-white/20 hover:bg-[#2b5278] transition"
        >
          <FiChevronDown />
        </button>
      )}
    </div>
  );
}
