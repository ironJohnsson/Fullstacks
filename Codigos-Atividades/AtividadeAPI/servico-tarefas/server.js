// Servico de Tarefas (Porta 4004) - Atividade 8
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_TAREFAS || 4004;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-tarefas'));

app.get('/status', (req, res) => {
  res.json({ servico: 'servico-tarefas', versao: '1.0.0', status: 'online' });
});

// Atividade 8: GET /tarefas com suporte a ?usuario=
app.get('/tarefas', async (req, res) => {
  try {
    let url = 'https://jsonplaceholder.typicode.com/todos';
    const { usuario } = req.query;

    if (usuario) {
      const uId = Number(usuario);
      if (isNaN(uId) || uId <= 0) {
        return res.status(400).json({ erro: 'O parâmetro usuario deve ser um número inteiro válido.' });
      }
      url += `?userId=${uId}`;
    }

    const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!resposta.ok) throw new Error('Falha ao consultar tarefas');

    const dados = await resposta.json();
    const formatados = dados.map(t => ({
      id: t.id,
      usuarioId: t.userId,
      titulo: t.title,
      concluida: t.completed
    }));

    res.status(200).json(formatados);
  } catch (erro) {
    res.status(502).json({ erro: 'Serviço externo de tarefas indisponível' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-tarefas] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
