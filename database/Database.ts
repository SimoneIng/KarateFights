// Database.ts
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SQLiteProvider } from 'expo-sqlite';

const setupQueries = [
  `CREATE TABLE IF NOT EXISTS Athlete (
    AthleteId INTEGER PRIMARY KEY AUTOINCREMENT, 
    firstname VARCHAR(30), 
    lastname VARCHAR(30), 
    features TEXT DEFAULT " ", 
    tactics TEXT DEFAULT " ",
    CONSTRAINT athlete_names UNIQUE (firstname, lastname) 
  );`, 

  `CREATE TABLE IF NOT EXISTS Match (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournamentId INTEGER,
      aoAthleteId INTEGER,
      akaAthleteId INTEGER,

      aoScore INTEGER,
      akaScore INTEGER,

      aoKizami INTEGER,
      aoGyakuJodan INTEGER,
      aoGyakuChudan INTEGER,

      aoJodanMawashi INTEGER,
      aoChudanMawashi INTEGER,
      aoUramawashi INTEGER,

      aoSweep INTEGER, 

      akaKizami INTEGER,
      akaGyakuJodan INTEGER,
      akaGyakuChudan INTEGER,

      akaJodanMawashi INTEGER,
      akaChudanMawashi INTEGER,
      akaUramawashi INTEGER,

      akaSweep INTEGER, 

      matchDescription TEXT,
      aoSummary TEXT,
      akaSummary TEXT,
      aoHints TEXT,
      akaHints TEXT,

      FOREIGN KEY (tournamentId) REFERENCES Tournament(id),
      FOREIGN KEY (aoAthleteId) REFERENCES Athlete(AthleteId), 
      FOREIGN KEY (akaAthleteId) REFERENCES Athlete(AthleteId)  
  );`,

  `CREATE TABLE IF NOT EXISTS Tournament (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL
  );`
];

const destroyQueries = "DROP TABLE IF EXISTS Match; DROP TABLE IF EXISTS Tournament; DROP TABLE IF EXISTS Athlete;";  

const initializeDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('KarateFightsDB'); 

    setupQueries.forEach(async query => {
      await db.execAsync(query)
    })
  } catch(error) {
    throw new Error(error as string)
}
}


export { initializeDatabase, destroyQueries };