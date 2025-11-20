import { PrismaClient } from '../../../generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
export const getUserById = async (id: bigint) => prisma.user.findUnique({ where: { id } });

// Função para buscar um usuário pelo TELEFONE
export const getUserByPhone = async (phone: string) => prisma.user.findUnique({ where: { phone } });