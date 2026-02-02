import { apiGet, apiPost } from './client';
import type { Compromisso } from '../types/Compromisso';
import { CompromissosCache } from '../cache/compromissosCache';

export async function listarCompromissos(mes: string, ano: string) {
   const cached = CompromissosCache.get(mes, ano);
   if (cached) return cached;

   const dados = await apiGet<Compromisso[]>({
      acao: 'listarCompromissos',
      mes,
      ano
   });

   CompromissosCache.set(mes, ano, dados);

   return dados;
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

export async function excluirCompromisso(rowIndex: number, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'excluirCompromisso',
      rowIndex
   });

   CompromissosCache.remove(mes, ano, rowIndex);

   return res;
}

export async function atualizarCompromisso(payload: {
   rowIndex: number;
   valor: number;
   dataPagamento: string;
}, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'atualizarCompromisso',
      ...payload
   });

   CompromissosCache.update(mes, ano, payload)

   return res;
}

export function criarCartao(payload: {
   descricao: string;
   categoria: string;
   cartao: string;
   valorTotal: number;
   parcelas: number;
   dataVencimento: string;
}, mes: string, ano: string) {
   console.log(mes, ano);
   return apiPost({
      acao: 'criarCartao',
      ...payload
   });
}