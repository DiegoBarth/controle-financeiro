import { apiGet, apiPost } from './client';
import type { Gasto } from '../types/Gasto';

export function criarGasto(payload: {
   data: string;
   descricao: string;
   categoria: string;
   valor: number;
}) {
   return apiPost({
      acao: 'criarGasto',
      ...payload
   });
}

export function listarGastos(mes: string, ano: string) {
   return apiGet<Gasto[]>({
      acao: 'listarGastos',
      mes,
      ano
   });
}

export function excluirGasto(rowIndex: number) {
   return apiPost({
      acao: 'excluirGasto',
      rowIndex
   });
}

export function atualizarGasto(payload: {
   rowIndex: number;
   valor: number;
   data: string;
}) {
   return apiPost({
      acao: 'atualizarGasto',
      ...payload
   });
}