import { z } from 'zod';

/**
 * SCHEMAS DE VALIDAÇÃO DO USUÁRIO
 * 
 * Aqui definimos as regras de validação usando Zod.
 * Zod é uma biblioteca que valida dados de entrada e fornece
 * tipagem automática para TypeScript.
 */

// 📝 Schema para CRIAR/REGISTRAR usuário
export const userSchema = z.object({
  nome: z.string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .min(4, 'Nome deve ter pelo menos 4 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  phone: z.string()
    .trim()
    .min(1, 'Telefone é obrigatório')
    .transform(phone => phone.replace(/\D/g, ''))
    .refine(phone => phone.length >= 10 && phone.length <= 11, {
      message: 'Telefone deve ter 10 ou 11 dígitos (ex: 31999999999)'
    })
    .refine(phone => /^[1-9]/.test(phone), {
      message: 'Telefone deve começar com um dígito válido'
    }),
  
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(/(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/(?=.*[0-9])/, 'Senha deve conter pelo menos um número'),
  
  type: z.enum(['CLIENT', 'ADMIN'], {
    errorMap: () => ({ message: 'Tipo deve ser CLIENT ou ADMIN' })
  }),
});

// 🔐 Schema para LOGIN
export const loginSchema = z.object({
  phone: z.string()
    .trim()
    .min(1, 'Telefone é obrigatório')
    .transform(phone => phone.replace(/\D/g, ''))
    .refine(phone => phone.length >= 10 && phone.length <= 11, {
      message: 'Digite um telefone válido (ex: 31999999999)'
    }),
  
  password: z.string()
    .trim()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// 📋 Schema para ATUALIZAR perfil (opcional - para uso futuro)
export const updateUserSchema = userSchema.partial().omit({ password: true });