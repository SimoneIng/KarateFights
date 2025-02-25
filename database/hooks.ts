import * as SQLite from 'expo-sqlite';
import { Athlete, Match, Tournament, MatchWithAthletes } from './types';

const DB_NAME = "KarateFightingsDB";

const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DB_NAME)
  return db; 
}

// Athletes Hook
export function useAthletes() {

  const getAthletes = async (): Promise<Athlete[]> => {
    try {
      const db = await openDatabase();
      return await db.getAllAsync<Athlete>(
        'SELECT * FROM Athlete ORDER BY lastname, firstname'
      );
    } catch (error) {
      throw error;
    }
  };

  const getAthleteById = async (athleteId: number): Promise<Athlete | null> => {
    try {
      const db = await openDatabase();
      return await db.getFirstAsync<Athlete>(
        'SELECT * FROM Athlete WHERE AthleteId = ?',
        [athleteId]
      );
    } catch (error) {
      throw error;
    }
  };

  const addAthlete = async (firstname: string, lastname: string): Promise<number> => {
    try {
      const db = await openDatabase();
      const result = await db.runAsync(
        'INSERT INTO Athlete (firstname, lastname) VALUES (?, ?)',
        [firstname, lastname]
      );
      return result.lastInsertRowId;
    } catch (error) {
      throw error;
    }
  };

  const updateAthlete = async (
    athleteId: number,
    features: string,
    tactics: string
  ): Promise<void> => {
    try {
      const db = await openDatabase();
      await db.runAsync(
        'UPDATE Athlete SET features = ?, tactics = ? WHERE AthleteId = ?',
        [features, tactics, athleteId]
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteAthlete = async (athleteId: number): Promise<void> => {
    try {
      const db = await openDatabase();
      await db.runAsync('BEGIN TRANSACTION');
      
      // Controlla se l'atleta ha match associati
      const matches = await db.getAllAsync(
        'SELECT id FROM Match WHERE aoAthleteId = ? OR akaAthleteId = ?',
        [athleteId, athleteId]
      );
      
      if (matches.length > 0) {
        throw new Error('Cannot delete athlete with associated matches');
      }
      
      await db.runAsync('DELETE FROM Athlete WHERE AthleteId = ?', [athleteId]);
      await db.runAsync('COMMIT');
    } catch (error) {
      const db = await openDatabase();
      await db.runAsync('ROLLBACK');
      throw error;
    }
  };

  const getAthleteStats = async (athleteId: number): Promise<{
    totalMatches: number;
    wins: number;
    totalPoints: number;
  }> => {
    try {
      const db = await openDatabase();
      const stats = await db.getFirstAsync<{
        totalMatches: number;
        wins: number;
        totalPoints: number;
      }>(`
        SELECT 
          COUNT(*) as totalMatches,
          SUM(CASE 
            WHEN (aoAthleteId = ? AND aoScore > akaScore) OR 
                 (akaAthleteId = ? AND akaScore > aoScore) THEN 1 
            ELSE 0 
          END) as wins,
          SUM(CASE 
            WHEN aoAthleteId = ? THEN aoScore
            WHEN akaAthleteId = ? THEN akaScore
            ELSE 0 
          END) as totalPoints
        FROM Match 
        WHERE aoAthleteId = ? OR akaAthleteId = ?
      `, [athleteId, athleteId, athleteId, athleteId, athleteId, athleteId]);

      return {
        totalMatches: stats?.totalMatches || 0,
        wins: stats?.wins || 0,
        totalPoints: stats?.totalPoints || 0
      };
    } catch (error) {
      throw error;
    }
  };

  const getAthleteId = async (athleteFirstname: string, athleteLastname: string): Promise<number | null> => {
    try {
      const db = await openDatabase();
      return await db.getFirstAsync<number>(
        "SELECT AthleteId FROM Athlete WHERE firstname = ? AND lastname = ?", 
        [athleteFirstname, athleteLastname]
      ); 
    } catch(error){
      throw error; 
    }
  }

  return {
    getAthletes,
    getAthleteById,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    getAthleteStats,
    getAthleteId
  };
}

// Matches Hook
export function useMatches() {

  const getMatchById = async (matchId: number): Promise<MatchWithAthletes | null> => {
    try {
      const db = await openDatabase();
      const match = await db.getFirstAsync<MatchWithAthletes & {
        aoAthleteId: number, aoFirstname: string, aoLastname: string, aoFeatures: string, aoTactics: string,
        akaAthleteId: number, akaFirstname: string, akaLastname: string, akaFeatures: string, akaTactics: string,
        tournamentId: number, tournamentName: string, tournamentDate: string
      }>(
        `
        SELECT 
          Match.*, 
          aoAthlete.AthleteId AS aoAthleteId, aoAthlete.firstname AS aoFirstname, aoAthlete.lastname AS aoLastname, 
          aoAthlete.features AS aoFeatures, aoAthlete.tactics AS aoTactics,
          akaAthlete.AthleteId AS akaAthleteId, akaAthlete.firstname AS akaFirstname, akaAthlete.lastname AS akaLastname,
          akaAthlete.features AS akaFeatures, akaAthlete.tactics AS akaTactics,
          Tournament.id AS tournamentId, Tournament.name AS tournamentName, Tournament.date AS tournamentDate
        FROM Match
        JOIN Athlete AS aoAthlete ON Match.aoAthleteId = aoAthlete.AthleteId
        JOIN Athlete AS akaAthlete ON Match.akaAthleteId = akaAthlete.AthleteId
        JOIN Tournament ON Match.tournamentId = Tournament.id
        WHERE Match.id = ?
        ORDER BY Match.id DESC
        `,
        [matchId]
      );
  
      // Verifichiamo che il risultato non sia `null` prima di procedere con la mappatura
      if (!match) return null;
  
      // Mappiamo il risultato per creare la struttura `MatchWithAthletes`
      return {
        ...match,
        aoAthlete: {
          AthleteId: match.aoAthleteId,
          firstname: match.aoFirstname,
          lastname: match.aoLastname,
          features: match.aoFeatures,
          tactics: match.aoTactics,
        },
        akaAthlete: {
          AthleteId: match.akaAthleteId,
          firstname: match.akaFirstname,
          lastname: match.akaLastname,
          features: match.akaFeatures,
          tactics: match.akaTactics,
        },
        tournament: {
          id: match.tournamentId,
          name: match.tournamentName,
          date: match.tournamentDate,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const getMatchesWithDetails = async (): Promise<MatchWithAthletes[]> => {
    try {
      // Fetch flat results from the database
      const db = await openDatabase();
      const results = await db.getAllAsync<{
        id: number;
        tournamentId: number;
        aoAthleteId: number;
        akaAthleteId: number;
        aoScore: number;
        akaScore: number;
        aoKizami: number;
        aoGyakuJodan: number;
        aoGyakuChudan: number;
        aoJodanMawashi: number;
        aoChudanMawashi: number;
        aoUramawashi: number;
        aoSweep: number;
        akaKizami: number;
        akaGyakuJodan: number;
        akaGyakuChudan: number;
        akaJodanMawashi: number;
        akaChudanMawashi: number;
        akaUramawashi: number;
        akaSweep: number; 
        matchDescription: string;
        aoSummary: string;
        akaSummary: string;
        'aoAthlete.AthleteId': number;
        'aoAthlete.firstname': string;
        'aoAthlete.lastname': string;
        'aoAthlete.features': string;
        'aoAthlete.tactics': string;
        'akaAthlete.AthleteId': number;
        'akaAthlete.firstname': string;
        'akaAthlete.lastname': string;
        'akaAthlete.features': string;
        'akaAthlete.tactics': string;
        'tournament.id': number;
        'tournament.name': string;
        'tournament.date': string;
      }>(`
        SELECT 
          -- Match fields
          m.id,
          m.tournamentId,
          m.aoAthleteId,
          m.akaAthleteId,
          m.aoScore,
          m.akaScore,
          m.aoKizami,
          m.aoGyakuJodan,
          m.aoGyakuChudan,
          m.aoJodanMawashi,
          m.aoChudanMawashi,
          m.aoUramawashi,
          m.aoSweep, 
          m.akaKizami,
          m.akaGyakuJodan,
          m.akaGyakuChudan,
          m.akaJodanMawashi,
          m.akaChudanMawashi,
          m.akaUramawashi,
          m.akaSweep, 
          m.matchDescription,
          m.aoSummary,
          m.akaSummary,
          
          -- AO Athlete fields
          ao.AthleteId as 'aoAthlete.AthleteId',
          ao.firstname as 'aoAthlete.firstname',
          ao.lastname as 'aoAthlete.lastname',
          ao.features as 'aoAthlete.features',
          ao.tactics as 'aoAthlete.tactics',
          
          -- AKA Athlete fields
          aka.AthleteId as 'akaAthlete.AthleteId',
          aka.firstname as 'akaAthlete.firstname',
          aka.lastname as 'akaAthlete.lastname',
          aka.features as 'akaAthlete.features',
          aka.tactics as 'akaAthlete.tactics',
          
          -- Tournament fields
          t.id as 'tournament.id',
          t.name as 'tournament.name',
          t.date as 'tournament.date'
        FROM Match m
        JOIN Athlete ao ON m.aoAthleteId = ao.AthleteId
        JOIN Athlete aka ON m.akaAthleteId = aka.AthleteId
        JOIN Tournament t ON m.tournamentId = t.id
        ORDER BY t.date DESC, m.id DESC
      `);
  
      // Map flat results to the nested MatchWithAthletes structure
      return results.map(row => ({
        id: row.id,
        tournamentId: row.tournamentId,
        aoAthleteId: row.aoAthleteId,
        akaAthleteId: row.akaAthleteId,
        aoScore: row.aoScore,
        akaScore: row.akaScore,
        aoKizami: row.aoKizami,
        aoGyakuJodan: row.aoGyakuJodan,
        aoGyakuChudan: row.aoGyakuChudan,
        aoJodanMawashi: row.aoJodanMawashi,
        aoChudanMawashi: row.aoChudanMawashi,
        aoUramawashi: row.aoUramawashi,
        akaKizami: row.akaKizami,
        akaGyakuJodan: row.akaGyakuJodan,
        akaGyakuChudan: row.akaGyakuChudan,
        akaJodanMawashi: row.akaJodanMawashi,
        akaChudanMawashi: row.akaChudanMawashi,
        akaUramawashi: row.akaUramawashi,
        aoSweep: row.aoSweep, 
        akaSweep: row.akaSweep, 
        matchDescription: row.matchDescription,
        aoSummary: row.aoSummary,
        akaSummary: row.akaSummary,
        // Nest aoAthlete object
        aoAthlete: {
          AthleteId: row['aoAthlete.AthleteId'],
          firstname: row['aoAthlete.firstname'],
          lastname: row['aoAthlete.lastname'],
          features: row['aoAthlete.features'],
          tactics: row['aoAthlete.tactics']
        },
        // Nest akaAthlete object
        akaAthlete: {
          AthleteId: row['akaAthlete.AthleteId'],
          firstname: row['akaAthlete.firstname'],
          lastname: row['akaAthlete.lastname'],
          features: row['akaAthlete.features'],
          tactics: row['akaAthlete.tactics']
        },
        // Nest tournament object
        tournament: {
          id: row['tournament.id'],
          name: row['tournament.name'],
          date: row['tournament.date']
        }
      }));
    } catch (error) {
      throw error;
    }
  };

  const getMatchesByTournament = async (tournamentId: number): Promise<MatchWithAthletes[]> => {
    try {
      const db = await openDatabase();
      const matches = await db.getAllAsync<MatchWithAthletes>(
        `
        SELECT 
          Match.*, 
          aoAthlete.AthleteId AS aoAthleteId, aoAthlete.firstname AS aoFirstname, aoAthlete.lastname AS aoLastname, 
          aoAthlete.features AS aoFeatures, aoAthlete.tactics AS aoTactics,
          akaAthlete.AthleteId AS akaAthleteId, akaAthlete.firstname AS akaFirstname, akaAthlete.lastname AS akaLastname,
          akaAthlete.features AS akaFeatures, akaAthlete.tactics AS akaTactics,
          Tournament.id AS tournamentId, Tournament.name AS tournamentName, Tournament.date AS tournamentDate
        FROM Match
        JOIN Athlete AS aoAthlete ON Match.aoAthleteId = aoAthlete.AthleteId
        JOIN Athlete AS akaAthlete ON Match.akaAthleteId = akaAthlete.AthleteId
        JOIN Tournament ON Match.tournamentId = Tournament.id
        WHERE Match.tournamentId = ?
        ORDER BY Match.id DESC
        `,
        [tournamentId]
      );
  
      // Mappiamo i risultati della query nel formato richiesto da MatchWithAthletes
      return matches.map((match: any) => ({
        ...match,
        aoAthlete: {
          AthleteId: match.aoAthleteId,
          firstname: match.aoFirstname,
          lastname: match.aoLastname,
          features: match.aoFeatures,
          tactics: match.aoTactics,
        },
        akaAthlete: {
          AthleteId: match.akaAthleteId,
          firstname: match.akaFirstname,
          lastname: match.akaLastname,
          features: match.akaFeatures,
          tactics: match.akaTactics,
        },
        tournament: {
          id: match.tournamentId,
          name: match.tournamentName,
          date: match.tournamentDate,
        },
      }));
    } catch (error) {
      throw error;
    }
  };

  const addMatch = async (match: Omit<Match, 'id'>): Promise<number> => {
    try {
      const db = await openDatabase();
      const result = await db.runAsync(`
        INSERT INTO Match (
          tournamentId, aoAthleteId, akaAthleteId,
          aoScore, akaScore,
          aoKizami, aoGyakuJodan, aoGyakuChudan, 
          aoJodanMawashi, aoChudanMawashi, aoUramawashi, aoSweep, 
          akaKizami, akaGyakuJodan, akaGyakuChudan, 
          akaJodanMawashi, akaChudanMawashi, akaUramawashi, akaSweep, 
          matchDescription, aoSummary, akaSummary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        match.tournamentId, match.aoAthleteId, match.akaAthleteId,
        match.aoScore, match.akaScore,
        match.aoKizami, match.aoGyakuJodan, match.aoGyakuChudan, 
        match.aoJodanMawashi, match.aoChudanMawashi, match.aoUramawashi, match.aoSweep,
        match.akaKizami, match.akaGyakuJodan, match.akaGyakuChudan,  
        match.akaJodanMawashi, match.akaChudanMawashi, match.akaUramawashi, match.akaSweep, 
        match.matchDescription, match.aoSummary, match.akaSummary, 
      ]);
      return result.lastInsertRowId;
    } catch (error) {
      throw error;
    }
  };

  const updateMatch = async (matchId: number, match: Partial<Match>): Promise<void> => {
    try {
      const sets = Object.entries(match)
        .filter(([key]) => key !== 'id')
        .map(([key]) => `${key} = ?`)
        .join(', ');
      
      const values = Object.entries(match)
        .filter(([key]) => key !== 'id')
        .map(([_, value]) => value);

      const db = await openDatabase();
      await db.runAsync(
        `UPDATE Match SET ${sets} WHERE id = ?`,
        [...values, matchId]
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteMatch = async (matchId: number): Promise<void> => {
    try {
      const db = await openDatabase();
      await db.runAsync('DELETE FROM Match WHERE id = ?', [matchId]);
    } catch (error) {
      throw error;
    }
  };

  const getMatchesByAthleteId = async (athleteId: number): Promise<MatchWithAthletes[]> => {
    try {
      const db = await openDatabase();
      const matches = await db.getAllAsync<MatchWithAthletes>(
        `
        SELECT 
          Match.*, 
          aoAthlete.AthleteId AS aoAthleteId, aoAthlete.firstname AS aoFirstname, aoAthlete.lastname AS aoLastname, 
          aoAthlete.features AS aoFeatures, aoAthlete.tactics AS aoTactics,
          akaAthlete.AthleteId AS akaAthleteId, akaAthlete.firstname AS akaFirstname, akaAthlete.lastname AS akaLastname,
          akaAthlete.features AS akaFeatures, akaAthlete.tactics AS akaTactics,
          Tournament.id AS tournamentId, Tournament.name AS tournamentName, Tournament.date AS tournamentDate
        FROM Match
        JOIN Athlete AS aoAthlete ON Match.aoAthleteId = aoAthlete.AthleteId
        JOIN Athlete AS akaAthlete ON Match.akaAthleteId = akaAthlete.AthleteId
        JOIN Tournament ON Match.tournamentId = Tournament.id
        WHERE aoAthlete.AthleteId = ? OR akaAthlete.AthleteId = ? 
        ORDER BY Match.id DESC
        `,
        [athleteId]
      );
  
      // Mappiamo i risultati della query nel formato richiesto da MatchWithAthletes
      return matches.map((match: any) => ({
        ...match,
        aoAthlete: {
          AthleteId: match.aoAthleteId,
          firstname: match.aoFirstname,
          lastname: match.aoLastname,
          features: match.aoFeatures,
          tactics: match.aoTactics,
        },
        akaAthlete: {
          AthleteId: match.akaAthleteId,
          firstname: match.akaFirstname,
          lastname: match.akaLastname,
          features: match.akaFeatures,
          tactics: match.akaTactics,
        },
        tournament: {
          id: match.tournamentId,
          name: match.tournamentName,
          date: match.tournamentDate,
        },
      }));
    } catch (error) {
      throw error;
    }
  }

  return {
    getMatchById, 
    getMatchesWithDetails,
    getMatchesByTournament,
    addMatch,
    updateMatch,
    deleteMatch,
    getMatchesByAthleteId
  };
}

// Tournaments Hook
export function useTournaments() {

  const getTournaments = async (): Promise<Tournament[]> => {
    try {
      const db = await openDatabase();
      return await db.getAllAsync<Tournament>(
        'SELECT * FROM Tournament ORDER BY date DESC'
      );
    } catch (error) {
      throw error;
    }
  };

  const getTournamentById = async (id: number): Promise<Tournament | null> => {
    try {
      const db = await openDatabase();
      return await db.getFirstAsync<Tournament>(
        'SELECT * FROM Tournament WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  };

  const addTournament = async (name: string, date: string): Promise<number> => {
    try {
      const db = await openDatabase();
      const result = await db.runAsync(
        'INSERT INTO Tournament (name, date) VALUES (?, ?)',
        [name, date]
      );
      return result.lastInsertRowId;
    } catch (error) {
      throw error;
    }
  };

  const updateTournament = async (
    id: number,
    name: string,
    date: string
  ): Promise<void> => {
    try {
      const db = await openDatabase();
      await db.runAsync(
        'UPDATE Tournament SET name = ?, date = ? WHERE id = ?',
        [name, date, id]
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteTournament = async (id: number): Promise<void> => {
    try {
      const db = await openDatabase();
      await db.runAsync('BEGIN TRANSACTION');
      
      // Elimina prima tutti i match associati
      await db.runAsync('DELETE FROM Match WHERE tournamentId = ?', [id]);
      
      // Poi elimina il torneo
      await db.runAsync('DELETE FROM Tournament WHERE id = ?', [id]);
      
      await db.runAsync('COMMIT');
    } catch (error) {
      const db = await openDatabase();
      await db.runAsync('ROLLBACK');
      throw error;
    }
  };

//   const getTournamentStats = async (id: number): Promise<{
//     totalMatches: number;
//     uniqueAthletes: number;
//   }> => {
//     try {
//       return await db.getFirstAsync<{ totalMatches: number; uniqueAthletes: number }>(`
//         SELECT 
//           COUNT(*) as totalMatches,
//           COUNT(DISTINCT aoAthleteId) + COUNT(DISTINCT akaAthleteId) as uniqueAthletes
//         FROM Match
//         WHERE tournamentId = ?
//       `, [id]);
//     } catch (error) {
//       .error('Error fetching tournament stats:', error);
//       throw error;
//     }
//   };

  return {
    getTournaments,
    getTournamentById,
    addTournament,
    updateTournament,
    deleteTournament,
    // getTournamentStats
  };
}