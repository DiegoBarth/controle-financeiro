import { z } from 'zod';

export const GastoCreateSchema = z.object({
   descricao: z
      .string()
      .min(1, 'A Descrição é obrigatória')
      .min(3, 'A Descrição deve ter no mínimo 3 caracteres'),
   categoria: z.string().min(1, 'A Categoria é obrigatória'),
   valor: z.number().positive('O Valor deve ser positivo'),
   dataPagamento: z.string().min(1, 'A Data de pagamento é obrigatória')
});

export type GastoCreate = z.infer<typeof GastoCreateSchema>;
