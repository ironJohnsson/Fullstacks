// Servico de Pedidos (Porta 4007)
// Cobre Atividades 13, 15, 16 e 20 (Projeto Integrador)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_PEDIDOS || 4007;
const URL_PRODUTOS = process.env.URL_PRODUTOS || 'http://localhost:4001';
const ARQUIVO_PERSISTENCIA = path.join(__dirname, 'pedidos.json');

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-pedidos'));

// Atividade 16: Persistência de Pedidos em Arquivo JSON Local
function carregarPedidos() {
  try {
    if (fs.existsSync(ARQUIVO_PERSISTENCIA)) {
      const conteudo = fs.readFileSync(ARQUIVO_PERSISTENCIA, 'utf8');
      return JSON.parse(conteudo);
    }
  } catch (err) {
    console.error('[servico-pedidos] Erro ao carregar pedidos.json:', err.message);
  }
  return [
    {
      id: 1,
      cliente: 'Mariana Silva',
      itens: [
        { produtoId: 1, nome: 'Teclado Mecânico RGB', precoUnitario: 250.00, quantidade: 2, subtotal: 500.00 }
      ],
      valorTotal: 500.00,
      dataCriacao: new Date().toISOString()
    }
  ];
}

function salvarPedidos(pedidos) {
  try {
    fs.writeFileSync(ARQUIVO_PERSISTENCIA, JSON.stringify(pedidos, null, 2), 'utf8');
  } catch (err) {
    console.error('[servico-pedidos] Erro ao persistir pedidos.json:', err.message);
  }
}

let pedidos = carregarPedidos();
let proximoId = pedidos.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;

app.get('/status', (req, res) => {
  res.json({
    servico: 'servico-pedidos',
    versao: '1.0.0',
    status: 'online',
    totalPedidosArmazenados: pedidos.length
  });
});

// GET /pedidos - Listar todos os pedidos
app.get('/pedidos', (req, res) => {
  res.json(pedidos);
});

// GET /pedidos/:id - Consultar um pedido
app.get('/pedidos/:id', (req, res) => {
  const id = Number(req.params.id);
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado' });
  }

  res.json(pedido);
});

// Atividades 15 e 20: POST /pedidos com validação cruzada no servico-produtos
app.post('/pedidos', async (req, res) => {
  const { cliente, itens } = req.body;

  if (!cliente || typeof cliente !== 'string' || !cliente.trim()) {
    return res.status(400).json({ erro: 'Campo cliente é obrigatório e deve ser uma string não vazia.' });
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'O pedido deve conter um array itens com pelo menos um produto.' });
  }

  const itensProcessados = [];
  let valorTotal = 0;

  for (const item of itens) {
    const produtoId = Number(item.produtoId);
    const quantidade = Number(item.quantidade);

    if (!produtoId || isNaN(produtoId)) {
      return res.status(400).json({ erro: 'Cada item deve ter um produtoId numérico válido.' });
    }

    if (!quantidade || isNaN(quantidade) || quantidade <= 0 || !Number.isInteger(quantidade)) {
      return res.status(400).json({ erro: `Quantidade inválida para o produto ID ${produtoId}. Deve ser um inteiro positivo.` });
    }

    // Atividade 15 e 20: Consulta externa ao servico-produtos com timeout
    try {
      const respProduto = await fetch(`${URL_PRODUTOS}/produtos/${produtoId}`, {
        signal: AbortSignal.timeout(4000) // Timeout de 4 segundos
      });

      if (respProduto.status === 404) {
        return res.status(404).json({
          erro: `Produto com ID ${produtoId} não foi encontrado no catálogo.`
        });
      }

      if (!respProduto.ok) {
        return res.status(502).json({
          erro: `Falha ao validar produto no serviço de catálogo (status ${respProduto.status}).`
        });
      }

      const prodInfo = await respProduto.json();
      const subtotal = prodInfo.preco * quantidade;
      valorTotal += subtotal;

      itensProcessados.push({
        produtoId: prodInfo.id,
        nome: prodInfo.nome,
        precoUnitario: prodInfo.preco,
        quantidade,
        subtotal
      });
    } catch (erro) {
      console.error('[servico-pedidos] Falha na comunicação com servico-produtos:', erro.message);
      // Atividade 15: Retorno controlado de indisponibilidade
      return res.status(503).json({
        erro: 'Serviço de produtos indisponível ou tempo limite de resposta esgotado. Tente novamente mais tarde.'
      });
    }
  }

  const novoPedido = {
    id: proximoId++,
    cliente: cliente.trim(),
    itens: itensProcessados,
    valorTotal: parseFloat(valorTotal.toFixed(2)),
    dataCriacao: new Date().toISOString()
  };

  pedidos.push(novoPedido);
  salvarPedidos(pedidos);

  res.status(201).json(novoPedido);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-pedidos] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
