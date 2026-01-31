export interface Compromisso {
   rowIndex: number;

   descricao: string;
   categoria: string;

   tipo: 'fixo' | 'variavel' | 'cartao';

   valor: number;

   dataVencimento: string;   // dd/MM/yyyy
   dataPagamento?: string;   // dd/MM/yyyy | vazio

   pago: boolean;

   // só para cartão
   cartao?: string;
   parcela?: number;
   totalParcelas?: number;
}