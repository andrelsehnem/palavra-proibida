import { FirebaseWordRepository } from './firebaseWordRepository';
import { JsonWordRepository } from './jsonWordRepository';
import { Consts, type LanguageCode } from './Consts';
import type { WordCard } from '../domain/types';

export interface WordRepository {
  getWords(): Promise<WordCard[]>;
}

export type RepositorySource = 'json' | 'firebase';

export const createWordRepository = (
  source: RepositorySource = 'json',
  language: LanguageCode = Consts.DEFAULT_LANGUAGE,
): WordRepository => {
  if (source === 'firebase') {
    return new FirebaseWordRepository(language);
  }

  return new JsonWordRepository(language);
};
