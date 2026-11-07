// Microsserviço de Meteorologia e Previsão (Porta 5002)
// Responsável por coletar condições em tempo real e previsão de 5 dias via Open-Meteo Weather API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');
const { interpretarWMO, grausParaCardeal, classificarIndiceUV } = require('../shared/wmo-codes');

const app = express();
const PORT = process.env.PORT_CLIMA || 5002;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-clima'));

app.get('/status', (req, res) => {
  res.json({
    servico: 'servico-clima',
    versao: '1.0.0',
    descricao: 'Serviço de previsão do tempo e condições atmosféricas via Open-Meteo Forecast API',
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
        <title>Microsserviço de Clima · Porta 5002</title>
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
          <span class="badge">ONLINE · PORTA 5002</span>
          <h1>🌡️ Microsserviço de Meteorologia e Previsão</h1>
          <p>Este é um <strong>microsserviço de backend (API REST)</strong>. Ele processa telemetria física em tempo real, índices UV com faixas de risco, vento cardeal, códigos WMO traduzidos e previsão de 5 dias via Open-Meteo Forecast.</p>
          
          <h3>Endpoints de API disponíveis para teste:</h3>
          <ul>
            <li>👉 <a class="endpoint" href="/status">/status</a> — Status e saúde do serviço</li>
            <li>👉 <a class="endpoint" href="/meteorologia?lat=-12.9756&lon=-38.4909">/meteorologia?lat=-12.9756&lon=-38.4909</a> — Clima de Salvador (BA)</li>
            <li>👉 <a class="endpoint" href="/meteorologia?lat=-25.4278&lon=-49.2731">/meteorologia?lat=-25.4278&lon=-49.2731</a> — Clima de Curitiba (PR)</li>
          </ul>

          <a href="http://localhost:5000" class="cta">🌐 Abrir a Aplicação Completa com Interface Visual (Porta 5000)</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      servico: 'servico-clima',
      porta: PORT,
      status: 'online',
      endpoints: ['/status', '/meteorologia?lat={lat}&lon={lon}'],
      interfaceVisual: 'http://localhost:5000'
    });
  }
});

// GET /meteorologia?lat=-12.97&lon=-38.50
app.get('/meteorologia', async (req, res) => {
  const { lat, lon } = req.query;

  if (lat === undefined || lon === undefined) {
    return res.status(400).json({
      erro: 'Parâmetros "lat" (latitude) e "lon" (longitude) são obrigatórios.',
      exemplo: '/meteorologia?lat=-12.9756&lon=-38.4909'
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(400).json({
      erro: 'Latitude inválida. O valor deve ser um número entre -90 e 90.',
      valorRecebido: lat
    });
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({
      erro: 'Longitude inválida. O valor deve ser um número entre -180 e 180.',
      valorRecebido: lon
    });
  }

  try {
    const params = [
      `latitude=${latitude}`,
      `longitude=${longitude}`,
      'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
      'daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,wind_speed_10m_max',
      'forecast_days=6',
      'timezone=auto'
    ].join('&');

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!resposta.ok) {
      return res.status(502).json({
        erro: 'Falha ao consultar a API Open-Meteo Forecast.',
        statusHttp: resposta.status
      });
    }

    const dados = await resposta.json();
    const cur = dados.current || {};
    const d = dados.daily || {};

    const diasSemanaNomes = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    // Montar a previsão dos próximos 5 dias (ignorando o dia 0 se for o atual ou mostrando os 5 próximos dias)
    const datas = d.time || [];
    const previsao5Dias = [];

    // Pegamos a partir do índice 1 (próximos 5 dias) para focar na previsão futura
    const inicioPrevisao = datas.length > 5 ? 1 : 0;
    const fimPrevisao = Math.min(datas.length, inicioPrevisao + 5);

    for (let i = inicioPrevisao; i < fimPrevisao; i++) {
      const dataIso = datas[i];
      // Criar objeto Date tratando fuso horário
      const [ano, mes, dia] = dataIso.split('-').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      const diaSemana = diasSemanaNomes[dataObj.getDay()];

      const wmoCode = d.weather_code ? d.weather_code[i] : 0;
      const wmoInfo = interpretarWMO(wmoCode);

      previsao5Dias.push({
        data: dataIso,
        dataFormatada: `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`,
        diaSemana,
        tempMaxima: d.temperature_2m_max ? d.temperature_2m_max[i] : null,
        tempMinima: d.temperature_2m_min ? d.temperature_2m_min[i] : null,
        sensacaoMaxima: d.apparent_temperature_max ? d.apparent_temperature_max[i] : null,
        sensacaoMinima: d.apparent_temperature_min ? d.apparent_temperature_min[i] : null,
        uvMaximo: d.uv_index_max ? d.uv_index_max[i] : null,
        uvClassificacao: d.uv_index_max ? classificarIndiceUV(d.uv_index_max[i]) : null,
        precipitacaoMm: d.precipitation_sum ? d.precipitation_sum[i] : 0,
        ventoMaximoKmH: d.wind_speed_10m_max ? d.wind_speed_10m_max[i] : null,
        codigoWMO: wmoCode,
        condicao: wmoInfo.descricao,
        icone: wmoInfo.icone
      });
    }

    const wmoAtual = interpretarWMO(cur.weather_code);
    const direcaoVento = grausParaCardeal(cur.wind_direction_10m);
    const uvAtualInfo = classificarIndiceUV(cur.uv_index);

    res.status(200).json({
      coordenadas: {
        latitude: dados.latitude,
        longitude: dados.longitude,
        elevacaoMetros: dados.elevation
      },
      fusoHorario: dados.timezone,
      condicoesAtuais: {
        temperatura: cur.temperature_2m,
        unidadeTemperatura: '°C',
        sensacaoTermica: cur.apparent_temperature,
        umidadeRelativa: cur.relative_humidity_2m,
        unidadeUmidade: '%',
        precipitacao: cur.precipitation,
        unidadePrecipitacao: 'mm',
        ventoVelocidade: cur.wind_speed_10m,
        unidadeVento: 'km/h',
        ventoDirecaoGraus: cur.wind_direction_10m,
        ventoDirecaoCardeal: direcaoVento.cardeal,
        ventoDirecaoRotulo: direcaoVento.rotulo,
        indiceUV: cur.uv_index,
        uvClassificacao: uvAtualInfo,
        nivelUV: uvAtualInfo,
        codigoWMO: cur.weather_code,
        condicao: wmoAtual.descricao,
        icone: wmoAtual.icone,
        categoriaClima: wmoAtual.categoria,
        isDia: cur.is_day === 1,
        horarioObservacao: cur.time,
        horarioMedicao: cur.time,
        dataFormatada: cur.time ? new Date(cur.time).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')
      },
      previsao5Dias,
      grafico: {
        rotulos: previsao5Dias.map(p => p.dataFormatada),
        diasSemana: previsao5Dias.map(p => p.diaSemana.split('-')[0]),
        maximas: previsao5Dias.map(p => p.tempMaxima),
        minimas: previsao5Dias.map(p => p.tempMinima)
      }
    });
  } catch (erro) {
    if (erro.name === 'TimeoutError' || erro.name === 'AbortError') {
      return res.status(504).json({
        erro: 'Tempo limite excedido ao consultar o serviço externo Open-Meteo Forecast.',
        detalhe: 'A API meteorológica demorou mais de 6 segundos para responder.'
      });
    }

    console.error('[servico-clima] Erro:', erro.message);
    res.status(502).json({
      erro: 'Serviço externo Open-Meteo Forecast indisponível.',
      detalhe: erro.message
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-clima] Ativo na porta ${PORT}`);
  });
}

module.exports = app;
