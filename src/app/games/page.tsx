"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const getCategoryAccent = (category: string) => {
  switch (category.toUpperCase()) {
    case 'OFFLINE':
      return { tagClass: 'tag-pill-coral', borderClass: 'border-t-4 border-t-[#D94F3D]' };
    case 'ONLINE':
      return { tagClass: 'tag-pill-green', borderClass: 'border-t-4 border-t-[#4A9B7F]' };
    case 'HYBRID':
      return { tagClass: 'bg-[#EBF3FA] text-[#5B8DB8] border border-[#B8D4F0] rounded-full inline-flex items-center px-3 py-[3px] font-inter text-[0.65rem] font-bold uppercase tracking-[0.06em]', borderClass: 'border-t-4 border-t-[#5B8DB8]' };
    default:
      return { tagClass: 'tag-pill-olive', borderClass: 'border-t-4 border-t-[#C8A94E]' };
  }
};

const onlineGames = [
  {
    id: "sitcom-trivia",
    name: "Sitcom Trivia",
    description: "A timed quiz covering eight sitcoms with varying difficulty levels.",
    points: "10-30",
    rules: [
      "Categories: Character, Place, Situation/Dialogue.",
      "Difficulty Levels: Easy (10pts), Mid (20pts), Hard (30pts).",
      "8 sitcoms with one question per difficulty level.",
      "32 total questions (24 sitcom-based + 8 general).",
      "One question displayed every 60 seconds.",
      "Fastest correct response earns the points.",
      "No negative marking."
    ],
    category: "Online",
    image: "/images/trivia.png",
    tags: ["Friends", "B99", "The Office"],
    badges: ["Timed"]
  },
  {
    id: "guess-what",
    name: "Guess What?",
    description: "Identify a character, object, or reference using progressive clues.",
    points: "10-30",
    rules: [
      "8 sitcoms with 2 questions each.",
      "4 additional general questions (20 questions total).",
      "Each question starts with the first clue.",
      "Additional clues revealed every 30 seconds.",
      "Correct after 1st clue: 30 points.",
      "Correct after 2nd clue: 20 points.",
      "Correct after 3rd clue: 10 points.",
      "Points decrease with time and number of clues used."
    ],
    category: "HYBRID",
    image: "/images/guess.png",
    tags: ["HIMYM", "TBBT"],
    badges: ["Timed"]
  }
];

const offlineGames = [
  {
    id: "obstacle-olympics",
    name: "Office Olympics",
    description: "A sequence of physical team challenges with cumulative timing.",
    points: "Ranked",
    rules: [
      "Flight Fight: Create a paper plane and make it cross a marked line (Bonus points if not crumpled).",
      "Chair Chase: Race using an office chair along a predefined path.",
      "Paper Toss: Toss the paper plane into a bucket.",
      "Speed Stack: Stack and unstack cups in a predefined sequence.",
      "Fastest cumulative completion time wins."
    ],
    category: "Offline",
    image: "/images/obs.png",
    tags: ["The Office", "B99"],
    badges: ["Team PARTICIPATION", "Timed"]
  },
  {
    id: "halloween-heist",
    name: "Halloween Heist",
    description: "Inspired by Brooklyn Nine-Nine, teams must defend or steal a central plaque or crown.",
    points: "Winner Takes All",
    rules: [
      "Printed faces of sitcom characters are hidden around the venue.",
      "Teams collect and protect these while attempting to capture the main trophy.",
      "Possession of the plaque/crown at the end determines the winner.",
      "Bonus points for the number of characters collected."
    ],
    category: "Offline",
    image: "/images/heist.png",
    tags: ["B99"],
    badges: ["Team PARTICIPATION"]
  },
  {
    id: "clay-model-making",
    name: "Clay Model Making",
    description: "Teams sculpt iconic sitcom items selected randomly from cards.",
    points: "Judged",
    rules: [
      "Examples: Yellow umbrella (HIMYM), Blue French horn, Central Perk couch (Friends), Bazinga sign (TBBT), Police badge (B99).",
      "Judging Criteria: Creativity, Accuracy, Presentation.",
      "Scoring: Ranked evaluation by judges."
    ],
    category: "Offline",
    image: "/images/clay.png",
    tags: ["Friends", "HIMYM", "TBBT", "B99"],
    badges: ["Team PARTICIPATION", "Creative"]
  }
];

interface Game {
  id: string;
  name: string;
  description: string;
  points: string;
  rules: string[];
  category: string;
  image: string;
  tags: string[];
  badges: string[];
}

export default function GamesPage() {
  const [expandedRules, setExpandedRules] = useState<string | null>(null);

  const renderGameCard = (game: Game, index: number) => {
    const accent = getCategoryAccent(game.category);
    const isExpanded = expandedRules === game.id;

    return (
      <motion.div
        key={game.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover="hover"
        className={`card-clean flex flex-col overflow-hidden ${accent.borderClass} shadow-sm bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-300`}
      >
        <motion.div
          className="h-44 relative bg-muted overflow-hidden"
          variants={{
            hover: { y: -5, transition: { duration: 0.3, ease: "easeOut" } }
          }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            variants={{
              hover: { scale: 1.05, transition: { duration: 0.4, ease: "easeOut" } }
            }}
          >
            <Image
              src={game.image}
              alt={game.name}
              fill
              className="object-cover"
              unoptimized={game.image.endsWith('.gif')}
            />
          </motion.div>
          {/* Subtle overlay to ensure badges are readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-3 right-3 flex gap-2">
            <span
              className={`${accent.tagClass.includes('bg-')
                ? accent.tagClass
                : `tag-pill ${accent.tagClass}`
                } shadow-md`}
            >
              {game.category.toUpperCase()}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 justify-end max-w-[80%]">
            {game.badges.map((badge: string, i: number) => (
              <span key={i} className="tag-pill bg-white/90 text-ink text-[0.6rem] backdrop-blur-sm shadow-sm border border-white/40">
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="p-5 flex flex-col flex-1"
          variants={{
            hover: { y: -5, transition: { duration: 0.3, ease: "easeOut" } }
          }}
        >
          <h2 className="text-xl font-playfair font-bold text-ink mb-2 tracking-tight">
            {game.name}
          </h2>
          <p className="text-sm text-ink-light font-inter leading-relaxed mb-4">
            {game.description}
          </p>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
              {game.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-ink-light text-[0.65rem] font-inter font-semibold uppercase tracking-wider">#{tag}</span>
              ))}
            </div>
          )}

          {/* Tag pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="tag-pill tag-pill-olive">
              {game.points} PTS
            </span>
            <span className="tag-pill tag-pill-brown">
              {game.rules.length} RULES
            </span>
          </div>

          {/* Expandable Rules */}
          <button
            onClick={() => setExpandedRules(isExpanded ? null : game.id)}
            className="w-full flex items-center justify-between pt-3 border-t border-border text-sm font-inter font-bold text-ink-light uppercase tracking-wider hover:text-ink transition-colors mt-auto"
          >
            View Game Rules
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {game.rules.map((rule: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-ink-light font-inter">
                    <span className="w-1.5 h-1.5 rounded-full bg-golden mt-1.5 flex-shrink-0" />
                    {rule}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 md:px-0 space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="tag-pill tag-pill-green mb-3 inline-block">
          TGIT Events
        </span>
        <h1 className="text-4xl md:text-6xl font-playfair font-black text-ink leading-tighter tra">
          TGIT Sitcom<br />
          <span className="text-deep-purple">Games</span>
        </h1>
        <p className="text-ink-light font-inter text-sm mt-3 max-w-lg leading-relaxed relative">
          Get ready for the ultimate showdown! A mix of online trivia and offline team challenges inspired by your favorite popular sitcoms.
        </p>
      </motion.div>

      {/* Online & Offline Games Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineGames.map((game, i) => renderGameCard(game, i))}
          {offlineGames.map((game, i) => renderGameCard(game, i + onlineGames.length))}
        </div>
      </section>

    </div>
  );
}
