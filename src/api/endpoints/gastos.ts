import { apiGet, apiPost } from '@/api/client';
import type { Gasto } from '@/types/Gasto';

export async function criarGasto(payload: {
   data: string;
   descricao: string;
   categoria: string;
   valor: number;
}) {
   const res = await apiPost<Gasto>({
      acao: 'criarGasto',
      ...payload
   });

   return res;
}

export async function listarGastos(mes: string, ano: number) {
   const dados = await apiGet<Gasto[]>({
      acao: 'listarGastos',
      mes,
      ano
   });

   return dados;
}

export async function excluirGasto(rowIndex: number, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'excluirGasto',
      rowIndex
   });

   return res;
}

export async function atualizarGasto(payload: {
   rowIndex: number;
   valor: number;
}, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'atualizarGasto',
      ...payload
   });

   return res;
}