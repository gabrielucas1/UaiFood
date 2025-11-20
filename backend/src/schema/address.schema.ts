import {z} from 'zod';


export const addressSchema = z.object({
    street: z.string()
        .trim()
        .min(1, 'Nome da rua é obrigatório')
        .min(5, 'Nome da rua deve ter pelo menos 5 caracteres')
        .max(200, 'Nome da rua deve ter no máximo 200 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ0-9\s\-.,()]+$/, 'Rua contém caracteres inválidos'),
        
    number: z.string()
        .trim()
        .min(2, 'O numero precisa de 2 algarismo')
        .max(10, 'Número deve ter no máximo 10 caracteres')
        .regex(/^[0-9a-zA-Z\-\/]+$/, 'Número deve conter apenas números, letras, hífen ou barra'),
        
    district: z.string()
        .trim()
        .min(1, 'Bairro é obrigatório')
        .min(3, 'Bairro deve ter pelo menos 3 caracteres')
        .max(100, 'Bairro deve ter no máximo 100 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Bairro deve conter apenas letras, espaços e hífen'),
        
    city: z.string()
        .trim()
        .min(1, 'Cidade é obrigatória')
        .min(2, 'Cidade deve ter pelo menos 2 caracteres')
        .max(100, 'Cidade deve ter no máximo 100 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Cidade deve conter apenas letras, espaços e hífen'),
        
    state: z.string()
        .trim()
        .min(1, 'Estado é obrigatório')
        .length(2, 'Estado deve ter exatamente 2 caracteres (ex: MG, SP, RJ)')
        .regex(/^[A-Z]{2}$/, 'Estado deve ser uma sigla válida em maiúsculas (ex: MG)')
        .refine(val => ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].includes(val), {
            message: 'Digite uma sigla de estado válida (ex: MG, SP, RJ)'
        }),
        
    zipCode: z.string()
        .trim()
        .min(1, 'CEP é obrigatório')
        .transform(val => val.replace(/\D/g, ''))
        .refine(val => val.length === 8, {
            message: 'CEP deve ter exatamente 8 dígitos (ex: 30100000)'
        })
        .refine(val => /^[0-9]{8}$/.test(val), {
            message: 'CEP deve conter apenas números'
        })
});

export const updateAddressSchema = addressSchema.partial();