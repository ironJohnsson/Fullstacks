// API Gateway (Porta 5050) - Pokédex Explorer Web App
// Ponto único de entrada para o frontend, orquestrador, proxy reverso e comparador
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { criarLogger } = require('../shared/logger');
const { TIPOS_POKEMON } = require('../shared/pokemon-types');

const app = express();
const PORT = process.env.PORT_GATEWAY || 5050;
const URL_CATALOGO = process.env.URL_CATALOGO || 'http://localhost:5051';
const URL_DETALHES = process.env.URL_DETALHES || 'http://localhost:5052';

app.use(cors());
app.use(express.json());
app.use(criarLogger('api-gateway'));

// Servir os arquivos estáticos da SPA (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 1. Healthcheck e status dos serviços
app.get('/api/status', async (req, res) => {
  const checagens = {
    gateway: { status: 'online', porta: PORT, versao: '1.0.0' },
    servicoCatalogo: { status: 'offline', url: URL_CATALOGO },
    servicoDetalhes: { status: 'offline', url: URL_DETALHES }
  };

  try {
    const rCat = await fetch(`${URL_CATALOGO}/status`, { signal: AbortSignal.timeout(2000) });
    if (rCat.ok) checagens.servicoCatalogo = await rCat.json();
  } catch (e) {
    checagens.servicoCatalogo.erro = e.message;
  }

  try {
    const rDet = await fetch(`${URL_DETALHES}/status`, { signal: AbortSignal.timeout(2000) });
    if (rDet.ok) checagens.servicoDetalhes = await rDet.json();
  } catch (e) {
    checagens.servicoDetalhes.erro = e.message;
  }

  const todosOnline =
    checagens.servicoCatalogo.status === 'online' &&
    checagens.servicoDetalhes.status === 'online';

  res.status(todosOnline ? 200 : 503).json({
    sistema: 'Pokédex Explorer · Arquitetura de Microsserviços',
    statusGeral: todosOnline ? 'operacional' : 'degradado',
    timestamp: new Date().toISOString(),
    servicos: checagens
  });
});

// 2. Rota para listar os tipos de Pokémon disponíveis
app.get('/api/tipos', (req, res) => {
  const lista = Object.entries(TIPOS_POKEMON).map(([chave, val]) => ({
    id: chave,
    ...val
  }));
  res.json({ total: lista.length, tipos: lista });
});

// 3. Proxy para o catálogo com paginação e filtros
app.get('/api/catalogo', async (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  try {
    const url = `${URL_CATALOGO}/catalogo${query ? `?${query}` : ''}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const dados = await resposta.json();
    return res.status(resposta.status).json(dados);
  } catch (erro) {
    console.error('[gateway] Erro ao comunicar com servico-catalogo:', erro.message);
    return res.status(503).json({
      erro: 'Microsserviço de Catálogo temporariamente indisponível.',
      detalhes: erro.message
    });
  }
});

// 4. Proxy para detalhes de um Pokémon
app.get('/api/pokemon/:idOuNome', async (req, res) => {
  const { idOuNome } = req.params;

  if (!idOuNome || typeof idOuNome !== 'string' || idOuNome.trim() === '') {
    return res.status(400).json({ erro: 'Informe o nome ou número do Pokémon.' });
  }

  try {
    const url = `${URL_DETALHES}/pokemon/${encodeURIComponent(idOuNome.trim().toLowerCase())}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const dados = await resposta.json();
    return res.status(resposta.status).json(dados);
  } catch (erro) {
    console.error('[gateway] Erro ao comunicar com servico-detalhes:', erro.message);
    return res.status(503).json({
      erro: 'Microsserviço de Detalhes temporariamente indisponível.',
      detalhes: erro.message
    });
  }
});

// 5. Rota para sortear um Pokémon aleatório (1 a 1025)
app.get('/api/aleatorio', async (req, res) => {
  const idAleatorio = Math.floor(Math.random() * 1025) + 1;
  try {
    const url = `${URL_DETALHES}/pokemon/${idAleatorio}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const dados = await resposta.json();
    return res.status(resposta.status).json(dados);
  } catch (erro) {
    res.status(503).json({ erro: 'Falha ao sortear Pokémon aleatório.', detalhes: erro.message });
  }
});

// 6. Comparação lado a lado entre dois Pokémon
app.get('/api/comparar', async (req, res) => {
  const { p1, p2 } = req.query;

  if (!p1 || !p2 || p1.trim() === '' || p2.trim() === '') {
    return res.status(400).json({
      erro: 'Informe os parâmetros "p1" e "p2" com o nome ou número de dois Pokémon.',
      exemplo: '/api/comparar?p1=pikachu&p2=charizard'
    });
  }

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${URL_DETALHES}/pokemon/${encodeURIComponent(p1.trim().toLowerCase())}`, { signal: AbortSignal.timeout(8000) }),
      fetch(`${URL_DETALHES}/pokemon/${encodeURIComponent(p2.trim().toLowerCase())}`, { signal: AbortSignal.timeout(8000) })
    ]);

    if (!res1.ok) {
      const err = await res1.json().catch(() => ({}));
      return res.status(res1.status).json({ erro: `Pokémon 1 ("${p1}"): ${err.erro || 'Falha ao consultar'}` });
    }

    if (!res2.ok) {
      const err = await res2.json().catch(() => ({}));
      return res.status(res2.status).json({ erro: `Pokémon 2 ("${p2}"): ${err.erro || 'Falha ao consultar'}` });
    }

    const d1 = await res1.json();
    const d2 = await res2.json();

    // Comparação de cada atributo
    const statsComparados = d1.estatisticas.map((s1) => {
      const s2 = d2.estatisticas.find(s => s.chave === s1.chave) || { valor: 0 };
      const diff = s1.valor - s2.valor;
      let vencedor = 'empate';
      if (diff > 0) vencedor = d1.nomeFormatado;
      else if (diff < 0) vencedor = d2.nomeFormatado;

      return {
        chave: s1.chave,
        nome: s1.nome,
        valor1: s1.valor,
        valor2: s2.valor,
        diferenca: Math.abs(diff),
        vencedor
      };
    });

    const diffTotal = d1.totalEstatisticas - d2.totalEstatisticas;
    let maiorTotal = 'Empate';
    if (diffTotal > 0) maiorTotal = d1.nomeFormatado;
    else if (diffTotal < 0) maiorTotal = d2.nomeFormatado;

    res.json({
      sucesso: true,
      pokemon1: d1,
      pokemon2: d2,
      comparativo: {
        total1: d1.totalEstatisticas,
        total2: d2.totalEstatisticas,
        diferencaTotal: Math.abs(diffTotal),
        maiorTotal,
        estatisticas: statsComparados,
        pesoComparado: {
          peso1: d1.medidas.pesoKg,
          peso2: d2.medidas.pesoKg,
          maisPesado: d1.medidas.pesoKg > d2.medidas.pesoKg ? d1.nomeFormatado : d2.medidas.pesoKg > d1.medidas.pesoKg ? d2.nomeFormatado : 'Empate'
        },
        alturaComparada: {
          altura1: d1.medidas.alturaMetros,
          altura2: d2.medidas.alturaMetros,
          maisAlto: d1.medidas.alturaMetros > d2.medidas.alturaMetros ? d1.nomeFormatado : d2.medidas.alturaMetros > d1.medidas.alturaMetros ? d2.nomeFormatado : 'Empate'
        }
      }
    });

  } catch (erro) {
    console.error('[gateway] Erro ao comparar:', erro.message);
    res.status(503).json({
      erro: 'Falha na orquestração da comparação.',
      detalhes: erro.message
    });
  }
});

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[API Gateway] Ativo e servindo a Pokédex Explorer em http://localhost:${PORT}`);
  });
}

module.exports = app;
