import type { Compromisso } from '@/types/Compromisso';
import type { Gasto } from '@/types/Gasto';
import type { Receita } from '@/types/Receita';
import type { ResumoCompleto } from '@/types/ResumoCompleto';
import { apiGet } from '../client';

export interface Teste {
   compromissos: Compromisso[];
   receitas: Receita[];
   gastos: Gasto[];
}

export function verificarEmailPossuiAutorizacao(email: string) {
   return apiGet({
      acao: 'verificarEmailPossuiAutorizacao',
      email
   });
}

export function listarResumoCompleto(mes: string, ano: string) {
   return apiGet<ResumoCompleto>({
      acao: 'listarResumoCompleto',
      mes,
      ano
   });
}

export async function listarDados(mes: string, ano: string) {
   const res = await apiGet<Teste>({
      acao: 'listarDados',
      mes,
      ano
   });

   return res;
}