import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ThemeMode } from '../../domain/types';
import type { ScenePalette } from '../../theme/scenePalette';

interface AtmosphereScreenProps {
  mode: ThemeMode;
  scene: ScenePalette;
  backgroundColor?: string;
  children: React.ReactNode;
}

export function AtmosphereScreen({ mode, scene, backgroundColor, children }: AtmosphereScreenProps) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: backgroundColor ?? scene.canvas }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
