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
      canvas: '#0A0F1F',
      glowA: '#2f81f744',
      glowB: '#f0883e2f',
      rail: '#2A3350',
      chipPanel: '#10162A',
      cardShadow: 'rgba(0, 0, 0, 0.45)',
      topTag: '#8DB8FF',
    };
  }

  return {
    canvas: '#F3F0E8',
    glowA: '#1f6feb2f',
    glowB: '#e6770035',
    rail: '#D9D4C7',
    chipPanel: '#FBF8F1',
    cardShadow: 'rgba(17, 24, 39, 0.18)',
    topTag: '#1A56C4',
  };
};
