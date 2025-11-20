import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

// Criar uma nova categoria
export const createCategory = async (description: string) => {
  return await prisma.category.create({
    data: {
      description,
    },
  });
};

// Listar todas as categorias
export const getAllCategories = async () => {
  return await prisma.category.findMany();
};

// atualizar a categoria
export const updateCategory = async (id: bigint, description: string) => {
  return await prisma.category.update({
    where: { id },
    data: { description },
  });
};


//deletar a categoria
export const deleteCategory = async (id: bigint) => {
  return await prisma.category.delete({
    where: { id },
  });
};