import { create } from "zustand";
import type { Game } from "@/types/game";

interface AppState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  liveGames: Game[];
  setLiveGames: (games: Game[]) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  liveGames: [],
  setLiveGames: (games) => set({ liveGames: games }),
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
