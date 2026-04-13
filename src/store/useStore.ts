import { create } from 'zustand';

export interface Team {
  id: string;
  name: string;
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
