import { apiGet, apiPost } from '@/api/client';
import type { Compromisso } from '@/types/Compromisso';
import { formatarDataBR } from '@/utils/formatadores';

export async function listarCompromissos(mes: string, ano: string) {
   const dados = await apiGet<Compromisso[]>({
      acao: 'listarCompromissos',
      mes,
      ano
   });

   return dados;
}

export async function criarCompromisso(payload: {
   descricao: string;
   categoria: string;
   tipo: 'Fixo' | 'Variável';
   valor: number;
   dataVencimento: string;
   meses?: number;
}) {
   const res = await apiPost<Compromisso>({
      acao: 'criarCompromisso',
      ...payload
   });

   return res;
}

export async function criarCartao(payload: {
   descricao: string;
   categoria: string;
   cartao?: string;
   valor: number;
   tipo: string;
   parcelas?: number;
   dataVencimento: string;
}) {
   const res = await apiPost<Compromisso>({
      acao: 'criarCartao',
      ...payload
   });

   return res;
}

export async function excluirCompromisso(
   rowIndex: number,
   scope: 'single' | 'future' | 'all' = 'single'
) {
   const res = await apiPost({
      acao: 'excluirCompromisso',
      rowIndex,
      scope
   });

   return res;
}

export async function atualizarCompromisso(
   payload: { rowIndex: number; valor: number; dataPagamento: string; scope?: 'single' | 'future' }
) {
   const res = await apiPost({
      acao: 'atualizarCompromisso',
      ...payload
   });

   payload.dataPagamento = payload.dataPagamento ? formatarDataBR(payload.dataPagamento) : '';

   return res;
}
