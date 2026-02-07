export interface Receita {
   rowIndex: number
   descricao: string
   dataPrevista: string
   dataRecebimento?: string | null
   valor: number | string
}