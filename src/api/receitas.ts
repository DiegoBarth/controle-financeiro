import { apiGet, apiPost } from './client';
import type { Receita } from '../types/Receita';

export function criarReceita(payload: {
   dataPrevista: string;
   dataRecebimento: string;
   descricao: string;
   valor: number;
}) {
   return apiPost({
      acao: 'criarReceita',
      ...payload
   });
}

export function listarReceitas(mes: string, ano: string) {
   return apiGet<Receita[]>({
      acao: 'listarReceitas',
      mes,
      ano
   });
}

export function excluirReceita(rowIndex: number) {
   return apiPost({
      acao: 'excluirReceita',
      rowIndex
   });
}

export function atualizarReceita(payload: {
   rowIndex: number;
   valor: number;
   dataRecebimento: string;
}) {
   return apiPost({
      acao: 'atualizarReceita',
      ...payload
   });
}