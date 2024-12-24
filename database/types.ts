export interface Athlete {
    AthleteId: number;
    firstname: string;
    lastname: string;
    features: string, 
    tactics: string
  }
  
  export interface Match {
    id: number;
    tournamentId: number;
    aoAthleteId: number;
    akaAthleteId: number;
    
    aoScore: number;
    akaScore: number;
    
    // AO techniques
    aoKizami: number;
    aoGyakuJodan: number;
    aoGyakuChudan: number;

    aoJodanMawashi: number;
    aoChudanMawashi: number;
    aoUramawashi: number;

    aoSweep: number; 
    
    // AKA techniques
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
  }
  
  export interface Tournament {
    id: number;
    name: string;
    date: string;
  }
  
  export interface MatchWithAthletes extends Match {
    aoAthlete: Athlete;
    akaAthlete: Athlete;
    tournament: Tournament;
  }