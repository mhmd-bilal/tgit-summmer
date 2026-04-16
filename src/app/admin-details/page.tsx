"use client";

import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { Plus, Minus, RefreshCw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const teams = useStore((state) => state.teams);
  const games = useStore((state) => state.games);
  const [loading, setLoading] = useState<string | null>(null);
  const [scoreInputs, setScoreInputs] = useState<Record<string, number>>({});

  const defaultGames = [
    { id: "sitcom-trivia", name: "Suit Up &Answer!", points: 30 },
    { id: "guess-who", name: "Say Whaaat?", points: 30 },
    { id: "obstacle-olympics", name: "Office Olympics", points: 40 },
    { id: "halloween-heist", name: "Halloween Heist", points: 50 },
    { id: "clay-model-making", name: "Sculpt Off", points: 30 }
  ];

  const adminGames = games.length > 0 ? games : defaultGames;

  const gameScoringOptions: Record<string, { description: string; options: number[] }> = {
    "sitcom-trivia": {
      description: "Trivia points are awarded by difficulty: Easy 10, Mid 20, Hard 30.",
      options: [10, 20, 30]
    },
    "guess-who": {
      description: "Correct guesses score based on clue depth: 30 / 20 / 10.",
      options: [30, 20, 10]
    },
    "obstacle-olympics": {
      description: "Office Olympics is ranked: top finish gets the highest points.",
      options: [40, 30, 20, 10]
    },
    "halloween-heist": {
      description: "Winner takes the biggest haul; use this to award the final heist score.",
      options: [50, 40, 30]
    },
    "clay-model-making": {
      description: "Judge-scored sculpting event: award points based on judge feedback.",
      options: [30, 25, 20]
    }
  };

  const getGameScoreOptions = (gameId: string, points: number) => {
    return gameScoringOptions[gameId]?.options ?? [points];
  };

  const getSelectedPoints = (teamId: string, gameId: string, defaultPoints: number) => {
    const key = `${teamId}-${gameId}`;
    return scoreInputs[key] ?? getGameScoreOptions(gameId, defaultPoints)[0];
  };

  const awardGameScore = async (
    teamId: string,
    gameId: string,
    gameName: string,
    scoreValue: number,
    currentScore: number,
    currentGamesWon: string[]
  ) => {
    const loadingKey = `${teamId}-${gameId}`;
    setLoading(loadingKey);

    try {
      const newGamesWon = currentGamesWon?.includes(gameId)
        ? currentGamesWon
        : [...(currentGamesWon || []), gameId];

      const newScore = Math.max(0, currentScore + scoreValue);
      await updateDoc(doc(db, "teams", teamId), {
        gamesWon: newGamesWon,
        score: newScore
      });
    } catch (error) {
      console.error(`Error awarding score for ${gameName}:`, error);
      alert("Failed to award game points. Check console.");
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

      {games.length === 0 && (
        <div className="mb-6 p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          Using the TGIT games list from the Games page because the Firestore games collection is empty.
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {adminGames.map((game) => (
          <span key={game.id} className="tag-pill bg-white text-ink border border-muted">
            {game.name} ({game.points} pts)
          </span>
        ))}
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

              {/* Award Game Scores */}
              {adminGames.length > 0 && (
                <div className="pt-3 border-t border-muted/30">
                  <p className="text-xs font-inter text-ink-light mb-4 font-bold">Award Game Scores</p>
                  <div className="space-y-3">
                    {adminGames.map(game => {
                      const key = `${team.id}-${game.id}`;
                      const options = getGameScoreOptions(game.id, game.points);
                      const selectedPoints = getSelectedPoints(team.id, game.id, game.points);
                      const isWon = team.gamesWon?.includes(game.id) || false;

                      return (
                        <div key={game.id} className="flex flex-col gap-3 rounded-3xl border border-muted bg-white/80 p-3 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-ink">{game.name}</span>
                              {isWon && (
                                <span className="rounded-full bg-golden/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-golden">
                                  Won
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-ink-light leading-relaxed">
                              {gameScoringOptions[game.id]?.description ?? 'Select a score value to award for this game.'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={selectedPoints}
                              onChange={(event) => setScoreInputs(prev => ({ ...prev, [key]: Number(event.target.value) }))}
                              disabled={loading === key}
                              className="rounded-2xl border border-muted bg-white px-3 py-2 text-sm text-ink"
                            >
                              {options.map(value => (
                                <option key={value} value={value}>
                                  {value} pts
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => awardGameScore(team.id, game.id, game.name, selectedPoints, team.score, team.gamesWon || [])}
                              disabled={loading === key}
                              className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-ink/90 disabled:opacity-50"
                            >
                              Award
                            </button>
                          </div>
                        </div>
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
