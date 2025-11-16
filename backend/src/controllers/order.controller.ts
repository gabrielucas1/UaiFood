import { Request, Response } from 'express';
import { z } from 'zod';
import { createOrderSchema } from '../schema/order.schema';
import { createOrder, getAllOrders } from '../services/order.service';

// Interface para o Request com User (do middleware)
interface AuthRequest extends Request {
  user?: { id: string; type: 'ADMIN' | 'CLIENT' };
}

// Criar Pedido (Rota Protegida para CLIENT ou ADMIN)
export const handleCreateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id); // ID do usuário logado (o cliente)
    const data = createOrderSchema.parse(req.body);

    const newOrder = await createOrder(userId, data);

    // Converte o ID para string para evitar o erro BigInt na resposta
    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: {
        ...newOrder,
        id: newOrder.id.toString(),
        clientId: newOrder.clientId.toString(),
        createdById: newOrder.createdById.toString()
      }
    });

  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    // Erros do service (ex: item não encontrado)
    res.status(500).json({ error: (error as Error).message || 'Erro interno ao criar pedido.' });
  }
};

// Listar Pedidos (Filtra por CLIENT ou lista todos para ADMIN)
export const handleGetAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id);
    const userType = req.user!.type;

    const orders = await getAllOrders(userId, userType);

    // Mapear a resposta para converter BigInts
    const mappedOrders = orders.map(order => ({
      ...order,
      id: order.id.toString(),
      clientId: order.clientId.toString(),
      total: Number(order.total), // Converte Decimal para Number
      // Os OrderItems aninhados também precisarão de conversão,
      // mas o Prisma cuida da maioria se o select for usado corretamente.
    }));

    res.status(200).json(mappedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};