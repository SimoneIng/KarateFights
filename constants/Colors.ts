
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
    background: "#fff", // Sfondo tema chiaro
    primary: "#3D5A80",    // Colore primario
    secondary: "#98C1D9",  // Colore secondario
    accent: "#0B1B2D",     // Colore di accento
    textPrimary: "#293241", // Testo principale
    textSecondary: "rgba(5, 5, 6, 0.7)", // Testo secondario
    cardBackground: "#AEC9E5", // Sfondo delle card o superfici secondarie
    error: "#EE6C4D",       // Colore per errori
    border: "#d9d9d9",      // Colore dei bordi
  };
  
  const darkTheme:ThemeColors = {
    background: "#fff", // Sfondo tema chiaro
    primary: "#3D5A80",    // Colore primario
    secondary: "#98C1D9",  // Colore secondario
    accent: "#0B1B2D",     // Colore di accento
    textPrimary: "#293241", // Testo principale
    textSecondary: "rgba(5, 5, 6, 0.7)", // Testo secondario
    cardBackground: "#AEC9E5", // Sfondo delle card o superfici secondarie
    error: "#EE6C4D",       // Colore per errori
    border: "#d9d9d9",      // Colore dei bordi
  };
  
  
  export { ThemeColors, lightTheme, darkTheme }; 