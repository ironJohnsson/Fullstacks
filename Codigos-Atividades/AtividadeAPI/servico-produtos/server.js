// Servico de Produtos (Porta 4001)
// Cobre Atividades 1, 2, 3, 4, 11 e 12
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_PRODUTOS || 4001;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-produtos'));

// Catálogo em memória
let proximoId = 6;
let produtos = [
  { id: 1, nome: 'Teclado Mecânico RGB', preco: 250.00, categoria: 'perifericos' },
  { id: 2, nome: 'Mouse Gamer 16000 DPI', preco: 150.00, categoria: 'perifericos' },
  { id: 3, nome: 'Monitor 24 Pol Full HD 144Hz', preco: 950.00, categoria: 'monitores' },
  { id: 4, nome: 'Headset 7.1 Surround', preco: 200.00, categoria: 'audio' },
  { id: 5, nome: 'Mousepad Extra Grande', preco: 60.00, categoria: 'acessorios' }
];

// Atividade 1: GET /status
app.get('/status', (req, res) => {
  res.json({
    servico: 'servico-produtos',
    versao: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Atividades 2 e 3: GET /produtos com suporte a filtros ?categoria= e ?limite=
app.get('/produtos', (req, res) => {
  let resultado = [...produtos];

  const { categoria, limite } = req.query;

  if (categoria) {
    resultado = resultado.filter(p => p.categoria.toLowerCase() === String(categoria).toLowerCase());
  }

  if (limite) {
    const lim = Number(limite);
    if (!Number.isInteger(lim) || lim <= 0) {
      return res.status(400).json({ erro: 'O parâmetro limite deve ser um número inteiro positivo.' });
    }
    resultado = resultado.slice(0, lim);
  }

  res.json(resultado);
});

// Atividade 2: GET /produtos/:id (com 404 para inexistente)
app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json(produto);
});

// Atividades 4 e 11: POST /produtos (validação de nome e preço, 201 ou 400)
app.post('/produtos', (req, res) => {
  const { nome, preco, categoria } = req.body;

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    return res.status(400).json({ erro: 'Campo nome é obrigatório e deve ser uma string não vazia.' });
  }

  const precoNum = Number(preco);
  if (preco === undefined || isNaN(precoNum) || precoNum <= 0) {
    return res.status(400).json({ erro: 'Campo preco é obrigatório e deve ser um número maior que zero.' });
  }

  const novoProduto = {
    id: proximoId++,
    nome: nome.trim(),
    preco: precoNum,
    categoria: (categoria && typeof categoria === 'string') ? categoria.trim().toLowerCase() : 'geral'
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// Atividade 12: PUT /produtos/:id (Atualização de dados)
app.put('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { nome, preco, categoria } = req.body;
  let alterou = false;

  if (nome && typeof nome === 'string' && nome.trim()) {
    produto.nome = nome.trim();
    alterou = true;
  }

  if (preco !== undefined) {
    const p = Number(preco);
    if (isNaN(p) || p <= 0) {
      return res.status(400).json({ erro: 'Preço deve ser um número válido maior que zero.' });
    }
    produto.preco = p;
    alterou = true;
  }

  if (categoria && typeof categoria === 'string') {
    produto.categoria = categoria.trim().toLowerCase();
    alterou = true;
  }

  if (!alterou) {
    return res.status(400).json({ erro: 'Envie ao menos um campo válido para atualizar (nome, preco ou categoria).' });
  }

  res.status(200).json(produto);
});

// Atividade 12: DELETE /produtos/:id (Exclusão com 204 No Content ou 404)
app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.splice(index, 1);
  res.status(204).end();
});

// Endpoint especial para teste de indisponibilidade/timeout (Atividade 15)
app.get('/simular-lentidao', async (req, res) => {
  await new Promise(r => setTimeout(r, 6000));
  res.json({ mensagem: 'Resposta atrasada' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-produtos] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
