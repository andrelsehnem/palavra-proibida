import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ThemeMode } from '../../domain/types';
import type { ScenePalette } from '../../theme/scenePalette';

interface AtmosphereScreenProps {
  mode: ThemeMode;
  scene: ScenePalette;
  children: React.ReactNode;
}

export function AtmosphereScreen({ mode, scene, children }: AtmosphereScreenProps) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: scene.canvas }]}> 
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <View pointerEvents="none" style={styles.backdropLayer}>
        <View style={[styles.glowOrbLarge, { backgroundColor: scene.glowA }]} />
        <View style={[styles.glowOrbSmall, { backgroundColor: scene.glowB }]} />
      </View>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backdropLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glowOrbLarge: {
    position: 'absolute',
    top: -130,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 999,
  },
  glowOrbSmall: {
    position: 'absolute',
    left: -70,
    bottom: -50,
    width: 180,
    height: 180,
    borderRadius: 999,
  },
});
