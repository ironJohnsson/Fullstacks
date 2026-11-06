// Servico de Usuários (Porta 4003) - Atividades 5 e 6
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_USUARIOS || 4003;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-usuarios'));

app.get('/status', (req, res) => {
  res.json({ servico: 'servico-usuarios', versao: '1.0.0', status: 'online' });
});

// Atividade 5: GET /users - Lista resumida de usuários externos
app.get('/users', async (req, res) => {
  try {
    const resposta = await fetch('https://jsonplaceholder.typicode.com/users', {
      signal: AbortSignal.timeout(5000)
    });

    if (!resposta.ok) throw new Error('Falha ao consultar JSONPlaceholder');

    const lista = await resposta.json();
    const resumida = lista.map(u => ({
      id: u.id,
      nome: u.name,
      usuario: u.username,
      email: u.email,
      cidade: u.address?.city || ''
    }));

    res.status(200).json(resumida);
  } catch (erro) {
    res.status(502).json({ erro: 'Serviço externo de usuários indisponível' });
  }
});

// Atividade 6: GET /usuarios/:id - Detalhes de um usuário
app.get('/usuarios/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id || id <= 0) {
    return res.status(400).json({ erro: 'ID de usuário inválido' });
  }

  try {
    const resposta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      signal: AbortSignal.timeout(5000)
    });

    if (resposta.status === 404) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (!resposta.ok) throw new Error('Falha ao consultar JSONPlaceholder');

    const u = await resposta.json();
    res.status(200).json({
      id: u.id,
      nome: u.name,
      usuario: u.username,
      email: u.email,
      telefone: u.phone,
      cidade: u.address?.city,
      empresa: u.company?.name
    });
  } catch (erro) {
    res.status(502).json({ erro: 'Serviço externo de usuários indisponível' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-usuarios] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
