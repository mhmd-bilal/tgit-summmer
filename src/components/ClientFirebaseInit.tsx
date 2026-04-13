"use client";

import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useStore, Team, Game, ScheduleItem } from "@/store/useStore";

export default function ClientFirebaseInit() {
  const setTeams = useStore((state) => state.setTeams);
  const setGames = useStore((state) => state.setGames);
  const setSchedule = useStore((state) => state.setSchedule);
  
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Listen to teams
    const teamsQ = query(collection(db, "teams"), orderBy("score", "desc"));
    const unsubTeams = onSnapshot(teamsQ, (snapshot) => {
      const teamsData: Team[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Team[];
      setTeams(teamsData);
    }, (error) => {
      console.error("Firebase Teams Subscription Error:", error);
      // Fallback dummy data if firebase fails due to auth or empty project
      setTeams([
        { id: "1", name: "The Central Perkers", members: ["Rachel", "Ross", "Monica"], score: 150 },
        { id: "2", name: "Dunder Mifflin A-Team", members: ["Michael", "Jim", "Dwight"], score: 120 },
        { id: "3", name: "Nine-Nine Squad", members: ["Jake", "Amy", "Holt"], score: 180 },
        { id: "4", name: "MacLaren's Regulars", members: ["Ted", "Barney", "Robin"], score: 90 },
      ]);
    });

    // Listen to games
    const unsubGames = onSnapshot(collection(db, "games"), (snapshot) => {
      const gamesData: Game[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Game[];
      if (gamesData.length > 0) {
        setGames(gamesData);
      } else {
        // Mock data
        setGames([
          { id: "1", name: "Relay Chaos", description: "PIVOT! Your way through the obstacle course.", rules: ["No running", "Must hold a coffee mug"], image: "/placeholder-game.png", points: 50 },
          { id: "2", name: "Dundie Awards Trivia", description: "Bears. Beets. Battlestar Galactica.", rules: ["No phones", "Fact check with Dwight"], image: "/placeholder-game.png", points: 30 }
        ]);
      }
    });

    // Listen to schedule
    const scheduleQ = query(collection(db, "schedule"), orderBy("time", "asc"));
    const unsubSchedule = onSnapshot(scheduleQ, (snapshot) => {
      const scheduleData: ScheduleItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScheduleItem[];
      if (scheduleData.length > 0) {
        setSchedule(scheduleData);
      } else {
        // Mock data
        setSchedule([
          { id: "1", time: "10:00", title: "Arrival & Central Perk Breakfast" },
          { id: "2", time: "11:00", title: "Game 1 - Relay Chaos" },
          { id: "3", time: "13:00", title: "Lunch at MacLaren's" },
          { id: "4", time: "14:30", title: "Game 2 - The Heist (B99 Style)" },
          { id: "5", time: "16:00", title: "Dundies Award Ceremony" }
        ]);
      }
    });

    return () => {
      unsubTeams();
      unsubGames();
      unsubSchedule();
    };
  }, [setTeams, setGames, setSchedule]);

  return null; // This component handles side-effects only
}
