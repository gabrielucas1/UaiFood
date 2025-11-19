import { Request, Response } from 'express';
import { z } from 'zod';
import { addressSchema, updateAddressSchema } from '../schema/address.schema';
import { createAddress, getAddressByUserId, updateAddress, deleteAddress } from '../services/address.service';

// Interface para o Request com User (do middleware)
interface AuthRequest extends Request {
  user?: { id: string; phone: string; type: 'ADMIN' | 'CLIENT' };
}

export const handleCreateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id); // Pega ID do token
    const data = addressSchema.parse(req.body);
    
    const address = await createAddress(userId, data);
    
    res.status(201).json({
      ...address,
      id: address.id.toString(),
      userId: address.userId.toString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
    // Erro genérico ou "Usuário já possui endereço"
    res.status(400).json({ error: (error as Error).message });
  }
};

export const handleGetAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id);
    const address = await getAddressByUserId(userId);

    if (!address) return res.status(404).json({ error: 'Endereço não encontrado' });

    res.json({
      ...address,
      id: address.id.toString(),
      userId: address.userId.toString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar endereço' });
  }
};

export const handleUpdateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id);
    const data = updateAddressSchema.parse(req.body);
    
    const address = await updateAddress(userId, data);
    
    res.json({
      ...address,
      id: address.id.toString(),
      userId: address.userId.toString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
    res.status(500).json({ error: 'Erro ao atualizar endereço' });
  }
};

export const handleDeleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id); // CORRIGIDO: converter para BigInt
    
    await deleteAddress(userId);
    
    res.status(200).json({
      success: true,
      message: 'Endereço excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir endereço' });
  }
};