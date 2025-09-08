// Palette de couleurs thématique - Rust, Terracotta, Grey, Sage Green, Fern Green, Crème
export const colors = {
  // Couleurs principales - Thème terre et nature
  primary: '#B7410E',        // Rust profond - Boutons principaux
  primaryDark: '#8B2F0A',    // Rust foncé - Hover states
  secondary: '#E07A5F',      // Terracotta doux - Accents secondaires
  accent: '#6B8E6B',         // Sage Green - Highlights et call-to-action
  
  // Couleurs de fond
  background: '#F5F5DC',     // Crème doux - Fond principal
  backgroundSecondary: '#FEFEF8', // Crème très clair - Fond secondaire
  surface: '#FFFFFF',        // Blanc pur - Cartes et surfaces
  surfaceVariant: '#F8F6F0', // Crème subtil - Surfaces alternatives
  
  // Couleurs de texte
  textPrimary: '#3C3C3C',    // Gris foncé - Texte principal
  textSecondary: '#6B6B6B',  // Gris moyen - Texte secondaire
  textTertiary: '#9B9B9B',   // Gris clair - Texte tertiaire
  textOnPrimary: '#FFFFFF',  // Blanc - Texte sur fond coloré
  
  // Couleurs de bordure et séparateurs
  border: '#D4C4A8',         // Gris chaud - Bordures légères
  borderFocus: '#B7410E',    // Rust - Bordures focus
  divider: '#D4C4A8',        // Gris chaud - Séparateurs
  
  // Couleurs de statut
  success: '#4A7C59',        // Fern Green - Succès
  warning: '#B7410E',        // Rust - Avertissement
  error: '#C65D7B',          // Rose terracotta - Erreur
  info: '#6B8E6B',           // Sage Green - Information
  
  // Couleurs système
  white: '#FFFFFF',
  black: '#000000',
  
  // Couleurs d'état
  disabled: '#9B9B9B',       // Gris clair - Éléments désactivés
  placeholder: '#9B9B9B',    // Gris clair - Placeholders
  
  // Couleurs d'ombre
  shadow: 'rgba(183, 65, 14, 0.1)',  // Ombre rust subtile
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  
  // Couleurs de gradient (pour les effets subtils)
  gradientStart: '#B7410E',  // Rust
  gradientEnd: '#6B8E6B',    // Sage Green
  
  // Couleurs thématiques spécifiques
  rust: '#B7410E',           // Rust principal
  rustLight: '#D2691E',      // Rust clair
  terracotta: '#E07A5F',     // Terracotta
  terracottaLight: '#F4A460', // Terracotta clair
  grey: '#6B6B6B',           // Gris moyen
  greyLight: '#9B9B9B',      // Gris clair
  sageGreen: '#6B8E6B',      // Sage Green
  sageGreenLight: '#8FBC8F', // Sage Green clair
  fernGreen: '#4A7C59',      // Fern Green
  fernGreenLight: '#6B8E6B', // Fern Green clair
  creme: '#F5F5DC',          // Crème
  cremeLight: '#FEFEF8',     // Crème très clair
};

// Thème pour React Native Paper
export const paperTheme = {
  colors: {
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    text: colors.textPrimary,
    placeholder: colors.placeholder,
    disabled: colors.disabled,
    error: colors.error,
  },
};
