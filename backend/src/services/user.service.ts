import prisma from '../prisma';
import bcrypt from 'bcryptjs';


// Função para criar um usuário
export const createUser = async ({ nome, phone, password, type }: { nome: string; phone: string; password: string; type: 'CLIENT' | 'ADMIN' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { nome, phone, password: hashedPassword, type },
  });
};

// Função para listar todos os usuários
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, nome: true, phone: true, type: true, createdAt: true },
  });
};

// Função para buscar um usuário por ID
export const getUserById = async (id: bigint) => prisma.user.findUnique({ 
  where: { id },
  include: { address: true }
});

export const updateUser = async (id: bigint, data: { nome?: string; phone?: string; type?: 'CLIENT' | 'ADMIN' }) => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const deleteUser = async (id: bigint) => {
  return prisma.user.delete({
    where: { id }
  });
};

// Função para buscar um usuário pelo TELEFONE
export const getUserByPhone = async (phone: string) => prisma.user.findUnique({ where: { phone } });