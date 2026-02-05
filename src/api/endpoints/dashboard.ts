import { apiGet } from '@/api/client';
import type { Categoria, SaldoMensal, Cartao } from '@/types/Dashboard';

export function listarDadosDashboard(mes: string, ano: string) {
   return apiGet<{
      saldoMensal: SaldoMensal[];
      topCategorias: Categoria[];
      resumoCartoes: Cartao[];
   }>({
      acao: 'listarDadosDashboard',
      mes,
      ano
   });
}