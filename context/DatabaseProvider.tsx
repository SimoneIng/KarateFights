import { create } from 'zustand';
import { useAthletes, useMatches, useTournaments } from '@/database/hooks';
import { Athlete, Tournament, Match, MatchWithAthletes } from '@/database/types';

interface StoreState {
  // Data
  athletes: Athlete[];
  matches: MatchWithAthletes[];
  tournaments: Tournament[];
  
  // Loading states
  isLoadingAthletes: boolean;
  isLoadingMatches: boolean;
  isLoadingTournaments: boolean;
  
  // Actions
  fetchAthletes: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  fetchTournaments: () => Promise<void>;
  
  // Athletes actions
  addAthlete: (firstname: string, lastname: string) => Promise<void>;
  updateAthlete: (athleteId: number, features: string, tactics: string) => Promise<void>;
  deleteAthlete: (athleteId: number) => Promise<void>;
  
  // Matches actions
  addMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (matchId: number, match: Partial<Match>) => Promise<void>;
  deleteMatch: (matchId: number) => Promise<void>;
  
  // Tournaments actions
  addTournament: (name: string, date: string) => Promise<void>;
  updateTournament: (id: number, name: string, date: string) => Promise<void>;
  deleteTournament: (id: number) => Promise<void>;
}

export const useDatabaseStore = create<StoreState>((set, get) => {
  // Hooks initialization
  const athletesHook = useAthletes();
  const matchesHook = useMatches();
  const tournamentsHook = useTournaments();
  
  return {
    // Initial state
    athletes: [],
    matches: [],
    tournaments: [],
    isLoadingAthletes: false,
    isLoadingMatches: false,
    isLoadingTournaments: false,
    
    // Fetch actions
    fetchAthletes: async () => {
      set({ isLoadingAthletes: true });
      try {
        const athletes = await athletesHook.getAthletes();
        set({ athletes });
      } finally {
        set({ isLoadingAthletes: false });
      }
    },
    
    fetchMatches: async () => {
      set({ isLoadingMatches: true });
      try {
        const matches = await matchesHook.getMatchesWithDetails();
        set({ matches });
      } finally {
        set({ isLoadingMatches: false });
      }
    },
    
    fetchTournaments: async () => {
      set({ isLoadingTournaments: true });
      try {
        const tournaments = await tournamentsHook.getTournaments();
        set({ tournaments });
      } finally {
        set({ isLoadingTournaments: false });
      }
    },
    
    // Athletes actions
    addAthlete: async (firstname: string, lastname: string) => {
      await athletesHook.addAthlete(firstname, lastname);
      await get().fetchAthletes();
    },
    
    updateAthlete: async (athleteId: number, features: string, tactics: string) => {
      await athletesHook.updateAthlete(athleteId, features, tactics);
      await get().fetchAthletes();
    },
    
    deleteAthlete: async (athleteId: number) => {
      await athletesHook.deleteAthlete(athleteId);
      await get().fetchAthletes();
    },
    
    // Matches actions
    addMatch: async (match: Omit<Match, 'id'>) => {
      await matchesHook.addMatch(match);
      await get().fetchMatches();
    },
    
    updateMatch: async (matchId: number, match: Partial<Match>) => {
      await matchesHook.updateMatch(matchId, match);
      await get().fetchMatches();
    },
    
    deleteMatch: async (matchId: number) => {
      await matchesHook.deleteMatch(matchId);
      await get().fetchMatches();
    },
    
    // Tournaments actions
    addTournament: async (name: string, date: string) => {
      await tournamentsHook.addTournament(name, date);
      await get().fetchTournaments();
    },
    
    updateTournament: async (id: number, name: string, date: string) => {
      await tournamentsHook.updateTournament(id, name, date);
      await get().fetchTournaments();
    },
    
    deleteTournament: async (id: number) => {
      await tournamentsHook.deleteTournament(id);
      await Promise.all([
        get().fetchTournaments(),
        get().fetchMatches() // Refresh matches as they might be affected
      ]);
    },
  };
});