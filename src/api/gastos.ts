import { apiGet, apiPost } from './client';
import type { Gasto } from '../types/Gasto';
import { gastosCache } from '../cache/gastosCache';

export async function criarGasto(payload: {
   data: string;
   descricao: string;
   categoria: string;
   valor: number;
}, mes: string, ano: string) {
   console.log(mes, ano)
   const res = await apiPost({
      acao: 'criarGasto',
      ...payload
   });

   // gastosCache.set(mes, ano, payload);

   return res;
}

export async function listarGastos(mes: string, ano: number) {
  const cached = gastosCache.get(mes, ano);
  if (cached) return cached;

   const dados = await apiGet<Gasto[]>({
      acao: 'listarGastos',
      mes,
      ano
   });

   gastosCache.set(mes, ano, dados);

   return dados;
}

export async function excluirGasto(rowIndex: number, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'excluirGasto',
      rowIndex
   });

   gastosCache.remove(mes, ano, rowIndex);

   return res;
}

export async function atualizarGasto(payload: {
   rowIndex: number;
   valor: number;
   data: string;
}, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'atualizarGasto',
      ...payload
   });

   gastosCache.update(mes, ano, payload);

   return res;
}