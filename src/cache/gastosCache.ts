import { createListCache } from './listCache';
import type { Gasto } from '../types/Gasto';

export const gastosCache = createListCache<Gasto>();
