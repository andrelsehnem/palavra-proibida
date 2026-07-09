import type { RepositorySource } from './wordRepository';

const source = process.env.EXPO_PUBLIC_WORD_SOURCE;

export const WORD_REPOSITORY_SOURCE: RepositorySource =
  source === 'firebase' ? 'firebase' : 'json';
