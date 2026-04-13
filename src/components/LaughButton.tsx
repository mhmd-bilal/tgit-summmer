"use client";

import { Smile } from "lucide-react";

export default function LaughButton() {
  const playLaugh = () => {
    try {
      const audio = new Audio('/sounds/laugh.mp3');
      audio.play().catch((e) => console.log('Laugh audio requires user interaction to play:', e));
    } catch (err) {
      console.log('Error playing audio', err);
    }
  };

  return (
    <button
      onClick={playLaugh}
      className="cursor-pointer fixed bottom-5 right-2 md:right-8 z-[100] w-12 h-12 bg-coral-accent hover:bg-coral-accent/90 text-white rounded-full shadow-[0_4px_12px_rgba(217,79,61,0.4)] flex items-center justify-center transition-transform hover:scale-110 border-2 border-white group"
      aria-label="Play laugh track"
    >
      <span className="text-xl group-hover:animate-bounce-in block"><Smile /></span>
    </button>
  );
}
