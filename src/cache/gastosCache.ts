import type { Gasto } from '../types/Gasto';
import { createListCache } from './listCache';

export const gastosCache = createListCache<Gasto>();
