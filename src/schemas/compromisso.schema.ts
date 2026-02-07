import { z } from 'zod';

export const CompromissoCreateSchema = z.object({
   descricao: z
      .string()
      .min(1, 'A Descrição é obrigatória')
      .min(3, 'A Descrição deve ter no mínimo 3 caracteres'),
   categoria: z.string().min(1, 'A Categoria é obrigatória'),
   tipo: z.enum(['Fixo', 'Variável', 'Cartão'], {
      message: 'Tipo inválido'
   }),
   valor: z.number().positive('O Valor deve ser positivo'),
   dataVencimento: z.string().min(1, 'A Data de vencimento é obrigatória'),
   meses: z.number().int().positive().optional().default(1)
});

export const CompromissoCartaoSchema = z.object({
   descricao: z
      .string()
      .min(1, 'A Descrição é obrigatória')
      .min(3, 'A Descrição deve ter no mínimo 3 caracteres'),
   categoria: z.string().min(1, 'A Categoria é obrigatória'),
   tipo: z.literal('Cartão'),
   cartao: z.string().min(1, 'O Cartão é obrigatório'),
   valor: z.number().positive('O Valor deve ser positivo'),
   totalParcelas: z
      .number()
      .int('As Parcelas devem ser um número inteiro')
      .positive('As Parcelas devem ser um número positivo'),
   dataVencimento: z.string().min(1, 'A Data de vencimento é obrigatória')
});

export type CompromissoCreate = z.infer<typeof CompromissoCreateSchema>;
export type CompromissoCartao = z.infer<typeof CompromissoCartaoSchema>;
