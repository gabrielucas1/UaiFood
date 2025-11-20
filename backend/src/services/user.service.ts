import prisma from '../prisma';
import bcrypt from 'bcryptjs';


export const createUser = async ({ nome, phone, password, type }: { nome: string; phone: string; password: string; type: 'CLIENT' | 'ADMIN' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { nome, phone, password: hashedPassword, type },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, nome: true, phone: true, type: true, createdAt: true },
  });
};

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

export const getUserByPhone = async (phone: string) => prisma.user.findUnique({ where: { phone } });

export const changeUserPassword = async (id: bigint, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  });
};