import { apiGet, apiPost } from './client';
import type { Compromisso } from '../types/Compromisso';

export function listarCompromissos(mes: string, ano: string) {
   return apiGet<Compromisso[]>({
      acao: 'listarCompromissos',
      mes,
      ano
   });
}

export function criarCompromisso(payload: {
   descricao: string;
   categoria: string;
   tipo: 'fixo' | 'variavel';
   valor: number;
}) {
   return apiPost({
      acao: 'criarCompromisso',
      ...payload
   });
}

export function excluirCompromisso(rowIndex: number) {
   return apiPost({
      acao: 'excluirCompromisso',
      rowIndex
   });
}


export function atualizarCompromisso(payload: {
   rowIndex: number;
   valor: number;
   dataPagamento: string;
}) {
   return apiPost({
      acao: 'atualizarCompromisso',
      ...payload
   });
}

export function criarCartao(payload: {
   descricao: string;
   categoria: string;
   cartao: string;
   valorTotal: number;
   parcelas: number;
   dataVencimento: string;
}) {
   return apiPost({
      acao: 'criarCartao',
      ...payload
   });
}