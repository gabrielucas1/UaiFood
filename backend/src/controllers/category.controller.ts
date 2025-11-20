import { Request, Response } from 'express';
import { z } from 'zod';
import { categorySchema, idParamSchema } from '../schema/category.schema';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById,
  updateCategory, 
  deleteCategory 
} from '../services/category.service';

// Criar Categoria
export const handleCreateCategory = async (req: Request, res: Response) => {
  try {
    const { description } = categorySchema.parse(req.body);
    const category = await createCategory(description);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};

// Listar Todas as Categorias
export const handleGetAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
};



// ➕ ADICIONAR ESTA FUNÇÃO:
export const handleGetCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const category = await getCategoryById(BigInt(id));
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
};

// Atualizar Categoria
export const handleUpdateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { description } = categorySchema.parse(req.body);
    
    const category = await updateCategory(BigInt(id), description);
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

// Deletar Categoria
export const handleDeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    
    await deleteCategory(BigInt(id));
    res.status(204).send(); // 204 = No Content
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
};