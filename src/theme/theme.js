/**
 * Theme Design System
 * Features custom light and dark palettes with warm culinary accents,
 * 3D isometric shadow elevations, and glassmorphic card borders.
 */

export const colors = {
  light: {
    primary: '#E65100', // Saffron amber-orange
    primaryDark: '#BF360C',
    primaryLight: '#FF8A65',
    secondary: '#FFB300', // Golden honey
    accent: '#D84315',
    background: '#FDFBF7', // Warm ivory cream
    surface: '#FFFFFF',
    surfaceSubtle: '#F4EFEA',
    surfaceBorder: '#EADECE',
    textPrimary: '#1E140A',
    textSecondary: '#6B5E51',
    textMuted: '#9E9284',
    textInverse: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: 'rgba(230, 81, 0, 0.12)',
    inputBackground: '#F7F3EE',
    inputBorder: '#E2D9CF',
    inputFocusBorder: '#E65100',
    error: '#D32F2F',
    errorBackground: '#FFEBEE',
    success: '#2E7D32',
    successBackground: '#E8F5E9',
    badge: '#FFF3E0',
    badgeText: '#E65100',
    gradientStart: '#FF7043',
    gradientEnd: '#E65100',
    gradientSurface: ['#FFFFFF', '#FAF5EF'],
    shadowColor: '#2D1B00',
    tabBar: '#FFFFFF',
    tabBarBorder: '#EFE6DC',
  },
  dark: {
    primary: '#FF7043',
    primaryDark: '#E65100',
    primaryLight: '#FFAB91',
    secondary: '#FFCA28',
    accent: '#FF5722',
    background: '#120F0D', // Deep warm obsidian
    surface: '#1E1915',
    surfaceSubtle: '#27201B',
    surfaceBorder: '#3D332A',
    textPrimary: '#FFF8F2',
    textSecondary: '#B8A89A',
    textMuted: '#7D7063',
    textInverse: '#120F0D',
    card: '#1F1A16',
    cardBorder: 'rgba(255, 112, 67, 0.2)',
    inputBackground: '#26201B',
    inputBorder: '#3C3229',
    inputFocusBorder: '#FF7043',
    error: '#EF5350',
    errorBackground: '#2C1517',
    success: '#66BB6A',
    successBackground: '#132817',
    badge: '#3A2518',
    badgeText: '#FFAB91',
    gradientStart: '#FF7043',
    gradientEnd: '#D84315',
    gradientSurface: ['#231C17', '#181411'],
    shadowColor: '#000000',
    tabBar: '#181411',
    tabBarBorder: '#2C231C',
  },
};

export const shadows = {
  soft: {
    shadowColor: '#301800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  medium3D: {
    shadowColor: '#2E1500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  deep3D: {
    shadowColor: '#260F00',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    elevation: 12,
  },
  button3D: {
    shadowColor: '#C43E00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const typography = {
  titleLarge: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  titleMedium: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  titleSmall: { fontSize: 18, fontWeight: '700' },
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  button: { fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
};
