import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import routes from './routes/index';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3991;

// 🔧 Middlewares básicos
app.use(cors());
app.use(express.json());

app.use('/api-docs', (swaggerUi.serve as unknown) as express.RequestHandler);
app.get('/api-docs', (swaggerUi.setup(swaggerSpec) as unknown) as express.RequestHandler);
app.use('/api', routes);

// ❤️ Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: '🍽️ UaiFood API funcionando!',
    timestamp: new Date().toISOString(),
    docs: `http://localhost:${PORT}/api-docs`,
    version: '1.0.0'
  });
});

// 🏠 Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🍽️ Bem-vindo à UaiFood API!',
    documentation: '/api-docs',
    health: '/health',
    api: '/api'
  });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🍽️  ===== UAIFOOD API =====');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
  console.log('=============================');
  console.log('');
});