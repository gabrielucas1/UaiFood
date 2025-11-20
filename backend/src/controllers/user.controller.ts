import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, getUserByPhone, updateUser, deleteUser, changeUserPassword } from '../services/user.service';
import { z } from 'zod';
import { userSchema, loginSchema, updateUserSchema, changePasswordSchema } from '../schema/user.schema';
import prisma from '../prisma';

interface AuthRequest extends Request {
  user?: { id: bigint; phone: string; type: 'ADMIN' | 'CLIENT' };
}

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { nome, phone, password, type } = userSchema.parse(req.body);
    const user = await createUser({ nome, phone, password, type });
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        id: user.id.toString(),
        nome: user.nome,
        phone: user.phone,
        type: user.type,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({ success: false, message: 'Este telefone já está cadastrado' });
    }
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

export const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users.map(user => ({
      id: user.id.toString(),
      nome: user.nome,
      phone: user.phone,
      type: user.type,
      createdAt: user.createdAt,
    })));
  } catch {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const GetUserProfile = async (req: Request, res: Response) => {
  try {
    const userToken = (req as any).user;
    
    const user = await getUserById(BigInt(userToken.id));

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    const addressString = user.address ? 
      `${user.address.street}, ${user.address.number}, ${user.address.district}, ${user.address.city} - ${user.address.state}` :
      null;

    const responseData = {
      name: user.nome,
      address: addressString,
      phone: user.phone
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

export const handleUpdateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const validatedData = updateUserSchema.parse(req.body);

    const updatedUser = await updateUser(userId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        id: updatedUser.id.toString(),
        nome: updatedUser.nome,
        phone: updatedUser.phone,
        type: updatedUser.type,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

export const handleDeleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    await deleteUser(userId);
    
    res.status(200).json({
      success: true,
      message: 'Conta excluída com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir conta' });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = loginSchema.parse(req.body);
    const user = await getUserByPhone(phone);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign(
      { id: user.id.toString(), type: user.type },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id.toString(),
        nome: user.nome,
        type: user.type,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

export const handleChangePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Buscar o usuário atual
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    await changeUserPassword(userId, newPassword);

    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    console.error('❌ Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const handleChangeUserType = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const adminUserId = req.user!.id;

    if (req.user!.type !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem alterar tipos de usuário'
      });
    }

    if (!['ADMIN', 'CLIENT'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de usuário inválido. Use: ADMIN ou CLIENT'
      });
    }

    if (adminUserId.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode alterar seu próprio tipo de usuário'
      });
    }

    const user = await getUserById(BigInt(id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(id) },
      data: { type },
      select: {
        id: true,
        nome: true,
        phone: true,
        type: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Tipo de usuário alterado com sucesso',
      data: {
        ...updatedUser,
        id: updatedUser.id.toString()
      }
    });
  } catch (error) {
    console.error('❌ Erro ao alterar tipo de usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

