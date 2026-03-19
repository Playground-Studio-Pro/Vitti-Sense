import React, { useEffect, useMemo, useState } from "react";

type Props = {
  lines: string[];
  onDone?: () => void;
};

export function ThinkingSequence({ lines, onDone }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const status = useMemo(() => {
    if (activeIndex <= 0) return "Reviewing available signals…";
    if (activeIndex < lines.length - 1) return "Comparing patterns…";
    return "Preparing recommendation…";
  }, [activeIndex, lines.length]);

  useEffect(() => {
    if (!lines.length) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= lines.length) return prev;
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [lines.length]);

  useEffect(() => {
    // When activeIndex exceeds lines.length, we are done.
    // However, the interval only increments up to lines.length.
    // Wait, the interval logic is: if (prev >= lines.length) return prev; else return prev + 1;
    // So it stops at lines.length.
    // The condition `activeIndex > lines.length` will never be true if it stops at lines.length.
    // Let's check the user's code again.
    // User code:
    // if (prev >= lines.length) return prev;
    // return prev + 1;
    // So max value is lines.length.
    // Effect:
    // if (activeIndex > lines.length) onDone?.();
    // This condition seems unreachable if max is lines.length.
    
    // Let's re-read the user's request carefully.
    // "if (prev >= lines.length) return prev;" -> stops at lines.length.
    // "if (activeIndex > lines.length) onDone?.();" -> requires lines.length + 1?
    
    // Maybe the user meant `activeIndex === lines.length`?
    // Or maybe the interval should go one step further?
    
    // If I look at the map:
    // index < activeIndex ? "done"
    // index === activeIndex ? "active"
    //
    // If activeIndex === lines.length:
    // All indices (0 to lines.length-1) are < activeIndex. So all are "done".
    // That seems to be the "finished" state.
    
    // So when activeIndex === lines.length, the animation is visually complete.
    // So we should trigger onDone when activeIndex === lines.length.
    // But we probably want a small delay so the user sees the last checkmark.
    
    if (activeIndex === lines.length) {
       const timeout = setTimeout(() => {
         onDone?.();
       }, 500); // Add a small delay
       return () => clearTimeout(timeout);
    }
  }, [activeIndex, lines.length, onDone]);

  return (
    <div className="space-y-8 w-full max-w-2xl">
      <div className="text-2xl font-medium text-[#242424]">{status}</div>

      <div className="space-y-5">
        {lines.map((line, index) => {
          const state =
            index < activeIndex ? "done" :
            index === activeIndex ? "active" :
            "pending";

          return (
            <div
              key={index}
              className={`thinking-line ${state} flex items-center gap-4 transition-all duration-300`}
            >
              <span className="icon w-8 text-center flex justify-center text-xl">
                {state === "done" ? "✓" : state === "active" ? "●" : "○"}
              </span>
              <span className="text-xl">{line}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .thinking-line.pending { opacity: 0.5; }
        .thinking-line.active { opacity: 1; transform: translateX(4px); }
        .thinking-line.done { opacity: 0.8; }
        
        .thinking-line.pending .icon { color: #EF4444; }
        .thinking-line.active .icon {
          color: #3B82F6;
          animation: pulse 1s infinite;
        }
        .thinking-line.done .icon { color: #26D07C; }
        
        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0.4; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
