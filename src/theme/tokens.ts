import type { ThemeMode } from '../domain/types';

export interface ThemeTokens {
  mode: ThemeMode;
  background: string;
  panel: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  primaryText: string;
  success: string;
  warning: string;
  shadow: string;
}

export const TOKENS: Record<ThemeMode, ThemeTokens> = {
  light: {
    mode: 'light',
    background: '#f6f7fb',
    panel: '#ffffff',
    text: '#1f2430',
    mutedText: '#5c6475',
    border: '#d8dce7',
    primary: '#1f6feb',
    primaryText: '#ffffff',
    success: '#2f9e44',
    warning: '#d9480f',
    shadow: 'rgba(9, 30, 66, 0.15)',
  },
  dark: {
    mode: 'dark',
    background: '#0d1117',
    panel: '#161b22',
    text: '#f0f6fc',
    mutedText: '#9aa4b2',
    border: '#2d333b',
    primary: '#2f81f7',
    primaryText: '#e6edf3',
    success: '#3fb950',
    warning: '#f0883e',
    shadow: 'rgba(1, 4, 9, 0.5)',
  },
};
