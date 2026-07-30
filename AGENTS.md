# Palavra Proibida — Guia para Agentes de IA

## ⚠️ Versão Fixa: Expo SDK 56

Leia **obrigatoriamente** a documentação versionada em https://docs.expo.dev/versions/v56.0.0/ antes de implementar qualquer código. A API do Expo pode variar entre versões — use v56.0.0.

---

## Regras Obrigatórias

- **Idioma**: Responder sempre em português brasileiro (pt-br).
- **Git**: NUNCA rodar git (commit, push, pull, rebase) — isso é responsabilidade do usuário.
- **Decisões**: Perguntar sempre que houver ambiguidade ou múltiplas opções.
- **Documentação Expo**: Consultar [v56.0.0](https://docs.expo.dev/versions/v56.0.0/) antes de codar — não confiar em docs genéricas.

---

## Projeto

**"Palavra Proibida"** é um jogo mobile-first tipo Taboo (Expo + React Native + Web support), implementado em TypeScript, sem biblioteca de navegação — o fluxo de telas é gerenciado por estado (`useAppScreenFlow`).

### Stack Confirmado
- **Expo SDK**: ~56.0.8
- **React / React Native**: 19.2.3 / 0.85.3
- **TypeScript**: ~6.0.3
- **Audio**: expo-audio ~56.0.11
- **Animações**: lottie-react-native ~7.3.4
- **Persistência**: @react-native-async-storage/async-storage ^3.1.1

Para stack completo e como rodar, ver [README.md](README.md).

### Entry Point
- `index.ts` → `registerRootComponent(App)` → `App.tsx`
- `App.tsx` orquestra todo o estado global (tema, idioma, modo jogo) e renderiza telas via flags de `useAppScreenFlow`

### Scripts Essenciais
```bash
npm run dev          # Inicia dev server (default: iOS)
npm run android      # Roda em emulador Android
npm run web          # Roda em navegador
npm run lint         # ESLint check
npm run build        # Export web (HTML/CSS/JS)
npm run build:android:store  # Bundle release para Play Store
```

---

## Arquitetura

### Orquestração em `App.tsx`
- Carrega idioma e tema (AsyncStorage com fallbacks)
- Cria instância do repositório de palavras (`jsonWordRepository` ou `firebaseWordRepository`)
- Renderiza UMA tela por vez via flags booleanas: `showMenu`, `showThemes`, `showGame`, etc.
- Não usa react-navigation — fluxo é puro estado React

### Fluxo de Telas
```
Menu → Themes → Game (clássico ou Equipes) → Results (equipes) → Menu
```

### Estrutura de Diretórios
```
src/
├── screens/           # Telas principais (Menu, Themes, Game, TeamGame, Results)
├── components/        # Componentes reutilizáveis (buttons/, cards/, layout/)
├── hooks/             # Estado e lógica (gameRound, teamGameRound, screenFlow, etc.)
├── domain/            # Tipos e lógica pura (types.ts, roundDeck.ts)
├── data/              # Repositório, constantes, temas
└── theme/             # Design tokens, paletas, fontes
```

---

## Padrões de Desenvolvimento

### 1. Componentes
- **Props-driven**: Cada componente recebe cores, estilos e handlers via props.
- **Sem container/presentation split** explícito — simplificar.
- **Exemplo** (`ActionButton.tsx`): label, `onPress`, `backgroundColor`, `textColor`.
- **Exemplo** (`ThemeChip.tsx`): tema e `isSelected` controlam estilo visual.
- **Exemplo** (`WordGameCard.tsx`): exibe palavra e dicas.

### 2. Hooks (State Management)
Estado é **elevado em `App.tsx`** e passado via props — sem Redux/Zustand.

- **`useAppScreenFlow()`** — Flags de navegação (`showMenu`, `showThemes`, etc.) + funções para transitar entre telas.
- **`useGameRound()`** — Modo clássico: temas selecionados, deck embaralhado, pontuação, lógica de acerto/pulo.
- **`useTeamGameRound()`** — Modo equipes: N times, timer por turno, placar, status de rodada.
- **`useThemePreference()`** — Dark/Light persistido em AsyncStorage; retorna `isDark` e `setIsDark()`.
- **`useLanguagePreference()`** — Idioma persistido (pt-br, en-us, es-es); retorna `language` e `setLanguage()`.

**Padrão de uso**:
```tsx
const { isDark } = useThemePreference();
const colors = isDark ? themes.dark : themes.light;
// Renderizar com colors...
```

### 3. Estado Persistido
Todos os hooks de preferência usam **AsyncStorage** com fallbacks:

```tsx
// Exemplo: useThemePreference.ts
const [isDark, setIsDark] = useState(DEFAULT_THEME); // fallback
useEffect(() => {
  getThemeFromStorage().then(stored => setIsDark(stored ?? DEFAULT_THEME));
}, []);
```

### 4. Repositório de Palavras (Strategy Pattern)
- **Contrato**: `WordRepository` interface em [wordRepository.ts](src/data/wordRepository.ts)
- **Implementação atual**: `JsonWordRepository` lê [words.json](src/data/words.json)
- **Implementação futura**: `FirebaseWordRepository` (stub; ver "Pontos de Atenção")
- **Factory**: [repositoryConfig.ts](src/data/repositoryConfig.ts) lê `EXPO_PUBLIC_WORD_SOURCE` (env var)

Troca de repositório: basta mudar env var e reiniciar.

### 5. Internacionalização (i18n)
- **Definição**: [Consts.ts](src/data/Consts.ts) → `UI_TRANSLATIONS[language][key]`
- **Idiomas suportados**: pt-br, en-us, es-es
- **Persistência**: AsyncStorage (`palavra-proibida:language`), default pt-br
- **Hidratação**: Hook `useLanguagePreference()` com flag `isHydrated` para evitar SSR mismatch

Ao trocar idioma, o repositório de palavras é recriado (novas palavras do idioma).

---

## Convenções de Nomes

| Categoria              | Padrão                      | Exemplo                         |
|------------------------|-----------------------------|----------------------------------|
| **Componentes**        | PascalCase, sufixo `Screen` | `GameScreen.tsx`, `MenuScreen.tsx` |
| **Componentes UI**     | PascalCase                  | `ActionButton.tsx`, `ThemeChip.tsx` |
| **Hooks**              | camelCase, prefixo `use`    | `useGameRound`, `useThemePreference` |
| **Tipos/Interfaces**   | PascalCase                  | `WordCard`, `TeamGameSettings`, `ThemeMode` |
| **Constantes**         | UPPER_SNAKE_CASE            | `DEFAULT_LANGUAGE`, `ANIMATION_DURATION` |
| **Funções/Métodos**    | camelCase, verbosas         | `filterWordsByThemes`, `buildRoundDeck` |
| **Arquivos de dados**  | kebab-case                  | `words.json`, `themes.ts`        |
| **Arquivos de código** | PascalCase (componentes), camelCase (utils) | `ActionButton.tsx`, `useGameRound.ts` |
| **Props interfaces**   | `ComponentNameProps`        | `ActionButtonProps`, `GameScreenProps` |

---

## Estado e Persistência

### Tema (Dark/Light)
- **Persistência**: AsyncStorage chave `palavra-proibida:theme`
- **Hook**: `useThemePreference()` expõe `isDark` e `setIsDark()`
- **Paletas**: [scenePalette.ts](src/theme/scenePalette.ts) define cores por tema
- **Design Tokens**: [tokens.ts](src/theme/tokens.ts) centraliza spacing, typography, etc.

### Idioma
- **Persistência**: AsyncStorage chave `palavra-proibida:language`
- **Hook**: `useLanguagePreference()` expõe `language` e `setLanguage()`
- **Recarregamento**: Troca de idioma trigga recarregamento do repositório (novas palavras)
- **Suporte**: pt-br (default), en-us, es-es

### Modo de Jogo
- **Clássico**: Acerto/pulo sobre deck embaralhado (tema selecionado ou múltiplos temas)
- **Equipes**: N times, timer configurável, placar persistido durante rodada, tela de resultados com vencedor
- **Embaralhamento**: Fisher-Yates (sem repetição na mesma rodada)

---

## Pontos de Atenção

### ⚠️ Firebase Ainda é Stub
- [firebaseWordRepository.ts](src/data/firebaseWordRepository.ts) não implementa `getWords()`
- Para ativar: implementar método, definir `EXPO_PUBLIC_WORD_SOURCE=firebase` e reiniciar
- Ver [README.md](README.md) para passos completos

### ⚠️ Sem Testes Automatizados
- Nenhum framework de testes configurado (Jest, Testing Library, etc.)
- Testes são manuais no emulador/web
- Considerar adicionar quando features crescerem

### ⚠️ Error Handling Silencioso
- `AsyncStorage` errors são capturados mas não logados (try/catch vazio)
- Funcional em produção, mas difícil debugar; adicionar logging se necessário

### ✅ Sem Tech Debt Imediato
- Código bem estruturado, nomes descritivos
- Sem `console.log` de debug
- Sem `TODO` / `FIXME` abertos

---

## Imports Comuns

Para referência rápida ao criar/editar componentes:

```tsx
// Componente React Native
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';

// Hooks do projeto
import { useThemePreference } from '@/hooks/useThemePreference';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { useAppScreenFlow } from '@/hooks/useAppScreenFlow';

// Tipos
import { WordCard, TeamScore } from '@/domain/types';

// Constantes
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '@/data/Consts';

// Temas
import { scenePalette } from '@/theme/scenePalette';
import { tokens } from '@/theme/tokens';
```

---

## Links Rápidos

- **[README.md](README.md)**: Stack completo, como rodar, env vars, estrutura de pastas
- **[CLAUDE.md](CLAUDE.md)**: Referência pessoal de regras (source deste arquivo)
- **[Expo v56 Docs](https://docs.expo.dev/versions/v56.0.0/)**: Documentação oficial (obrigatório antes de codar)
- **[src/domain/types.ts](src/domain/types.ts)**: Tipos compartilhados (`WordCard`, `TeamGameSettings`, etc.)
- **[src/data/Consts.ts](src/data/Consts.ts)**: Constantes globais e i18n
- **[src/theme/tokens.ts](src/theme/tokens.ts)**: Design tokens

---

**Última atualização**: Julho 2026 | **Versão Expo**: 56.0.8
