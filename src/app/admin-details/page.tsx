"use client";

import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { Plus, Minus, RefreshCw, Database, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const teams = useStore((state) => state.teams);
  const games = useStore((state) => state.games);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleGameWin = async (teamId: string, gameId: string, isWinning: boolean, gamePoints: number, currentScore: number, currentGamesWon: string[]) => {
    setLoading(`${teamId}-${gameId}`);
    try {
      const newGamesWon = isWinning
        ? [...(currentGamesWon || []), gameId]
        : (currentGamesWon || []).filter(id => id !== gameId);

      const newScore = isWinning
        ? currentScore + gamePoints
        : Math.max(0, currentScore - gamePoints);

      await updateDoc(doc(db, "teams", teamId), {
        gamesWon: newGamesWon,
        score: newScore
      });
    } catch (error) {
      console.error("Error toggling game win:", error);
      alert("Failed to update game status.");
    } finally {
      setLoading(null);
    }
  };

  const updateScore = async (teamId: string, currentScore: number, change: number) => {
    setLoading(teamId);
    try {
      const newScore = Math.max(0, currentScore + change);
      await updateDoc(doc(db, "teams", teamId), {
        score: newScore
      });
    } catch (error) {
      console.error("Error updating score:", error);
      alert("Failed to update score. Check console.");
    } finally {
      setLoading(null);
    }
  };

  const resetScores = async () => {
    if (!confirm("Are you sure you want to reset all scores to 0?")) return;
    setLoading("reset");
    try {
      const batch = writeBatch(db);
      teams.forEach(t => {
        batch.update(doc(db, "teams", t.id), { score: 0, gamesWon: [] });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error resetting scores:", error);
      alert("Failed to reset scores.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b-2 border-coral/20">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-marker text-coral mb-2 flex items-center gap-2">
            <AlertTriangle size={24} className="text-coral" />
            Admin Control Panel
          </h1>
          <p className="text-ink-light font-pangolin">Manage scores and event state. Keep this secret! 🤫</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={resetScores}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-2 bg-coral/10 text-coral border-2 border-coral/30 rounded-xl font-inter font-semibold text-sm transition-colors hover:bg-coral/20 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Reset Scores
          </motion.button>
        </div>
      </div>

      {/* Team Score Controls */}
      <div className="grid gap-4">
        {teams.length === 0 ? (
          <div className="p-8 text-center card-fun text-ink-light font-pangolin text-lg">
            No teams found. Seed the database first! 🌱
          </div>
        ) : (
          teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col p-5 card-fun gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-marker text-ink mb-1">{team.name}</h3>
                  <p className="text-sm text-ink-light font-inter">Current Score: {team.score}</p>
                </div>

                <div className="flex items-center gap-5">
                  <span className="text-3xl font-marker text-ink w-16 text-center tabular-nums">
                    {team.score}
                  </span>

                  <div className="flex rounded-xl overflow-hidden border-2 border-muted">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateScore(team.id, team.score, -10)}
                      disabled={loading === team.id || team.score < 10}
                      className="p-3 bg-coral/5 hover:bg-coral/15 text-coral transition-colors disabled:opacity-30 border-r-2 border-muted"
                      title="Subtract 10 points"
                    >
                      <Minus size={20} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateScore(team.id, team.score, 10)}
                      disabled={loading === team.id}
                      className="p-3 bg-mint/5 hover:bg-mint/15 text-emerald-600 transition-colors disabled:opacity-30"
                      title="Add 10 points"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Games Won Toggles */}
              {games.length > 0 && (
                <div className="pt-3 border-t border-muted/30">
                  <p className="text-xs font-inter text-ink-light mb-2 font-bold">GAMES WON</p>
                  <div className="flex flex-wrap gap-2">
                    {games.map(game => {
                      const isWon = team.gamesWon?.includes(game.id) || false;
                      return (
                        <button
                          key={game.id}
                          onClick={() => toggleGameWin(team.id, game.id, !isWon, game.points, team.score, team.gamesWon || [])}
                          disabled={loading === `${team.id}-${game.id}`}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-inter transition-colors flex items-center gap-1.5 ${isWon
                            ? 'bg-golden/20 border-golden text-ink font-bold'
                            : 'bg-white/50 border-muted text-ink-light hover:border-ink/30'
                            }`}
                        >
                          {isWon && <span className="text-[10px]">✅</span>}
                          {game.name} ({game.points} pts)
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
