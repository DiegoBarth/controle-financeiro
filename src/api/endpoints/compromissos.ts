import { apiGet, apiPost } from '@/api/client';
import { compromissosCache } from '@/cache/compromissosCache';
import type { Compromisso } from '@/types/Compromisso';
import { formatarDataBR } from '@/utils/formatadores';

export async function listarCompromissos(mes: string, ano: string) {
   const cached = compromissosCache.get(mes, ano);
   if (cached) return cached;

   const dados = await apiGet<Compromisso[]>({
      acao: 'listarCompromissos',
      mes,
      ano
   });

   compromissosCache.set(mes, ano, dados);
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
   const res = await apiPost<Compromisso[]>({
      acao: 'criarCompromisso',
      ...payload
   });

   res.forEach(p => compromissosCache.add(p, 'dataVencimento'));

   return res;
}

export async function criarCartao(payload: {
   descricao: string;
   categoria: string;
   cartao: string;
   valorTotal: number;
   tipo: string;
   parcelas: number;
   dataVencimento: string;
}) {
   const res = await apiPost<Compromisso[]>({
      acao: 'criarCartao',
      ...payload
   });

   res.forEach(p => compromissosCache.add(p, 'dataVencimento'));

   return res;
}

export async function excluirCompromisso(
   rowIndex: number,
   mes: string,
   ano: string,
   scope: 'single' | 'future' | 'all' = 'single'
) {
   const res = await apiPost({
      acao: 'excluirCompromisso',
      rowIndex,
      scope
   });

   compromissosCache.remove(mes, ano, rowIndex);
   return res;
}

export async function atualizarCompromisso(
   payload: { rowIndex: number; valor: number; dataPagamento: string; scope?: 'single' | 'future' },
   mes: string,
   ano: string
) {
   const res = await apiPost({
      acao: 'atualizarCompromisso',
      ...payload
   });

   payload.dataPagamento = payload.dataPagamento ? formatarDataBR(payload.dataPagamento) : '';

   compromissosCache.update(mes, ano, payload);
   return res;
}