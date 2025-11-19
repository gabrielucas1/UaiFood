import { Request, Response } from 'express';
import { z } from 'zod';
import { createOrderSchema, updateOrderStatusSchema } from '../schema/order.schema';
import { createOrder, getAllOrders, updateOrderStatus } from '../services/order.service';

interface AuthRequest extends Request {
  user?: { id: string; phone: string; type: 'ADMIN' | 'CLIENT' };
}

export const handleCreateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = BigInt(req.user!.id); // CORRIGIDO: converter para BigInt

    const order = await createOrder(userId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: order
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
};

// Listar Pedidos (Filtra por CLIENT ou lista todos para ADMIN)
export const handleGetAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id);
    const userType = req.user!.type;

    const orders = await getAllOrders(userId, userType);

    // Mapear a resposta para converter BigInts e incluir dados relacionados
    const mappedOrders = orders.map(order => ({
      id: order.id.toString(),
      userId: order.clientId.toString(),
      user: order.client ? {
        nome: order.client.nome,
        phone: order.client.phone
      } : null,
      total: order.total.toString(),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((orderItem) => ({
        id: `${order.id}-${orderItem.itemId}`, // ID único baseado no pedido e item
        quantity: orderItem.quantity,
        unitPrice: orderItem.item.unitPrice.toString(),
        item: {
          name: orderItem.item.description,
          price: orderItem.item.unitPrice.toString()
        }
      }))
    }));

    res.status(200).json(mappedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

// Buscar APENAS os pedidos do usuário logado (para a home page)
export const handleGetMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id);

    // Buscar apenas os pedidos do usuário logado
    const orders = await getAllOrders(userId, 'CLIENT');

    // Mapear para o formato esperado pelo frontend
    const mappedOrders = orders.map(order => ({
      id: order.id.toString(),
      total: order.total.toString(),
      status: order.status,
      createdAt: order.createdAt,
      orderItems: order.orderItems.map(orderItem => ({
        quantity: orderItem.quantity,
        item: {
          description: orderItem.item.description
        }
      }))
    }));

    res.status(200).json(mappedOrders);
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar seus pedidos.' });
  }
};

export const handleUpdateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userType = req.user!.type;

    if (userType !== 'ADMIN') {
      return res.status(403).json({ error: 'Apenas administradores podem alterar status' });
    }

    const validatedData = updateOrderStatusSchema.parse(req.body); // CORRIGIDO: validar dados
    const order = await updateOrderStatus(BigInt(id), validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: order
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Status inválido', details: error.errors });
    }
    
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
};

