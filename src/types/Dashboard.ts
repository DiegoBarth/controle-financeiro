export interface Dashboard {
  saldoMensal: SaldoMensal[];
  topCategorias: Categoria[];
  resumoCartoes: Cartao[];
}

export interface Cartao {
   cartao: string;
   imagem: string;
   limiteTotal: number;
   limiteDisponivel: number;
   percentualUsado: number;
   totalFatura: number;
}

export interface Categoria {
   categoria: string;
   total: number;
}

export interface SaldoMensal {
   data: string;
   saldo: number;
}