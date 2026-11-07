// Microsserviço de Cidades e Geocodificação (Porta 5001)
// Responsável pela busca de coordenadas, estado, país e detecção de homônimas.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_CIDADES || 5001;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-cidades'));

app.get('/status', (req, res) => {
  res.json({
    servico: 'servico-cidades',
    versao: '1.0.0',
    descricao: 'Serviço de geocodificação e localização de cidades via Open-Meteo Geocoding API',
    status: 'online'
  });
});

app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Microsserviço de Cidades · Porta 5001</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b1320; color: #f1f5f9; padding: 2.5rem; line-height: 1.6; }
          .card { max-width: 640px; margin: 0 auto; background: #132238; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .badge { display: inline-block; background: #16a34a; color: white; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; }
          h1 { margin-top: 0.75rem; font-size: 1.5rem; }
          p { color: #94a3b8; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 0.8rem; }
          a.endpoint { color: #38bdf8; text-decoration: none; font-family: monospace; background: rgba(56, 189, 248, 0.1); padding: 4px 8px; border-radius: 6px; }
          a.endpoint:hover { text-decoration: underline; background: rgba(56, 189, 248, 0.2); }
          .cta { display: block; margin-top: 1.5rem; text-align: center; background: #0284c7; color: white; padding: 12px; border-radius: 8px; font-weight: bold; text-decoration: none; }
          .cta:hover { background: #0369a1; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">ONLINE · PORTA 5001</span>
          <h1>📍 Microsserviço de Cidades e Geocodificação</h1>
          <p>Este é um <strong>microsserviço de backend (API REST)</strong>. Ele processa consultas de cidades, extrai coordenadas geográficas (latitude/longitude), estado e país via Open-Meteo Geocoding.</p>
          
          <h3>Endpoints de API disponíveis para teste:</h3>
          <ul>
            <li>👉 <a class="endpoint" href="/status">/status</a> — Status e saúde do serviço</li>
            <li>👉 <a class="endpoint" href="/cidades?nome=Salvador">/cidades?nome=Salvador</a> — Coordenadas de Salvador (BA)</li>
            <li>👉 <a class="endpoint" href="/cidades?nome=Curitiba">/cidades?nome=Curitiba</a> — Coordenadas de Curitiba (PR)</li>
            <li>👉 <a class="endpoint" href="/cidades?nome=Valenca">/cidades?nome=Valenca</a> — Exemplo com cidades homônimas</li>
          </ul>

          <a href="http://localhost:5000" class="cta">🌐 Abrir a Aplicação Completa com Interface Visual (Porta 5000)</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      servico: 'servico-cidades',
      porta: PORT,
      status: 'online',
      endpoints: ['/status', '/cidades?nome={cidade}'],
      interfaceVisual: 'http://localhost:5000'
    });
  }
});

// GET /cidades?nome=Salvador
app.get('/cidades', async (req, res) => {
  const { nome } = req.query;

  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    return res.status(400).json({
      erro: 'Parâmetro "nome" é obrigatório e não pode ser vazio.',
      exemplo: '/cidades?nome=Salvador'
    });
  }

  const termo = nome.trim();

  if (termo.length < 2) {
    return res.status(400).json({
      erro: 'O nome da cidade deve ter pelo menos 2 caracteres.',
      termo
    });
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(termo)}&count=10&language=pt&format=json`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!resposta.ok) {
      return res.status(502).json({
        erro: 'Falha ao consultar a API Open-Meteo Geocoding.',
        statusHttp: resposta.status
      });
    }

    const dados = await resposta.json();

    if (!dados.results || dados.results.length === 0) {
      return res.status(404).json({
        erro: `Nenhuma cidade encontrada para "${termo}".`,
        termo,
        total: 0,
        resultados: []
      });
    }

    const cidades = dados.results.map((item) => {
      const partes = [item.name];
      if (item.admin1) partes.push(item.admin1);
      if (item.country) partes.push(item.country);

      return {
        id: item.id,
        nome: item.name,
        estado: item.admin1 || item.admin2 || 'Não informado',
        pais: item.country || 'Não informado',
        paisCodigo: item.country_code ? item.country_code.toUpperCase() : '',
        latitude: item.latitude,
        longitude: item.longitude,
        elevacao: item.elevation,
        fusoHorario: item.timezone || 'UTC',
        populacao: item.population || 0,
        rotuloCompleto: partes.join(', ')
      };
    });

    res.status(200).json({
      termo,
      total: cidades.length,
      homonimas: cidades.length > 1,
      resultados: cidades
    });
  } catch (erro) {
    if (erro.name === 'TimeoutError' || erro.name === 'AbortError') {
      return res.status(504).json({
        erro: 'Tempo limite excedido ao consultar o serviço externo de Geocoding.',
        detalhe: 'A API Open-Meteo não respondeu dentro do limite de 6 segundos.'
      });
    }

    console.error('[servico-cidades] Erro:', erro.message);
    res.status(502).json({
      erro: 'Serviço externo Open-Meteo Geocoding indisponível.',
      detalhe: erro.message
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-cidades] Ativo na porta ${PORT}`);
  });
}

module.exports = app;
