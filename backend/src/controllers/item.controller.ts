import { Request, Response } from 'express';
import { z } from 'zod';
import { createItemSchema, updateItemSchema } from '../schema/item.schema';
import { createItem, getAllItems, updateItem, deleteItem } from '../services/item.service';
import { idParamSchema } from '../schema/category.schema'; // Reutilizando validação de ID

// Criar Item
export const handleCreateItem = async (req: Request, res: Response) => {
  try {
    const data = createItemSchema.parse(req.body);
    const item = await createItem(data);
    
    // Tratamento do BigInt na resposta
    res.status(201).json({
      ...item,
      id: item.id.toString(),
      categoryId: item.categoryId.toString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
    // Erro P2003 = Foreign Key falhou (Categoria não existe)
    res.status(500).json({ error: 'Erro ao criar item. Verifique se a categoria existe.' });
  }
};

// Listar Itens
export const handleGetAllItems = async (req: Request, res: Response) => {
  try {
    const items = await getAllItems();
    const mappedItems = items.map(item => ({
      id: item.id.toString(),
      description: item.description,
      unitPrice: item.unitPrice.toString(),
      categoryId: item.categoryId.toString(),
      category: item.category, // Incluir a categoria
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    res.status(200).json(mappedItems);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar itens' });
  }
};

// Atualizar Item
export const handleUpdateItem = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = updateItemSchema.parse(req.body);
    
    const item = await updateItem(BigInt(id), data);
    
    res.status(200).json({
      ...item,
      id: item.id.toString(),
      categoryId: item.categoryId.toString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

// Deletar Item
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