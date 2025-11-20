import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Interface para tipagem melhor
interface AuthRequest extends Request {
  user?: { id: string; type: 'ADMIN' | 'CLIENT' };
}

// Middleware para verificar se o usuário está logado
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Pegar o token do cabeçalho da requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer SEU_TOKEN_AQUI"

  // 2. Se não tem token, retorna erro
  if (!token) {
    return res.status(401).json({ 
      error: 'Token não fornecido. Faça login primeiro!' 
    });
  }

  try {
    // 3. Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; type: 'ADMIN' | 'CLIENT' };
    
    // 4. Salvar os dados do usuário na requisição para usar depois
    req.user = decoded;
    
    // 5. Continuar para a próxima função
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Token inválido ou expirado!' 
    });
  }
};

// 💂 NOVO: Middleware de Autorização (verifica o tipo de usuário)
export const checkRole = (allowedType: 'ADMIN' | 'CLIENT') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Verifica se o req.user foi anexado pelo authenticateToken
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado. Use authenticateToken primeiro!' 
      });
    }

    // Verifica se o tipo do usuário é o permitido
    if (req.user.type !== allowedType) {
      // 403 Forbidden = Você está logado, mas não tem permissão
      return res.status(403).json({ 
        error: `Acesso negado. Apenas usuários ${allowedType} podem acessar.` 
      });
    }

    // Se tiver permissão, continua
    next();
  };
};


