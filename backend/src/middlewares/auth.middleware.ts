import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: bigint; phone: string; type: 'ADMIN' | 'CLIENT' };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Token não fornecido. Faça login primeiro!' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      id: string; 
      phone: string; 
      type: 'ADMIN' | 'CLIENT' 
    };
    
    req.user = {
      id: BigInt(decoded.id),
      phone: decoded.phone,
      type: decoded.type
    };
    
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


