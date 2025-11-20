import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string()
    .optional()
    .transform(val => val ? BigInt(val) : undefined),
  
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX'], {
    errorMap: () => ({ message: 'Selecione um método de pagamento válido: Dinheiro, Cartão de Débito, Cartão de Crédito ou PIX' })
  }),
  
  items: z.array(
    z.object({
      itemId: z.string()
        .min(1, 'ID do item é obrigatório')
        .transform(val => {
          try {
            return BigInt(val);
          } catch {
            throw new Error('ID do item deve ser um número válido');
          }
        }),
      quantity: z.number({
        required_error: 'Quantidade é obrigatória',
        invalid_type_error: 'Quantidade deve ser um número'
      })
        .int('Quantidade deve ser um número inteiro')
        .min(1, 'Quantidade deve ser pelo menos 1')
        .max(99, 'Quantidade não pode ser maior que 99')
    }, {
      required_error: 'Item é obrigatório',
      invalid_type_error: 'Formato de item inválido'
    })
  ).min(1, 'Adicione pelo menos um item ao pedido')
    .max(50, 'Máximo de 50 itens por pedido')
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'], {
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_enum_value') {
        return { message: 'Status inválido. Opções: Pendente, Preparando, Entregando, Entregue ou Cancelado' };
      }
      return { message: 'Status é obrigatório' };
    }
  })
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;