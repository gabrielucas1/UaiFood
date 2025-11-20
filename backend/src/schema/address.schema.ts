import {z} from 'zod';


export const addressSchema = z.object({
    street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres '),
    number: z.string().min(1,'Número Obrigatório'),
    district: z.string().min(3, 'Bairro é obrigatório'), 
    city: z.string().min(3, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ser a sigla (ex: MG)'),
    zipCode: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length === 8, 'CEP deve ter 8 dígitos')
});

export const updateAddressSchema = addressSchema.partial();