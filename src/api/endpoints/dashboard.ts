import { apiGet } from '@/api/client';
import type { Categoria, SaldoMensal, Cartao } from '@/types/Dashboard';

export function listarSaldoMensal(ano: string) {
   return apiGet<SaldoMensal[]>({
      acao: 'listarSaldoMensal',
      ano
   });
}

export function listarTopCategorias(mes: string, ano: string) {
   return apiGet<Categoria[]>({
      acao: 'listarTopCategorias',
      mes,
      ano
   });
}

export function listarCartoesResumo(mes: string, ano: string) {
   return apiGet<Cartao[]>({
      acao: 'listarCartoesResumo',
      mes,
      ano
   });
}