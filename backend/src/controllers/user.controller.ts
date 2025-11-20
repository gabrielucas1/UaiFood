import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, getUserByPhone } from '../services/user.service';
import { z } from 'zod';
import { userSchema, loginSchema } from '../schema/user.schema';

/**
 * CONTROLADORES DO USUÁRIO
 * 
 * Os controladores são responsáveis por:
 * 1. Receber a requisição HTTP
 * 2. Validar os dados de entrada
 * 3. Chamar os serviços apropriados
 * 4. Retornar a resposta formatada
 */

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