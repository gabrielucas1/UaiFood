import { z } from 'zod';
import { PrismaClient } from '../../../generated/prisma/client';
import { createOrderSchema } from '../schema/order.schema';

const prisma = new PrismaClient();

// Tipo para os dados de entrada do pedido
type OrderInput = z.infer<typeof createOrderSchema>;

/**
 * Cria um novo pedido usando uma transação ($transaction)
 */
export const createOrder = async (clientId: bigint, data: OrderInput) => {
  // 1. Validar e buscar preços dos itens
  const itemIds = data.items.map(item => BigInt(item.itemId));
  const products = await prisma.item.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, unitPrice: true },
  });

  if (products.length !== itemIds.length) {
    throw new Error('Um ou mais itens do pedido não foram encontrados no cardápio.');
  }

  // 2. Calcular o total
  let total = 0;
  const orderItemsData = data.items.map(itemInput => {
    const product = products.find(p => p.id === BigInt(itemInput.itemId));
    if (!product) throw new Error(`Item ${itemInput.itemId} não encontrado durante o cálculo.`);

    const itemTotal = Number(product.unitPrice) * itemInput.quantity;
    total += itemTotal;

    return {
      itemId: BigInt(itemInput.itemId),
      quantity: itemInput.quantity,
    };
  });

  // 3. Executar a transação
  const result = await prisma.$transaction(async (tx) => {
    // 3a. Criar o Pedido principal
    const newOrder = await tx.order.create({
      data: {
        clientId: clientId,
        paymentMethod: data.paymentMethod,
        status: 'PENDING',
        total: total, // ← Certifique-se que este campo existe no schema
        createdById: clientId,
      },
    });

    // 3b. Criar todos os OrderItems
    await Promise.all(orderItemsData.map(itemData =>
      tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
        },
      })
    ));

    return newOrder;
  });

  return result;
};

/**
 * Lista todos os pedidos. CLIENTE vê só os dele, ADMIN vê todos.
 */
export const getAllOrders = async (userId: bigint, userType: string) => {
  const whereClause = userType === 'ADMIN' ? {} : { clientId: userId };

  return await prisma.order.findMany({
    where: whereClause,
    include: {
      client: { select: { nome: true, phone: true } },
      orderItems: { // ← CORREÇÃO: 'orderItems' em vez de 'items'
        include: {
          item: { select: { description: true, unitPrice: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Implementar funções updateOrder e deleteOrder aqui (CRUD completo)