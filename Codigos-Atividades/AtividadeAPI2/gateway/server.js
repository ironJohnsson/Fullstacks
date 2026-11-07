// API Gateway (Porta 5000) - Monitoramento Meteorológico
// Centraliza requisições, faz orquestração entre microsserviços e serve a SPA frontend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_GATEWAY || 5000;
const URL_CIDADES = process.env.URL_CIDADES || 'http://localhost:5001';
const URL_CLIMA = process.env.URL_CLIMA || 'http://localhost:5002';

app.use(cors());
app.use(express.json());
app.use(criarLogger('api-gateway'));

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// 1. Healthcheck e status dos serviços
app.get('/api/status', async (req, res) => {
  const checagens = {
    gateway: { status: 'online', porta: PORT, versao: '1.0.0' },
    servicoCidades: { status: 'offline', url: URL_CIDADES },
    servicoClima: { status: 'offline', url: URL_CLIMA }
  };

  try {
    const resCidades = await fetch(`${URL_CIDADES}/status`, { signal: AbortSignal.timeout(2000) });
    if (resCidades.ok) checagens.servicoCidades = await resCidades.json();
  } catch (e) {
    checagens.servicoCidades.erro = e.message;
  }

  try {
    const resClima = await fetch(`${URL_CLIMA}/status`, { signal: AbortSignal.timeout(2000) });
    if (resClima.ok) checagens.servicoClima = await resClima.json();
  } catch (e) {
    checagens.servicoClima.erro = e.message;
  }

  const todosOnline =
    checagens.servicoCidades.status === 'online' &&
    checagens.servicoClima.status === 'online';

  res.status(todosOnline ? 200 : 503).json({
    sistema: 'Monitoramento Meteorológico - Arquitetura de Microsserviços',
    statusGeral: todosOnline ? 'operacional' : 'degradado',
    timestamp: new Date().toISOString(),
    servicos: checagens
  });
});

// 2. Proxy para busca de cidades (Microsserviço de Localização)
app.get('/api/cidades', async (req, res) => {
  const { nome } = req.query;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'Informe o nome de uma cidade para consultar.' });
  }

  try {
    const url = `${URL_CIDADES}/cidades?nome=${encodeURIComponent(nome.trim())}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(7000) });
    const dados = await resposta.json();
    return res.status(resposta.status).json(dados);
  } catch (erro) {
    console.error('[gateway] Erro ao comunicar com servico-cidades:', erro.message);
    return res.status(503).json({
      erro: 'Microsserviço de Cidades indisponível ou inacessível no momento.',
      detalhes: erro.message
    });
  }
});

// 3. Proxy para meteorologia por coordenadas
app.get('/api/meteorologia', async (req, res) => {
  const { lat, lon } = req.query;

  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ erro: 'Latitude e longitude são obrigatórias.' });
  }

  try {
    const url = `${URL_CLIMA}/meteorologia?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(7000) });
    const dados = await resposta.json();
    return res.status(resposta.status).json(dados);
  } catch (erro) {
    console.error('[gateway] Erro ao comunicar com servico-clima:', erro.message);
    return res.status(503).json({
      erro: 'Microsserviço de Meteorologia indisponível ou inacessível no momento.',
      detalhes: erro.message
    });
  }
});

// 4. Endpoint Integrado Orquestrado: GET /api/clima?cidade=Salvador&id=...
app.get('/api/clima', async (req, res) => {
  const { cidade, id, lat, lon } = req.query;

  if ((!cidade || cidade.trim() === '') && (lat === undefined || lon === undefined)) {
    return res.status(400).json({
      erro: 'Parâmetro "cidade" ou coordenadas ("lat" e "lon") são obrigatórios.',
      exemplo: '/api/clima?cidade=Salvador'
    });
  }

  try {
    let localidadeEscolhida = null;
    let homonimas = [];

    // Se coordenadas diretas foram fornecidas
    if (lat !== undefined && lon !== undefined) {
      localidadeEscolhida = {
        id: id || 'custom',
        nome: cidade ? cidade.trim() : 'Localização informada',
        estado: '',
        pais: '',
        paisCodigo: '',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        rotuloCompleto: cidade ? cidade.trim() : `Lat ${lat}, Lon ${lon}`
      };
    } else {
      // 1ª Etapa: Consultar Microsserviço de Cidades
      const resCidades = await fetch(`${URL_CIDADES}/cidades?nome=${encodeURIComponent(cidade.trim())}`, {
        signal: AbortSignal.timeout(7000)
      });

      if (!resCidades.ok) {
        const erroCidades = await resCidades.json();
        return res.status(resCidades.status).json(erroCidades);
      }

      const dadosCidades = await resCidades.json();
      homonimas = dadosCidades.resultados || [];

      if (homonimas.length === 0) {
        return res.status(404).json({
          erro: `Nenhuma cidade encontrada para "${cidade}".`,
          cidade
        });
      }

      // Se um ID específico foi fornecido (quando o usuário escolhe entre homônimas)
      if (id) {
        localidadeEscolhida = homonimas.find(c => String(c.id) === String(id)) || homonimas[0];
      } else {
        localidadeEscolhida = homonimas[0];
      }
    }

    // 2ª Etapa: Consultar Microsserviço de Clima com as coordenadas da cidade
    const resClima = await fetch(
      `${URL_CLIMA}/meteorologia?lat=${localidadeEscolhida.latitude}&lon=${localidadeEscolhida.longitude}`,
      { signal: AbortSignal.timeout(7000) }
    );

    if (!resClima.ok) {
      const erroClima = await resClima.json();
      return res.status(resClima.status).json(erroClima);
    }

    const dadosClima = await resClima.json();

    // 3ª Etapa: Montar resposta integrada e unificada
    return res.status(200).json({
      sucesso: true,
      timestampConsulta: new Date().toISOString(),
      localidade: localidadeEscolhida,
      homonimas: homonimas.length > 1 ? homonimas : [],
      condicoesAtuais: dadosClima.condicoesAtuais,
      previsao5Dias: dadosClima.previsao5Dias,
      grafico: dadosClima.grafico,
      coordenadas: dadosClima.coordenadas,
      fusoHorario: dadosClima.fusoHorario
    });
  } catch (erro) {
    if (erro.name === 'TimeoutError' || erro.name === 'AbortError') {
      return res.status(504).json({
        erro: 'Tempo limite excedido na orquestração dos microsserviços.',
        detalhes: 'Um ou mais serviços demoraram para responder.'
      });
    }

    console.error('[gateway] Erro geral:', erro.message);
    return res.status(503).json({
      erro: 'Falha na comunicação entre os microsserviços.',
      detalhes: erro.message
    });
  }
});

// 5. Comparação de Previsão entre duas Cidades: GET /api/comparar?cidade1=Salvador&cidade2=Curitiba
app.get('/api/comparar', async (req, res) => {
  const { cidade1, cidade2 } = req.query;

  if (!cidade1 || !cidade2 || cidade1.trim() === '' || cidade2.trim() === '') {
    return res.status(400).json({
      erro: 'Informe "cidade1" e "cidade2" para realizar a comparação.',
      exemplo: '/api/comparar?cidade1=Salvador&cidade2=Curitiba'
    });
  }

  try {
    const [res1, res2] = await Promise.all([
      fetch(`http://localhost:${PORT}/api/clima?cidade=${encodeURIComponent(cidade1.trim())}`, {
        signal: AbortSignal.timeout(8000)
      }),
      fetch(`http://localhost:${PORT}/api/clima?cidade=${encodeURIComponent(cidade2.trim())}`, {
        signal: AbortSignal.timeout(8000)
      })
    ]);

    if (!res1.ok) {
      const err = await res1.json();
      return res.status(res1.status).json({ erro: `Erro na cidade 1 ("${cidade1}"): ${err.erro || 'Falha ao consultar'}` });
    }

    if (!res2.ok) {
      const err = await res2.json();
      return res.status(res2.status).json({ erro: `Erro na cidade 2 ("${cidade2}"): ${err.erro || 'Falha ao consultar'}` });
    }

    const c1 = await res1.json();
    const c2 = await res2.json();

    const t1 = c1.condicoesAtuais.temperatura;
    const t2 = c2.condicoesAtuais.temperatura;
    const diffTemp = Math.abs(t1 - t2).toFixed(1);

    let analise = '';
    if (t1 > t2) {
      analise = `${c1.localidade.nome} está mais quente que ${c2.localidade.nome} por uma diferença de ${diffTemp}°C.`;
    } else if (t2 > t1) {
      analise = `${c2.localidade.nome} está mais quente que ${c1.localidade.nome} por uma diferença de ${diffTemp}°C.`;
    } else {
      analise = `Ambas as cidades estão com a mesma temperatura atual (${t1}°C).`;
    }

    res.status(200).json({
      cidade1: {
        localidade: c1.localidade,
        condicoesAtuais: c1.condicoesAtuais,
        previsao5Dias: c1.previsao5Dias,
        grafico: c1.grafico
      },
      cidade2: {
        localidade: c2.localidade,
        condicoesAtuais: c2.condicoesAtuais,
        previsao5Dias: c2.previsao5Dias,
        grafico: c2.grafico
      },
      comparativo: {
        diferencaTemperaturaAtual: Number(diffTemp),
        maisQuente: t1 > t2 ? c1.localidade.nome : t2 > t1 ? c2.localidade.nome : 'Empate',
        maisFria: t1 < t2 ? c1.localidade.nome : t2 < t1 ? c2.localidade.nome : 'Empate',
        analise
      }
    });
  } catch (erro) {
    res.status(503).json({
      erro: 'Falha ao comparar as previsões das cidades.',
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
    console.log(`[API Gateway] Ativo e servindo frontend em http://localhost:${PORT}`);
  });
}

module.exports = app;
