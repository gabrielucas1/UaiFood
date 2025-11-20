import { z } from 'zod';


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

export const updateUserSchema = userSchema.partial().omit({ password: true });

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Senha atual é obrigatória'),
  
  newPassword: z.string()
    .min(1, 'Nova senha é obrigatória')
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres')
    .regex(/(?=.*[a-z])/, 'Nova senha deve conter pelo menos uma letra minúscula')
    .regex(/(?=.*[0-9])/, 'Nova senha deve conter pelo menos um número'),
  
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});