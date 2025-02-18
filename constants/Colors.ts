
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
  
  const lightTheme: ThemeColors = {
    background: "#F5F7FA",  // Sfondo più morbido per ridurre l'affaticamento visivo
    primary: "#3D5A80",     // Mantiene il primario originale
    secondary: "#6497C6",   // Un blu più equilibrato per una migliore armonia
    accent: "#1B2A41",      // Accent leggermente più chiaro per un miglior contrasto
    textPrimary: "#1E2A38", // Testo più scuro per migliorare la leggibilità
    textSecondary: "rgba(30, 42, 56, 0.7)", // Adattato al nuovo testo primario
    cardBackground: "#E1ECF5", // Sfondo delle card più chiaro per un effetto più pulito
    error: "#D9534F",       // Rosso più neutro per una migliore accessibilità
    border: "#CBD5E1",      // Bordo più sottile e armonizzato con il background
  };
  
  
  const darkTheme: ThemeColors = {
    background: "#121B25",  // Sfondo scuro bilanciato per non essere troppo nero
    primary: "#507CA6",     // Una tonalità più chiara del primario per maggiore visibilità
    secondary: "#81B3D2",   // Adattato per risaltare meglio sullo sfondo scuro
    accent: "#A6C5E6",      // Accent più chiaro per contrastare bene
    textPrimary: "#E0E6ED", // Testo chiaro su sfondo scuro
    textSecondary: "rgba(224, 230, 237, 0.7)", // Testo secondario più morbido
    cardBackground: "#1C2A3A", // Sfondo delle card leggermente più chiaro dello sfondo
    error: "#E57373",       // Rosso più leggibile su sfondo scuro
    border: "#3A4A5E",      // Bordo più tenue per non essere troppo aggressivo
  };
  
  
  
  export { ThemeColors, lightTheme, darkTheme }; 