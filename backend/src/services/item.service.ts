import prisma from '../prisma';

export const createItem = async (data: { description: string; unitPrice: number; categoryId: number }) => {
  return await prisma.item.create({
    data: {
      description: data.description,
      unitPrice: data.unitPrice,
      categoryId: BigInt(data.categoryId),
    },
  });
};

export const getAllItems = async () => {
  const items = await prisma.item.findMany({
    include: {
      category: {
        select: { description: true } 
      }
    }
  });


  const mappedItems = items.map(item => ({
    ...item,
    id: item.id.toString(),
    categoryId: item.categoryId.toString(),
    unitPrice: Number(item.unitPrice), 
    category: item.category ? {
      ...item.category,
      id: item.categoryId.toString() 
    } : null
  }));

  return mappedItems;
};

export const updateItem = async (id: bigint, data: any) => {
  const updateData: any = {};
  if (data.description) updateData.description = data.description;
  if (data.unitPrice) updateData.unitPrice = data.unitPrice;
  if (data.categoryId) updateData.categoryId = BigInt(data.categoryId);

  return await prisma.item.update({
    where: { id },
    data: updateData,
  });
};

export const deleteItem = async (id: bigint) => {
  return await prisma.item.delete({
    where: { id },
  });
};