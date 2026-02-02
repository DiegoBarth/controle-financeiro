import { createListCache } from './listCache';
import type { Receita } from '../types/Receita';

export const receitasCache = createListCache<Receita>();