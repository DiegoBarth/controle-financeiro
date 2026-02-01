import { apiGet } from './client';
import type { ResumoCompleto } from '../types/ResumoCompleto';

export function listarResumoCompleto(mes: string, ano: string) {
   return apiGet<ResumoCompleto>({
      acao: 'listarResumoCompleto',
      mes,
      ano
   });
}