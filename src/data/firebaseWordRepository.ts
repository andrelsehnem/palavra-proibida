import { Consts, type LanguageCode } from './Consts';
import type { WordCard } from '../domain/types';
import type { WordRepository } from './wordRepository';

export class FirebaseWordRepository implements WordRepository {
  private language: LanguageCode;

  constructor(language: LanguageCode = Consts.DEFAULT_LANGUAGE) {
    this.language = language;
  }

  async getWords(): Promise<WordCard[]> {
    throw new Error(
      'FirebaseWordRepository ainda nao foi implementado. Use o repositorio JSON por enquanto.',
    );
  }
}
