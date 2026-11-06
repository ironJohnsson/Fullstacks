// API Gateway (Porta 4000) - Atividade 14
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_GATEWAY || 4000;

app.use(cors());
app.use(express.json());
app.use(criarLogger('api-gateway'));

// Mapeamento dos microsserviços internos
const ROTAS = {
  '/api/produtos': (process.env.URL_PRODUTOS || 'http://localhost:4001').replace(/\/$/, '') + '/produtos',
  '/api/enderecos': (process.env.URL_ENDERECOS || 'http://localhost:4002').replace(/\/$/, '') + '/enderecos',
  '/api/usuarios': (process.env.URL_USUARIOS || 'http://localhost:4003').replace(/\/$/, '') + '/usuarios',
  '/api/users': (process.env.URL_USUARIOS || 'http://localhost:4003').replace(/\/$/, '') + '/users',
  '/api/tarefas': (process.env.URL_TAREFAS || 'http://localhost:4004').replace(/\/$/, '') + '/tarefas',
  '/api/clima': (process.env.URL_CLIMA || 'http://localhost:4005').replace(/\/$/, '') + '/clima',
  '/api/pokemon': (process.env.URL_POKEMON || 'http://localhost:4006').replace(/\/$/, '') + '/pokemon',
  '/api/pedidos': (process.env.URL_PEDIDOS || 'http://localhost:4007').replace(/\/$/, '') + '/pedidos'
};

app.get('/', (req, res) => {
  res.json({
    servico: 'api-gateway',
    versao: '1.0.0',
    status: 'online',
    rotasDisponiveis: Object.keys(ROTAS)
  });
});

// Middleware de Proxy Universal para repassar requisições aos serviços mantendo métodos, headers e status
async function repassarRequisicao(urlDestino, req, res) {
  try {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const destinoFinal = urlDestino + query;

    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': req.headers['x-request-id'] || ''
      },
      signal: AbortSignal.timeout(5000)
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const resposta = await fetch(destinoFinal, options);

    res.status(resposta.status);
    if (resposta.status === 204) {
      return res.end();
    }

    const contentType = resposta.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const dados = await resposta.json();
      return res.json(dados);
    } else {
      const texto = await resposta.text();
      return res.send(texto);
    }
  } catch (erro) {
    console.error(`[api-gateway] Erro ao repassar para ${urlDestino}:`, erro.message);
    if (erro.name === 'TimeoutError') {
      return res.status(504).json({ erro: 'Gateway Timeout: serviço de destino demorou a responder.' });
    }
    return res.status(502).json({ erro: 'Bad Gateway: serviço de destino indisponível ou inacessível.' });
  }
}

// Registro das rotas no Gateway
Object.entries(ROTAS).forEach(([prefixo, destino]) => {
  app.all(`${prefixo}*`, (req, res) => {
    const sufixo = req.path.slice(prefixo.length);
    const urlAlvo = destino + sufixo;
    repassarRequisicao(urlAlvo, req, res);
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[api-gateway] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
