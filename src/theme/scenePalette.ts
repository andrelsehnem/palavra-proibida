import type { ThemeMode } from '../domain/types';

export interface ScenePalette {
  canvas: string;
  glowA: string;
  glowB: string;
  rail: string;
  chipPanel: string;
  cardShadow: string;
  topTag: string;
}

export const getScenePalette = (mode: ThemeMode): ScenePalette => {
  if (mode === 'dark') {
    return {
      canvas: '#090d13',
      glowA: '#2f81f744',
      glowB: '#f0883e2f',
      rail: '#1f2b3b',
      chipPanel: '#111827',
      cardShadow: 'rgba(0, 0, 0, 0.45)',
      topTag: '#7dd3fc',
    };
  }

  return {
    canvas: '#f2efe8',
    glowA: '#1f6feb2f',
    glowB: '#e6770035',
    rail: '#cfd4df',
    chipPanel: '#fdfaf3',
    cardShadow: 'rgba(34, 48, 74, 0.16)',
    topTag: '#0f4c81',
  };
};
