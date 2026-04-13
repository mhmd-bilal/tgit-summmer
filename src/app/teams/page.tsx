"use client";

import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Search, Star, Users, Video, Mic, Plus, BarChart3, Clipboard, Zap, Crown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const teamCards = [

  {
    accentBg: 'bg-[#FDF5ED]',
    borderClass: 'border-l-4 border-l-warm-orange',
    groupLabel: 'Pub Legends',
    groupLabelClass: 'text-brown',
    badgeClass: 'bg-warm-orange text-white',
    btnLabel: 'View Scores',
    btnClass: 'btn-warm btn-warm-fill',
    btnIcon: <Zap size={14} />,
  }
];

type TeamName =
  | "Bazinga"
  | "Legendary Squad"
  | "Lobster Gang"
  | "Scranton Branch"
  | "The Dunphy's"
  | "Charlie's Angels"
  | "Cupcake Crew"
  | "99th Precinct";

const flavorTexts = {
  "Bazinga": "Bazinga! The geniuses strike again.",
  "Legendary Squad": "Suit up! This team is truly legendary.",
  "Lobster Gang": "You're their lobster—unstoppable together.",
  "Scranton Branch": "Beets, Bears, Battle… and they scored again.",
  "The Dunphy's": "Phil’s-osophy in action—winning with optimism.",
  "Charlie's Angels": "Winning the Malibu way—smooth and effortless.",
  "Cupcake Crew": "Sweet success, one point at a time.",
  "99th Precinct": "Nine-Nine! Case closed with another victory."
};

export default function TeamsPage() {
  const router = useRouter();
  const teams = useStore((state) => state.teams);
  const loading = false; // Simulated for now
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.members.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const maxScore = teams.length > 0 ? Math.max(...teams.map(t => t.score)) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="section-label">TGIT Sitcom Games</span>
          <h1 className="text-4xl md:text-6xl font-playfair font-black text-ink mt-1 leading-tight">
            Team <span className="text-deep-purple italic">Standings</span>
          </h1>
          <p className="text-ink-light font-inter text-sm mt-3 max-w-md leading-relaxed">
            Meet the competing teams battling across trivia, creative, and physical challenges.
          </p>
        </motion.div>

        {/* Quick Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-golden-bg border border-golden/30 rounded-2xl p-4 w-full lg:w-64"
        >
          <h4 className="text-xs font-inter font-bold text-brown-dark uppercase tracking-wider mb-3">
            Quick Search
          </h4>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Find your team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-border text-sm font-inter focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden/30 transition-all"
            />
          </div>
        </motion.div>
      </div>

      {loading && (
        <div className="col-span-full card-clean p-12 text-center text-ink-light font-inter mb-10">
          Loading teams...
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="col-span-full card-clean p-12 text-center text-ink-light font-inter mb-10">
          No teams registered yet.
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {!loading && filteredTeams.map((team, i) => {
          const style = teamCards[i % teamCards.length];
          const isLeading = team.score === maxScore && maxScore > 0;

          return (
            <motion.div
              key={team.id}
              onClick={() => router.push('/scoreboard')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)" }}
              className={`card-clean overflow-hidden ${style.borderClass} cursor-pointer transition-shadow`}
            >
              <div className={`p-5 ${style.accentBg} h-full flex flex-col`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {/* <span className={`text-[0.6rem] font-inter font-bold uppercase tracking-widest ${style.groupLabelClass}`}>
                      {style.groupLabel}
                    </span> */}
                    <h3 className="text-xl font-playfair font-bold text-ink mt-1 flex items-center gap-2">
                      {team.name}{isLeading && (<Crown fill={style.groupLabelClass} />)}
                    </h3>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`px-3 py-1 rounded-full text-xs font-inter font-bold ${style.badgeClass}`}
                  >
                    {team.score.toLocaleString()} PTS
                  </motion.div>
                </div>

                {/* Flavor Text Insert */}
                <p className="text-xs text-ink-light/80 italic mb-4 font-pangolin">
                  &quot;{flavorTexts[team.name]}&quot;
                </p>

                {/* Members */}
                <div className="space-y-2.5 mt-auto mb-5">
                  {[
                    { name: team.captain, role: 'Captain' },
                    { name: team.viceCaptain, role: 'Vice Captain' },
                    ...(team.members || []).map(m => ({ name: m, role: null }))
                  ].map((memberObj, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + j * 0.06 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar-circle avatar-circle-sm">
                          {memberObj.name ? memberObj.name.charAt(0) : '?'}
                        </div>
                        <span className="text-sm font-inter font-medium text-ink truncate max-w-40">
                          {memberObj.name}
                        </span>
                      </div>
                      {memberObj.role && (
                        <span className={`tag-pill text-[0.55rem] truncate ${memberObj.role === 'Captain' ? 'tag-pill-golden' : 'tag-pill-olive'}`}>
                          {memberObj.role}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <button className={`${style.btnClass} w-full justify-center text-sm py-2.5 rounded-xl flex items-center gap-2 pointer-events-none`}>
                    {style.btnIcon}
                    {style.btnLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {!loading && filteredTeams.length === 0 && teams.length > 0 && (
          <div className="col-span-full card-clean p-8 text-center text-ink-light font-inter text-sm">
            No teams match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
