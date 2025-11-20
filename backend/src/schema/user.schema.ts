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
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  
  phone: z.string()
    .regex(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 dígitos')
    .transform(phone => phone.replace(/\D/g, '')), // Remove caracteres não numéricos
  
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres'),
  
  type: z.enum(['CLIENT', 'ADMIN']),
});

// 🔐 Schema para LOGIN
export const loginSchema = z.object({
  phone: z.string()
    .regex(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 dígitos'),
  
  password: z.string()
    .min(1, 'A senha é obrigatória'),
});

// 📋 Schema para ATUALIZAR perfil (opcional - para uso futuro)
export const updateUserSchema = userSchema.partial().omit({ password: true });