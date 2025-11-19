import { z } from 'zod';
import prisma from '../prisma';
import { createOrderSchema, updateOrderStatusSchema } from '../schema/order.schema';

type OrderInput = z.infer<typeof createOrderSchema>;
type StatusInput = z.infer<typeof updateOrderStatusSchema>;

export const createOrder = async (userId: bigint, data: OrderInput) => {
  if (!data.addressId) {
    const userAddress = await prisma.address.findFirst({
      where: { userId: userId }
    });
    
    if (!userAddress) {
      throw new Error('Usuário não possui endereço cadastrado.');
    }
  }

  const itemIds = data.items.map(item => item.itemId);
  const products = await prisma.item.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, unitPrice: true },
  });

  if (products.length !== itemIds.length) {
    throw new Error('Um ou mais itens do pedido não foram encontrados.');
  }

  let total = 0;
  const orderItemsData = data.items.map(itemInput => {
    const product = products.find(p => p.id === itemInput.itemId);
    if (!product) throw new Error(`Item ${itemInput.itemId} não encontrado.`);

    const itemTotal = Number(product.unitPrice) * itemInput.quantity;
    total += itemTotal;

    return {
      itemId: itemInput.itemId,
      quantity: itemInput.quantity,
    };
  });

  return await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        clientId: userId,
        createdById: userId,
        paymentMethod: data.paymentMethod,
        status: 'PENDING', // Usar enum do Prisma
        total: total,
      },
    });

    for (const itemData of orderItemsData) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
        },
      });
    }

    return {
      ...newOrder,
      id: newOrder.id.toString(),
      clientId: newOrder.clientId.toString(),
      createdById: newOrder.createdById.toString(),
      total: Number(newOrder.total)
    };
  });
};

export const getAllOrders = async (userId: bigint, userType: string) => {
  const whereClause = userType === 'ADMIN' ? {} : { clientId: userId };

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      client: { select: { nome: true, phone: true } },
      orderItems: {
        include: {
          item: { select: { description: true, unitPrice: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return orders.map(order => ({
    ...order,
    id: order.id.toString(),
    total: Number(order.total)
  }));
};

export const updateOrderStatus = async (orderId: bigint, statusData: StatusInput) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { 
      status: statusData.status, // Usar o schema validado
      updatedAt: new Date() 
    },
    include: {
      client: { select: { nome: true, phone: true } },
      orderItems: {
        include: {
          item: { select: { description: true, unitPrice: true } }
        }
      }
    }
  });

  return {
    ...order,
    id: order.id.toString(),
    clientId: order.clientId.toString(),
    createdById: order.createdById.toString(),
    total: Number(order.total)
  };
};

// Implementar funções deleteOrder aqui se necessário