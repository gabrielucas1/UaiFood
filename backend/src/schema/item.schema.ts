import {z} from 'zod'

// schema para criar um item
export const createItemSchema = z.object({
    description: z.string().min(3,'A Descrição deve ter pelo menos 3 caracteres'),

    unitPrice: z.coerce.number().positive('O Preço deve ser positivo '),

    categoryId: z.coerce.number().int('ID da categoria inválido')
})

//schema para atualizar um item
export const  updateItemSchema = createItemSchema.partial();