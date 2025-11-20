import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();


// Criar Item
export const createItem = async (data: { description: string; unitPrice: number; categoryId: number }) => {
  return await prisma.item.create({
    data: {
      description: data.description,
      unitPrice: data.unitPrice,
      // Converte number para BigInt para o Prisma
      categoryId: BigInt(data.categoryId),
    },
  });
};

// Listar Itens (Trazendo junto o nome da Categoria!)
export const getAllItems = async () => {
  const items = await prisma.item.findMany({
    include: {
      category: {
        select: { description: true } // Traz apenas o nome da categoria
      }
    }
  });

  // Precisamos converter BigInt para String/Number antes de retornar
  // senão o JSON quebra (igual aconteceu no User)
  return items.map(item => ({
    ...item,
    id: item.id.toString(),
    categoryId: item.categoryId.toString(),
    unitPrice: Number(item.unitPrice) // Garante que preço seja número
  }));
};

// Atualizar Item
export const updateItem = async (id: bigint, data: any) => {
  // Prepara os dados para atualização
  const updateData: any = {};
  if (data.description) updateData.description = data.description;
  if (data.unitPrice) updateData.unitPrice = data.unitPrice;
  if (data.categoryId) updateData.categoryId = BigInt(data.categoryId);

  return await prisma.item.update({
    where: { id },
    data: updateData,
  });
};

// Deletar Item
export const deleteItem = async (id: bigint) => {
  return await prisma.item.delete({
    where: { id },
  });
};