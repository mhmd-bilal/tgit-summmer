"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Trophy, TrendingUp, Star, FileText, ChevronUp, ChevronDown, Minus } from "lucide-react";

export default function Scoreboard() {
  const teams = useStore((state) => state.teams);
  const games = useStore((state) => state.games);
  const [topTeamId, setTopTeamId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("02:45:00");

  useEffect(() => {
    if (teams.length > 0) {
      const currentTopTeamId = teams[0].id;
      if (topTeamId && currentTopTeamId !== topTeamId && teams[0].score > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C8A94E', '#D4883C', '#4A2C6A', '#D8C8F0']
        });
      }
      setTopTeamId(currentTopTeamId);
    }
  }, [teams, topTeamId]);

  // Simple countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        const parts = prev.split(':').map(Number);
        let [h, m, s] = parts;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRankChange = (index: number) => {
    if (index === 0) return null;
    const options = ['up', 'down', 'stable'] as const;
    return options[index % 3];
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="section-label text-warm-orange">Season 4 Final Rankings</span>
          <h1 className="text-4xl md:text-6xl font-playfair font-black text-ink mt-1 tracking-tight uppercase relative">
            The Scoreboard
            <div className="absolute -top-4 -right-12 text-4xl opacity-50 rotate-45 drop-shadow-md z-0 pointer-events-none">
              🔫
            </div>
          </h1>
          <p className="text-ink-light font-inter text-sm mt-3 max-w-md leading-relaxed italic">
            The race for the Ultimate Consultant. Not just a Dundie, but true glory!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="broadcast-badge"
        >
          <Star size={16} className="text-golden" />
          Next Broadcast: {countdown}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* ── Main Rankings Column ── */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {teams.map((team, index) => {
              if (index === 0) {
                // ── Champion Card ──
                return (
                  <motion.div
                    key={team.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="card-champion p-6 md:p-8 relative overflow-visible"
                  >
                    {/* Champion Ribbon */}
                    <div className="champion-ribbon">Champion</div>

                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="avatar-circle avatar-circle-lg">
                          {team.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-golden rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          1
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl md:text-3xl font-playfair font-black text-ink uppercase tracking-tight">
                          {team.name}
                        </h2>
                        <p className="text-sm text-ink-light font-inter mt-1">
                          👥 {team.members.length} Active Producers
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="tag-pill tag-pill-olive">Elite Division</span>
                          <span className="tag-pill tag-pill-golden">🔥 Top Streak</span>
                        </div>
                        {team.gamesWon && team.gamesWon.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-ink-light font-inter mb-1 uppercase tracking-wider">Victories:</p>
                            <div className="flex flex-wrap gap-1">
                              {team.gamesWon.map(gameId => {
                                const g = games.find(x => x.id === gameId);
                                if (!g) return null;
                                return (
                                  <span key={gameId} className="text-xs px-2 py-0.5 rounded-md bg-ink text-white font-medium shadow-sm">
                                    🏆 {g.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="score-label">Total Score</span>
                        <motion.div
                          key={team.score}
                          initial={{ scale: 1.3, color: '#D94F3D' }}
                          animate={{ scale: 1, color: '#C8A94E' }}
                          className="score-big"
                        >
                          {team.score.toLocaleString()}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // ── Regular Rank Rows ──
              const change = getRankChange(index);
              return (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${index === 1 ? 'card-purple-accent' : 'card-clean'} p-5 flex items-center justify-between hover-lift`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-playfair font-bold text-ink-light w-8 text-center">
                      {index + 1}
                    </span>
                    <div className="avatar-circle avatar-circle-sm">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-playfair font-bold text-ink uppercase tracking-tight">
                        {team.name}
                      </h3>
                      <p className="text-xs text-ink-light font-inter">
                        {team.members.slice(0, 2).join(' • ')} • {team.members.length} Members
                      </p>
                      {team.gamesWon && team.gamesWon.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {team.gamesWon.map(gameId => {
                            const g = games.find(x => x.id === gameId);
                            if (!g) return null;
                            return (
                              <span key={gameId} title={g.name} className="inline-flex items-center justify-center px-1.5 py-0.5 bg-golden/20 text-golden-dark rounded text-[10px] font-medium border border-golden/30">
                                🏆 {g.name.length > 20 ? g.name.substring(0, 20) + '...' : g.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.span
                      key={team.score}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-playfair font-bold text-ink"
                    >
                      {team.score.toLocaleString()}
                    </motion.span>
                    <div className="mt-1">
                      {change === 'up' && (
                        <span className="rank-up inline-flex items-center gap-0.5">
                          <ChevronUp size={12} /> UP
                        </span>
                      )}
                      {change === 'down' && (
                        <span className="rank-down inline-flex items-center gap-0.5">
                          <ChevronDown size={12} /> DOWN
                        </span>
                      )}
                      {change === 'stable' && (
                        <span className="rank-stable inline-flex items-center gap-0.5">
                          <Minus size={12} /> STABLE
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {teams.length === 0 && (
            <div className="card-clean p-12 text-center text-ink-light font-inter">
              No teams yet. Head to Admin to seed data.
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="production-notes"
          >
            <h3 className="flex items-center gap-2">
              <FileText size={16} />
              Production Notes
            </h3>
            <p>
              Current rankings are calculated based on Live Broadcast Engagement, Technical Perfection,
              and Audience Retention metrics. Updates occur every 15 minutes.
            </p>
            <button className="mt-4 w-full py-2.5 rounded-lg border-2 border-white/30 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
              Download Full Report
            </button>
          </motion.div> */}

          {/* Rising Stars
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-clean p-5"
          >
            <h3 className="text-sm font-inter font-bold text-ink uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-deep-purple" />
              Rising Stars
            </h3>
            <div className="space-y-1">
              {[
                { rank: '07', name: 'Rising Team A', momentum: '+42%', color: 'bg-coral-accent' },
                { rank: '09', name: 'Dark Horse B', momentum: '+28%', color: 'bg-warm-orange' },
                { rank: '12', name: 'Newcomer C', momentum: '+15%', color: 'bg-golden' },
              ].map((star) => (
                <div key={star.rank} className="rising-star-item">
                  <div className={`rising-star-rank ${star.color}`}>
                    {star.rank}
                  </div>
                  <div>
                    <p className="text-sm font-inter font-semibold text-ink">{star.name}</p>
                    <p className="text-xs text-ink-light font-inter">{star.momentum} Momentum</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}
