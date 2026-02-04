import { apiGet, apiPost } from '@/api/client';
import { receitasCache } from '@/cache/receitasCache';
import type { Receita } from '@/types/Receita';
import { formatarDataBR } from '@/utils/formatadores';

export async function criarReceita(payload: {
   dataPrevista: string;
   dataRecebimento: string;
   descricao: string;
   valor: number;
}) {
   const res = await apiPost<Receita>({
      acao: 'criarReceita',
      ...payload
   });

   receitasCache.add(res, 'dataPrevista');

   return res;
}

export async function listarReceitas(mes: string, ano: string) {
   const cached = receitasCache.get(mes, ano);
   if (cached) return cached;

   const dados = await apiGet<Receita[]>({
      acao: 'listarReceitas',
      mes,
      ano
   });

   receitasCache.set(mes, ano, dados);

   return dados;
}

export async function excluirReceita(rowIndex: number, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'excluirReceita',
      rowIndex
   });

   receitasCache.remove(mes, ano, rowIndex);
   
   return res;
}

export async function atualizarReceita(payload: {
   rowIndex: number;
   valor: number;
   dataRecebimento: string;
}, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'atualizarReceita',
      ...payload
   });

   payload.dataRecebimento = payload.dataRecebimento ? formatarDataBR(payload.dataRecebimento) : '';

   receitasCache.update(mes, ano, payload);

   return res;
}