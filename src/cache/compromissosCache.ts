import { createListCache } from './listCache';
import type { Compromisso } from '../types/Compromisso';

export const compromissosCache = createListCache<Compromisso>();
