import { apiGet } from './client';
import type { ResumoCompleto } from '../types/ResumoCompleto';
import type { Compromisso } from '../types/Compromisso';
import type { Receita } from '../types/Receita';
import type { Gasto } from '../types/Gasto';
import { compromissosCache } from '../cache/compromissosCache';
import { receitasCache } from '../cache/receitasCache';
import { gastosCache } from '../cache/gastosCache';

export interface Teste {
   compromissos: Compromisso[];
   receitas: Receita[];
   gastos: Gasto[];
}

export function listarResumoCompleto(mes: string, ano: string) {
   return apiGet<ResumoCompleto>({
      acao: 'listarResumoCompleto',
      mes,
      ano
   });
}
export async function listarDados(mes: string, ano: string) {
   const receitas =
      mes === 'all'
         ? receitasCache.getAll()
         : receitasCache.get(mes, ano);

   const gastos =
      mes === 'all'
         ? gastosCache.getAll()
         : gastosCache.get(mes, ano);


   const compromissos =
      mes === 'all'
         ? compromissosCache.getAll()
         : compromissosCache.get(mes, ano);

   if (receitas || gastos || compromissos) {
      return {
         compromissos: compromissosCache.get(mes, ano) || [],
         receitas: receitasCache.get(mes, ano) || [],
         gastos: gastosCache.get(mes, ano) || []
      };
   }
   const res = await apiGet<Teste>({
      acao: 'listarDados',
      mes,
      ano
   });

   res.compromissos?.forEach(c => compromissosCache.add(c, 'dataVencimento'));
   res.receitas?.forEach(r => receitasCache.add(r, 'dataPrevista'));
   res.gastos?.forEach(g => gastosCache.add(g, 'dataPagamento'));

   return res;
}