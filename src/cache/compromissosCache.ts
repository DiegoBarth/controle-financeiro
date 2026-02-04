import type { Compromisso } from '../types/Compromisso';
import { createListCache } from './listCache';

export const compromissosCache = createListCache<Compromisso>();
