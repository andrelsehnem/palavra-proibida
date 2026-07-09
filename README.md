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

## Comportamento de repeticao

Cada novo jogo cria um embaralhamento novo (Fisher-Yates) do conjunto filtrado pelos temas selecionados. Durante a rodada, nenhuma frase se repete.
