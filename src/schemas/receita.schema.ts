import { z } from 'zod';

export const ReceitaCreateSchema = z.object({
   descricao: z
      .string()
      .min(1, 'A Descrição é obrigatória')
      .min(3, 'A Descrição deve ter no mínimo 3 caracteres'),
   valor: z.number().positive('O Valor deve ser positivo'),
   dataPrevista: z.string().min(1, 'A Data prevista é obrigatória'),
   dataRecebimento: z.string().optional().default('')
});

export type ReceitaCreate = z.infer<typeof ReceitaCreateSchema>;
