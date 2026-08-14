# Palavra Proibida

Aplicativo mobile-first em Expo (React Native) com suporte web, preparado para evoluir de banco local em JSON para Firebase no futuro.

## O que ja esta implementado

- Selecionar um ou mais temas para a rodada.
- Rodada sem repeticao de frase ate terminar a lista ou finalizar o jogo.
- Dark/light theme com persistencia local da preferencia.
- Repositorio de palavras desacoplado da UI para trocar JSON por Firebase.
- Base inicial com 30 palavras por tema em JSON.

## Stack

- Expo SDK 56
- React Native + React
- TypeScript
- AsyncStorage para salvar tema

## Rodando o projeto

```bash
npm install
npm run start
npm run android
npm run web
```

## Estrutura principal

- `App.tsx`: tela principal e fluxo de jogo.
- `src/data/words.json`: banco local de palavras por tema.
- `src/data/wordRepository.ts`: contrato/fabrica de repositorio.
- `src/data/jsonWordRepository.ts`: implementacao atual via JSON.
- `src/data/firebaseWordRepository.ts`: stub para futura integracao Firebase.
- `src/hooks/useThemePreference.ts`: persistencia de tema dark/light.
- `src/theme/tokens.ts`: design tokens do app.

## Troca futura para Firebase

1. Implementar `getWords()` em `src/data/firebaseWordRepository.ts`.
2. Definir `EXPO_PUBLIC_WORD_SOURCE=firebase` no ambiente.
3. Reiniciar o bundler.

## Config de ambiente

Use `.env.example` como referencia.

## AdMob intersticial (Android)

Integracao feita com `react-native-google-mobile-ads` (SDK nativo, Android only neste momento).

- App ID Android configurado no `app.json`.
- Intersticial exibido ao sair da rodada para o menu (modo classico e equipes).
- Em desenvolvimento, o app usa sempre `TestIds.INTERSTITIAL` (anuncio de teste oficial do Google).
- Em release Android, o app usa `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID`.
- Cooldown de 8 minutos entre exibicoes de intersticial.

### Variaveis

No `.env`:

```bash
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-7478664676745892/7217948330
EXPO_PUBLIC_ADS_ENABLED=true
```

### Como validar o anuncio de teste

1. Rode um build de desenvolvimento Android (nao funciona no Expo Go).
2. Inicie uma rodada.
3. Toque em sair.
4. O intersticial de teste deve abrir; ao fechar, o app volta ao menu.

### Observacoes

- Se o anuncio nao estiver carregado a tempo, o app segue para o menu normalmente (fallback sem travar UX).
- No Expo Go os anuncios sao desativados automaticamente para evitar erro de modulo nativo ausente.
- Para publicar na Play Store, marque que o app contem anuncios no App Content.

## Comportamento de repeticao

Cada novo jogo cria um embaralhamento novo (Fisher-Yates) do conjunto filtrado pelos temas selecionados. Durante a rodada, nenhuma frase se repete.
