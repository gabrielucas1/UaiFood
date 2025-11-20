import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes'; // Importar todas as rotas

// Configuração do dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3991;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota básica de teste
app.get('/', (req, res) => {
  res.send('API UaiFood está rodando!');
});

// Registrar todas as rotas da API
app.use('/api', routes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});