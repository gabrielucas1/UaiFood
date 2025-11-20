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

export const handleGetAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    const mappedCategories = categories.map(category => ({
      id: category.id.toString(),
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: category._count
    }));
    res.status(200).json(mappedCategories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
};

export const handleGetCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const category = await getCategoryById(BigInt(id));
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    const mappedCategory = {
      id: category.id.toString(),
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
    
    res.status(200).json(mappedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
};

export const handleUpdateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedBody = categorySchema.parse(req.body);
    
    const category = await updateCategory(BigInt(id), validatedBody.description);
    
    res.status(200).json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      data: category
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

export const handleDeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await deleteCategory(BigInt(id));
    
    res.status(200).json({
      success: true,
      message: 'Categoria excluída com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
};