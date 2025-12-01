import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';
import { palette } from './colors';

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    surface: palette.surface,
    background: palette.background,
    onSurface: palette.text,
    outline: palette.divider,
    error: palette.danger,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
