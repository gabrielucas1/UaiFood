import prisma from '../prisma';


// Criar uma nova categoria
export const createCategory = async (description: string) => {
  const category = await prisma.category.create({
    data: {
      description,
    },
  });
  
  return {
    ...category,
    id: category.id.toString()
  };
};

// Listar todas as categorias
export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { items: true }
      }
    }
  });
  
  // Converter BigInt para string para evitar problemas de serialização JSON
  return categories.map(category => ({
    ...category,
    id: category.id.toString()
  }));
};

// atualizar a categoria
export const updateCategory = async (id: bigint, description: string) => {
  const category = await prisma.category.update({
    where: { id },
    data: { description },
  });
  
  return {
    ...category,
    id: category.id.toString()
  };
};

export const getCategoryById = async (id: bigint) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) return null;
    
    return {
      ...category,
      id: category.id.toString()
    };
  } catch (error) {
    throw new Error('Erro ao buscar categoria por ID');
  }
};


//deletar a categoria
export const deleteCategory = async (id: bigint) => {
  return await prisma.category.delete({
    where: { id },
  });
};