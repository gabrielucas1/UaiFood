import prisma from '../prisma';


export const createAddress = async (userId: bigint, data: any) => {
  const existingAddress = await prisma.address.findUnique({
    where: { userId },
  });

  if (existingAddress) {
    throw new Error('Usuário já possui um endereço cadastrado.');
  }

  return await prisma.address.create({
    data: {
      ...data,
      userId, 
    },
  });
};

export const getAddressByUserId = async (userId: bigint) => {
  return await prisma.address.findUnique({
    where: { userId },
  });
};

export const updateAddress = async (userId: bigint, data: any) => {
  return await prisma.address.update({
    where: { userId }, 
    data,
  });
};

export const deleteAddress = async (userId: bigint) => {
  return await prisma.address.delete({
    where: { userId },
  });
};