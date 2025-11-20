import {z} from 'zod';

export const categorySchema = z.object({
    description: z.string()
        .trim()
        .min(1, 'Descrição da categoria é obrigatória')
        .min(3, 'Descrição deve ter pelo menos 3 caracteres')
        .max(100, 'Descrição deve ter no máximo 100 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Descrição deve conter apenas letras e espaços')
        .refine(val => val.trim().length > 0, {
            message: 'Descrição não pode ser apenas espaços em branco'
        })
});


export const idParamSchema = z.object({
  id: z.string()
    .trim()
    .min(1, 'ID é obrigatório')
    .regex(/^\d+$/, 'ID deve ser um número válido')
    .refine(val => parseInt(val) > 0, {
        message: 'ID deve ser maior que zero'
    })
});