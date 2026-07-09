@AGENTS.md

## Regras (obrigatórias)
- NUNCA rodar git (commit, push, etc.).
- Responder sempre em pt-br.
- Perguntar sempre que houver dúvida/decisão.
- Expo SDK 56: consultar https://docs.expo.dev/versions/v56.0.0/ antes de codar.

## Projeto
"Palavra Proibida" — jogo mobile-first (Expo/React Native + web) tipo Taboo. TS, sem navigation lib (fluxo de telas por estado). Entry: `index.ts` → `App.tsx`.

Stack: Expo 56, React 19 / RN 0.85, expo-audio, lottie, AsyncStorage.

## Arquitetura
`App.tsx` orquestra tudo: carrega palavras (por idioma), controla tema dark/light, e renderiza uma das telas via flags do `useAppScreenFlow`.

Fluxo de telas: Menu → Themes → (Game | TeamGame → TeamResults).

### src/
- `screens/` — MenuScreen, ThemesScreen, GameScreen, TeamGameScreen, TeamResultsScreen.
- `components/` — buttons/, cards/ (StatCard, ThemeChip, WordGameCard, LanguageDropdown), layout/AtmosphereScreen.
- `hooks/` — useGameRound (modo clássico), useTeamGameRound (modo equipes c/ timer), useAppScreenFlow (roteamento), useThemePreference, useLanguagePreference.
- `domain/` — types.ts (WordCard, TeamGameSettings, TeamScore, TeamRoundStatus...), roundDeck.ts (embaralha Fisher-Yates, sem repetição na rodada).
- `data/` — wordRepository.ts (fábrica/contrato), jsonWordRepository.ts (atual), firebaseWordRepository.ts (stub), repositoryConfig.ts (lê `EXPO_PUBLIC_WORD_SOURCE`), themes.ts, Consts.ts, timeoutAlert.ts.
- `theme/` — tokens.ts, fonts.ts, scenePalette.ts.

### Modos de jogo
- Clássico: acerto/pulo sobre deck embaralhado dos temas selecionados.
- Equipes: N times, timer por turno, placar, tela de resultados com vencedor/empate.

### i18n
Idioma persistido; troca recarrega as palavras (repo é criado por idioma).

### Fonte de dados (JSON → Firebase futuro)
1. Implementar `getWords()` em firebaseWordRepository.ts.
2. `EXPO_PUBLIC_WORD_SOURCE=firebase` (ver `.env.example`).
3. Reiniciar bundler.

## Scripts
`npm run dev` (start) · `android` · `ios` · `web` · `lint` · `build` (export web) · `build:android:store` (bundle release) · `android:version:bump`.
