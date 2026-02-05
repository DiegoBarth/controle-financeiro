export interface Compromisso {
   rowIndex: number;

   descricao: string;
   categoria: string;

   tipo: 'Fixo' | 'Variável' | 'Cartão';

   valor: number;

   dataVencimento: string;
   dataPagamento?: string;

   cartao?: string;
   parcelas?: number;
   totalParcelas?: number;
}