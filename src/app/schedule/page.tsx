"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Timer, CheckCircle2, BarChart3, Eye, Palette, Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const scheduleData = [
  {
    id: "halloween-briefing",
    time: "11:00",
    displayTime: "11:00 AM",
    title: "Halloween Heist Briefing",
    location: "Teams & Pegasus 401",
    description: "Kick off the day with the Halloween Heist briefing and final instructions.",
    label: "Opening Brief",
    icon: Crown,
    style: { labelClass: 'tag-pill-purple', cardClass: 'border-purple-300 bg-purple-50' }
  },
  {
    id: "suit-up-answer",
    time: "12:00",
    displayTime: "12:00 PM",
    title: "Suit Up &Answer!",
    location: "Online - Teams",
    description: "Timed quiz covering 8 sitcoms with Easy, Mid, and Hard difficulty levels.",
    label: "Quiz Session",
    icon: BarChart3,
    style: { labelClass: 'tag-pill-olive', cardClass: '' }
  },
  {
    id: "group-photo",
    time: "12:30",
    displayTime: "12:30 PM",
    title: "Group Photo at Central Perk (202)",
    location: "Central Perk (202)",
    description: "Gather for the official TGIT group photo in front of Central Perk.",
    label: "Photo Moment",
    icon: MapPin,
    style: { labelClass: 'tag-pill-brown', cardClass: '' }
  },
  {
    id: "office-olympics",
    time: "14:30",
    displayTime: "2:30 PM",
    title: "Office Olympics",
    location: "202",
    description: "A sequence of physical challenges including Flight Fight, Chair Chase, Paper Toss, and Speed Stack.",
    label: "Main Event",
    icon: Zap,
    style: { labelClass: 'tag-pill-brown', cardClass: 'border-brown/40 bg-[#FDF5ED]' }
  },
  {
    id: "say-whaaat",
    time: "16:15",
    displayTime: "4:15 PM",
    title: "Say Whaaat",
    location: "Hybrid - Teams & Pegasus 401",
    description: "Identify sitcom characters using progressive clues in this fast-paced round.",
    label: "Quick Round",
    icon: Eye,
    style: { labelClass: 'tag-pill-olive', cardClass: '' }
  },
  {
    id: "snacks",
    time: "17:00",
    displayTime: "5:00 PM",
    title: "Snacks",
    location: "Pantry",
    description: "Take a break with refreshments before the final sculpting challenge.",
    label: "Break Time",
    icon: Clock,
    style: { labelClass: 'tag-pill-coral', cardClass: '' }
  },
  {
    id: "sculpt-off",
    time: "17:30",
    displayTime: "5:30 PM",
    title: "Sculpt Off",
    location: "202 - In front of Pantry",
    description: "Teams sculpt iconic sitcom items selected randomly from cards and are judged on creativity, accuracy, and presentation.",
    label: "Creative Event",
    icon: Palette,
    style: { labelClass: 'tag-pill-coral', cardClass: '' }
  }
];

export default function SchedulePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-8 py-4">
      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-5xl font-playfair font-black text-ink">
              TGIT Sitcom Games Timeline
            </h1>
          </div>
          <p className="text-ink-light font-inter text-sm mt-3 max-w-xl leading-relaxed">
            Follow the sequence of our events below. Click on any event card to view the complete game rules and instructions. Stay sharp and may the best team win!
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-16 md:pl-20">
          {/* Vertical line */}
          <div className="timeline-line" style={{ left: '28px' }} />

          <div className="space-y-8">
            {scheduleData.map((item, index) => {
              const isAllDay = item.time === "All Day";
              const isPast = !isAllDay && currentTime > item.time;
              const isActive = isAllDay || (!isPast && (index === 0 || currentTime >= scheduleData[index - 1].time));
              const style = item.style;
              const IconComp = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: index * 0.06 }}
                  className="relative"
                >
                  {/* Time marker */}
                  {isAllDay ? (
                    <div className="absolute -left-12 top-7 timeline-time select-none">

                      All Day
                    </div>
                  ) : (
                    <div className="absolute -left-10 top-7 timeline-time select-none">
                      {item.displayTime ?? item.time}
                    </div>
                  )}

                  {/* Timeline dot */}
                  <div
                    className={`timeline-dot ${isActive ? 'timeline-dot-active' : ''} ${isPast ? 'bg-border' : ''}`}
                    style={{ left: '-57px', top: '30px' }}
                  />

                  {/* Event Card */}
                  <motion.div
                    onClick={() => router.push('/games')}
                    whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
                    className={`card-clean cursor-pointer p-5 md:p-6 ml-8 transition-all ${style.cardClass} ${isPast ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {IconComp && (
                            <span className={`p-1.5 rounded-full ${isAllDay ? 'bg-white/60' : 'bg-muted'}`}>
                              <IconComp size={16} className={isAllDay ? "text-deep-purple" : "text-ink-light"} />
                            </span>
                          )}
                          <span className={`tag-pill ${style.labelClass}`}>
                            {item.label}
                          </span>
                        </div>
                        <h3 className={`text-lg md:text-xl font-playfair font-bold mb-2 ${isPast ? 'text-ink-light line-through decoration-border' : 'text-ink'}`}>
                          {item.title}
                        </h3>
                        <p className={`text-sm font-inter leading-relaxed max-w-2xl ${isAllDay ? 'text-ink/80 font-medium' : 'text-ink-light'}`}>
                          {item.description}
                        </p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-ink-light font-inter">
                            <MapPin size={14} className={isAllDay ? "text-deep-purple" : "text-ink-light"} />
                            <span className={isAllDay ? "font-semibold text-ink" : ""}>{item.location}</span>
                          </div>
                          {isActive && !isAllDay && (
                            <div className="flex items-center gap-2 text-sm text-ink-light font-inter">
                              <Timer size={14} className="text-deep-purple" />
                              <span className="text-deep-purple font-medium">In Progress</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {isPast && (
                        <CheckCircle2 size={20} className="text-border flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

