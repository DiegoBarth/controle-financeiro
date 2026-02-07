export interface Compromisso {
   rowIndex: number;

   descricao: string;
   categoria: string;

   tipo: 'Fixo' | 'Variável' | 'Cartão' | '';

   valor: number | string;

   dataVencimento: string;
   dataPagamento?: string;

   meses?: number;
   cartao?: string;
   parcela?: number;
   totalParcelas?: number;
}