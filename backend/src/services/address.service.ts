// Lembre de ajustar o import se você já criou o lib/prisma ou usar o caminho antigo
import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

// Criar endereço (Vinculado ao User Logado)
export const createAddress = async (userId: bigint, data: any) => {
  // Verifica se o usuário já tem endereço
  const existingAddress = await prisma.address.findUnique({
    where: { userId },
  });

  if (existingAddress) {
    throw new Error('Usuário já possui um endereço cadastrado.');
  }

  return await prisma.address.create({
    data: {
      ...data,
      userId, // Vincula ao usuário
    },
  });
};

// Buscar endereço do usuário logado
export const getAddressByUserId = async (userId: bigint) => {
  return await prisma.address.findUnique({
    where: { userId },
  });
};

// Atualizar endereço do usuário logado
export const updateAddress = async (userId: bigint, data: any) => {
  return await prisma.address.update({
    where: { userId }, // O Prisma sabe encontrar pelo userId porque é @unique
    data,
  });
};

// Deletar endereço
export const deleteAddress = async (userId: bigint) => {
  return await prisma.address.delete({
    where: { userId },
  });
};