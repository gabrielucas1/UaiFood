import {z} from 'zod';

//schema para atualizar categoria
export const categorySchema = z.object({
    description: z.string().min(3,'A descrição deve ter no mínimo 3 caracteres')
});


// Schema para validar o ID na URL (parâmetros)
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'O ID deve ser um número'),
});