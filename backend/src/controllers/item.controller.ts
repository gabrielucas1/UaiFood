import { Request, Response } from 'express';
import { z } from 'zod';
import { createItemSchema, updateItemSchema } from '../schema/item.schema';
import { createItem, getAllItems, updateItem, deleteItem } from '../services/item.service';
import { idParamSchema } from '../schema/category.schema'; 

export const handleCreateItem = async (req: Request, res: Response) => {
  try {
    const data = createItemSchema.parse(req.body);
    const item = await createItem(data);
    
    res.status(201).json({
      success: true,
      message: 'Item criado com sucesso',
      data: {
        ...item,
        id: item.id.toString(),
        categoryId: item.categoryId.toString()
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      });
    }
    res.status(500).json({ error: 'Erro ao criar item. Verifique se a categoria existe.' });
  }
};

export const handleGetAllItems = async (req: Request, res: Response) => {
  try {
    const items = await getAllItems();
    const mappedItems = items.map(item => ({
      id: item.id.toString(),
      description: item.description,
      unitPrice: item.unitPrice.toString(),
      categoryId: item.categoryId.toString(),
      category: item.category, 
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    res.status(200).json(mappedItems);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar itens' });
  }
};

export const handleUpdateItem = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = updateItemSchema.parse(req.body);
    
    const item = await updateItem(BigInt(id), data);
    
    res.status(200).json({
      success: true,
      message: 'Item atualizado com sucesso',
      data: {
        ...item,
        id: item.id.toString(),
        categoryId: item.categoryId.toString()
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      });
    }
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

export const handleDeleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await deleteItem(BigInt(id));
    
    res.status(200).json({
      success: true,
      message: 'Item excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir item' });
  }
};