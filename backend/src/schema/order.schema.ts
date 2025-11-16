import { z } from 'zod';

// Define o schema de CADA item dentro do pedido
export const orderItemSchema = z.object({
  // ID do item que deve ser um número (será BigInt no service)
  itemId: z.coerce.number().int().positive('ID do item é obrigatório e deve ser positivo'), 
  
  // A quantidade
  quantity: z.coerce.number().int().positive('A quantidade deve ser um número inteiro positivo'), 
});

// Schema principal para CRIAR um pedido
export const createOrderSchema = z.object({
  // O método de pagamento deve ser um dos Enums (CASH, CREDIT, etc.)
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX'], 'Método de pagamento inválido.'),
  
  // A lista de itens que compõem o pedido
  items: z.array(orderItemSchema).min(1, 'O pedido deve ter pelo menos um item.'),
  
  // Opcional: Endereço do Cliente. O controlador irá lidar com a busca.
  addressId: z.coerce.number().int().positive('ID do endereço inválido.').optional(), 
});