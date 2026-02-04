import type { Receita } from '../types/Receita';
import { createListCache } from './listCache';

export const receitasCache = createListCache<Receita>();