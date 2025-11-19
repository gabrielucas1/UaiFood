import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, getUserByPhone, updateUser, deleteUser } from '../services/user.service';
import { z } from 'zod';
import { userSchema, loginSchema } from '../schema/user.schema';

// ADICIONAR interface AuthRequest se não existir:
interface AuthRequest extends Request {
  user?: { id: bigint; phone: string; type: 'ADMIN' | 'CLIENT' };
}

// ADICIONAR schema de update se não existir:
const updateUserSchema = z.object({
  nome: z.string().min(3).optional(),
  phone: z.string().regex(/^\d{10,11}$/).optional(),
  type: z.enum(['CLIENT', 'ADMIN']).optional()
});

// 🆕 CRIAR NOVO USUÁRIO (REGISTRO)
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
        message: 'Dados inválidos',
        errors: error.issues.map(issue => ({
          campo: issue.path.join('.'),
          mensagem: issue.message,
        })),
      });
    }
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({ success: false, message: 'Este telefone já está cadastrado' });
    }
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

// 📋 Listar todos os usuários
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

// 👤 Buscar perfil completo do usuário logado
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

    // Formatar endereço - dados de exemplo quando não há endereço
    const addressString = user.address ? 
      `${user.address.street}, ${user.address.number}, ${user.address.district}, ${user.address.city} - ${user.address.state}` :
      'Rua das Flores, 123, Centro, Belo Horizonte - MG';

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

// IMPLEMENTAR se não existirem:
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
        type: updatedUser.type
      }
    });
  } catch (error) {
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

// 🔐 Login e geração de token
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