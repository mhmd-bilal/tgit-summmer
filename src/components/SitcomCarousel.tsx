"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: "friends",
    url: "/images/f.gif",
    label: "Central Perk"
  },
  {
    id: "office",
    url: "/images/o.gif",
    label: "Dunder Mifflin"
  },
  {
    id: "b99",
    url: "/images/b.gif",
    label: "99th Precinct"
  },
  {
    id: "himym",
    url: "/images/h.gif",
    label: "MacLaren's Pub"
  },
  {
    id: "himym",
    url: "/images/b9.gif",
    label: "MacLaren's Pub"
  }
];

export default function SitcomCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-120 h-64 rounded-xl overflow-hidden border-4 border-white shadow-lg hover:rotate-2 rotate-0 transition-transform bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={slides[index].url}
          alt={slides[index].label}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        {/* <p className="text-white text-xs font-inter font-bold truncate">
          {slides[index].label}
        </p> */}
      </div>
    </div>
  );
}
