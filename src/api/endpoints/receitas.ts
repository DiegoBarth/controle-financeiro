import { apiGet, apiPost } from '@/api/client';
import type { Receita } from '@/types/Receita';
import { formatarDataBR } from '@/utils/formatadores';

export async function criarReceita(payload: {
   dataPrevista: string;
   dataRecebimento?: string | null;
   descricao: string;
   valor: number;
}) {
   const res = await apiPost<Receita>({
      acao: 'criarReceita',
      ...payload
   });

   return res;
}

export async function listarReceitas(mes: string, ano: string) {
   const dados = await apiGet<Receita[]>({
      acao: 'listarReceitas',
      mes,
      ano
   });

   return dados;
}

export async function excluirReceita(rowIndex: number, mes: string, ano: string) {
   const res = await apiPost({
      acao: 'excluirReceita',
      rowIndex
   });

   return res;
}

export async function atualizarReceita(payload: {
   rowIndex: number;
   valor: number;
   dataRecebimento?: string | null;
}) {
   const res = await apiPost({
      acao: 'atualizarReceita',
      ...payload
   });

   payload.dataRecebimento = payload.dataRecebimento ? formatarDataBR(payload.dataRecebimento) : '';

   return res;
}