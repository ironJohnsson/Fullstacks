import 'dotenv/config';
import express from 'express';
import type { ErrorRequestHandler } from 'express';
import path from 'node:path';
import { testConnection } from './config/database';
import alunosRouter from './routes/alunos';

const app = express();
const pastaPublica = path.resolve(process.cwd(), 'public');
const porta = Number(process.env.PORT ?? '3000');

// O Express entende JSON recebido do navegador.
app.use(express.json());
app.use(express.static(pastaPublica));

// Somente o backend acessa o MySQL; o navegador usa estas rotas HTTP.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', alunosRouter);

app.get('/', (_req, res) => {
  res.sendFile(path.join(pastaPublica, 'index.html'));
});

// Mensagem segura para erros inesperados, sem detalhes do servidor.
const tratarErro: ErrorRequestHandler = (erro, _req, res, _next) => {
  console.error('Erro não tratado:', erro);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
};

app.use(tratarErro);

async function iniciar(): Promise<void> {
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error('PORT deve ser uma porta válida.');
  }

  // Só aceita visitas depois de confirmar a conexão com o banco.
  await testConnection();

  app.listen(porta, () => {
    console.log(`Aplicação disponível em http://localhost:${porta}`);
  });
}

iniciar().catch((erro: unknown) => {
  console.error('Não foi possível iniciar. Confira MySQL e .env:', erro);
  process.exitCode = 1;
});

