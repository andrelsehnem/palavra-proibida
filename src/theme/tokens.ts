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

// Paleta alinhada com a tela inicial (MENU_COLORS em MenuScreen.tsx).
export const TOKENS: Record<ThemeMode, ThemeTokens> = {
  light: {
    mode: 'light',
    background: '#F3F0E8',
    panel: '#FFFFFF',
    text: '#111827',
    mutedText: '#4B5563',
    border: '#D9D4C7',
    primary: '#1F66E5',
    primaryText: '#FFFFFF',
    success: '#2F9E44',
    warning: '#C2410C',
    shadow: 'rgba(17, 24, 39, 0.18)',
  },
  dark: {
    mode: 'dark',
    background: '#0A0F1F',
    panel: '#151B2E',
    text: '#F5F7FF',
    mutedText: '#B4BDD1',
    border: '#2A3350',
    primary: '#1F66E5',
    primaryText: '#FFFFFF',
    success: '#2FA84F',
    warning: '#FF9F43',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
};
