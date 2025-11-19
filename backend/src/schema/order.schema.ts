import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().optional().transform(val => val ? BigInt(val) : undefined),
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX']),
  items: z.array(
    z.object({
      itemId: z.string().transform(val => BigInt(val)),
      quantity: z.number().positive()
    })
  ).min(1, "Pelo menos um item é obrigatório")
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'])
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;