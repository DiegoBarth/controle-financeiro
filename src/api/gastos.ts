import { apiGet, apiPost } from './client';
import type { Gasto } from '../types/Gasto';
import { gastosCache } from '../cache/gastosCache';
import { formatarDataBR } from '../utils/formatadores';

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

   gastosCache.add(res, 'dataPagamento');

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
   dataPagamento: string;
}, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'atualizarGasto',
      ...payload
   });

   payload.dataPagamento = formatarDataBR(payload.dataPagamento);

   gastosCache.update(mes, ano, payload);

   return res;
}