
interface ThemeColors {
    background: string;
    primary: string;
    secondary: string;
    accent: string; 
    textPrimary: string;
    textSecondary: string; 
    cardBackground: string;
    error: string;
    border: string;
  }
  
  // Definizione dei temi
  const lightTheme:ThemeColors = {
    background: "#edf2f4", // Sfondo tema chiaro
    primary: "#3D5A80",    // Colore primario
    secondary: "#98C1D9",  // Colore secondario
    accent: "#0496ff",     // Colore di accento
    textPrimary: "#293241", // Testo principale
    textSecondary: "rgba(41, 50, 65, 0.7)", // Testo secondario
    cardBackground: "#00072d", // Sfondo delle card o superfici secondarie
    error: "#EE6C4D",       // Colore per errori
    border: "#d9d9d9",      // Colore dei bordi
  };
  
  const darkTheme:ThemeColors = {
    background: "#edf2f4", // Sfondo tema chiaro
    primary: "#3D5A80",    // Colore primario
    secondary: "#98C1D9",  // Colore secondario
    accent: "#0496ff",     // Colore di accento
    textPrimary: "#293241", // Testo principale
    textSecondary: "rgba(41, 50, 65, 0.7)", // Testo secondario
    cardBackground: "#00072d", // Sfondo delle card o superfici secondarie
    error: "#EE6C4D",       // Colore per errori
    border: "#d9d9d9",      // Colore dei bordi
  };
  
  
  export { ThemeColors, lightTheme, darkTheme }; 