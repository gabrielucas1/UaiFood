import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import routes from './routes/index.js';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3991;

// 🔧 Middlewares básicos
app.use(cors());
app.use(express.json());

// 📚 Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🍽️ UaiFood API',
  customCss: `
    .topbar-wrapper .link {
      content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI1IiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzMzNzNkYyI+VWFpRm9vZDwvdGV4dD4KPC9zdmc+');
    }
    .swagger-ui .topbar { background-color: #2c5530; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}));

// 🛣️ Rotas da API
app.use('/api', routes);

// ❤️ Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: '🍽️ UaiFood API funcionando!',
    timestamp: new Date().toISOString(),
    docs: 'http://localhost:3991/api-docs',
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
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log('=============================');
  console.log('');
});