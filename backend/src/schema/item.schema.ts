import {z} from 'zod'

export const createItemSchema = z.object({
    description: z.string()
        .trim()
        .min(1, 'Descrição é obrigatória')
        .min(3, 'Descrição deve ter pelo menos 3 caracteres')
        .max(200, 'Descrição deve ter no máximo 200 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ0-9\s\-.,()]+$/, 'Descrição contém caracteres inválidos'),

    unitPrice: z.coerce.number({
        required_error: 'Preço é obrigatório',
        invalid_type_error: 'Preço deve ser um número válido'
    })
        .positive('Preço deve ser maior que zero')
        .min(0.01, 'Preço mínimo é R$ 0,01')
        .max(999.99, 'Preço máximo é R$ 999,99'),

    categoryId: z.coerce.number({
        required_error: 'Categoria é obrigatória',
        invalid_type_error: 'ID da categoria deve ser um número'
    })
        .int('ID da categoria deve ser um número inteiro')
        .positive('Selecione uma categoria válida')
})

export const  updateItemSchema = createItemSchema.partial();