// Servico de Clima (Porta 4005) - Atividade 9
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_CLIMA || 4005;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-clima'));

app.get('/status', (req, res) => {
  res.json({ servico: 'servico-clima', versao: '1.0.0', status: 'online' });
});

// Atividade 9: GET /clima?lat=...&lon=...
app.get('/clima', async (req, res) => {
  const { lat, lon } = req.query;

  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ erro: 'Parâmetros lat (latitude) e lon (longitude) são obrigatórios.' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(400).json({ erro: 'Latitude deve estar entre -90 e 90.' });
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ erro: 'Longitude deve estar entre -180 e 180.' });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!resposta.ok) throw new Error('Falha ao consultar Open-Meteo');

    const dados = await resposta.json();
    res.status(200).json({
      coordenadas: { latitude, longitude },
      temperaturaAtual: dados.current?.temperature_2m,
      unidadeTemperatura: dados.current_units?.temperature_2m || '°C',
      precipitacao: dados.current?.precipitation,
      unidadePrecipitacao: dados.current_units?.precipitation || 'mm',
      horario: dados.current?.time
    });
  } catch (erro) {
    res.status(502).json({ erro: 'Serviço externo Open-Meteo indisponível' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-clima] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
