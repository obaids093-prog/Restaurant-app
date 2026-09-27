/**
 * AURA — Design System & Theme Engine
 * Ultra-luxury culinary palette inspired by botanical emerald, obsidian slate,
 * and champagne gold accents. Engineered for seamless light/dark mode transitions.
 */

export const colors = {
  light: {
    // Brand Accents
    primary: '#0D9488', // Radiant Emerald Teal
    primaryDark: '#0F766E',
    primaryLight: '#2DD4BF',
    secondary: '#D97706', // Warm Champagne Amber
    secondaryLight: '#F59E0B',
    accent: '#059669', // Deep Jade

    // Background & Surfaces
    background: '#F8FAFC', // Crisp porcelain slate
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    surfaceBorder: '#E2E8F0',
    surfaceGlow: 'rgba(13, 148, 136, 0.08)',

    // Typography
    textPrimary: '#0F172A', // Deep slate obsidian
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // Card & Elevated UI
    card: '#FFFFFF',
    cardBorder: 'rgba(13, 148, 136, 0.12)',
    cardHover: '#F8FAFC',

    // Form Inputs
    inputBackground: '#F8FAFC',
    inputBorder: '#E2E8F0',
    inputFocusBorder: '#0D9488',

    // System States
    error: '#E11D48', // Rose crimson
    errorBackground: '#FFE4E6',
    success: '#10B981', // Vivid Emerald
    successBackground: '#D1FAE5',
    warning: '#F59E0B',
    warningBackground: '#FEF3C7',

    // Badges & Pills
    badge: '#CCFBF1',
    badgeText: '#0F766E',
    goldBadge: '#FEF3C7',
    goldBadgeText: '#B45309',

    // Gradients
    gradientStart: '#0D9488',
    gradientEnd: '#0F766E',
    gradientSurface: ['#FFFFFF', '#F8FAFC'],

    // Tab Bar & Navigation
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    shadowColor: '#0F172A',
  },
  dark: {
    // Brand Accents
    primary: '#14B8A6', // Luminous Emerald Sage
    primaryDark: '#0D9488',
    primaryLight: '#5EEAD4',
    secondary: '#FBBF24', // Radiant Champagne Gold
    secondaryLight: '#FDE68A',
    accent: '#34D399',

    // Background & Surfaces
    background: '#0B1117', // Nocturne Midnight Slate
    surface: '#131B26',
    surfaceSubtle: '#1C2638',
    surfaceBorder: '#293548',
    surfaceGlow: 'rgba(20, 184, 166, 0.15)',

    // Typography
    textPrimary: '#F8FAFC', // Luminous pearl
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0B1117',

    // Card & Elevated UI
    card: '#131B26',
    cardBorder: 'rgba(20, 184, 166, 0.2)',
    cardHover: '#1C2638',

    // Form Inputs
    inputBackground: '#162030',
    inputBorder: '#293548',
    inputFocusBorder: '#14B8A6',

    // System States
    error: '#FB7185',
    errorBackground: '#2E151E',
    success: '#34D399',
    successBackground: '#062E22',
    warning: '#FCD34D',
    warningBackground: '#2E2208',

    // Badges & Pills
    badge: '#042F2E',
    badgeText: '#5EEAD4',
    goldBadge: '#382806',
    goldBadgeText: '#FDE68A',

    // Gradients
    gradientStart: '#14B8A6',
    gradientEnd: '#0D9488',
    gradientSurface: ['#1A2536', '#111827'],

    // Tab Bar & Navigation
    tabBar: '#0E1622',
    tabBarBorder: '#1E293B',
    shadowColor: '#000000',
  },
};

export const shadows = {
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  medium3D: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  deep3D: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  button3D: {
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const typography = {
  titleLarge: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  titleMedium: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  titleSmall: { fontSize: 18, fontWeight: '700' },
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  button: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
};

export default { colors, shadows, typography };
