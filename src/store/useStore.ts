import { create } from 'zustand';

export type TeamName =
  | "Bazinga"
  | "Legendary Squad"
  | "Lobster Gang"
  | "Scranton Branch"
  | "The Dunphy's"
  | "Charlie's Angels"
  | "Cupcake Crew"
  | "99th Precinct";

export interface Team {
  captain: any;
  viceCaptain: any;
  id: string;
  name: TeamName;        // Enforce valid team names
  members: string[];
  score: number;
  gamesWon?: string[];
}

export interface Game {
  id: string;
  name: string;
  description: string;
  rules: string[];
  image: string;
  points: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
}

interface AppState {
  teams: Team[];
  games: Game[];
  schedule: ScheduleItem[];
  setTeams: (teams: Team[]) => void;
  setGames: (games: Game[]) => void;
  setSchedule: (schedule: ScheduleItem[]) => void;
}

export const useStore = create<AppState>((set) => ({
  teams: [],
  games: [],
  schedule: [],
  setTeams: (teams) => set({ teams }),
  setGames: (games) => set({ games }),
  setSchedule: (schedule) => set({ schedule }),
}));
