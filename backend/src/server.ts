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

// 📚 Configuração do Swagger UI - CSS CORRIGIDO
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🍽️ UaiFood API',
  customCss: `
    .swagger-ui .topbar { 
      background-color: #2c5530; 
    }
    .swagger-ui .topbar-wrapper img {
      content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text x="5" y="25" font-family="Arial" font-size="18" font-weight="bold" fill="white">UaiFood</text></svg>');
    }
    .swagger-ui .topbar-wrapper .link:after {
      content: "UaiFood API";
      color: white;
      font-weight: bold;
    }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true
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
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log('=============================');
  console.log('');
});