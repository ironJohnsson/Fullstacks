// Servico de Pokémon (Porta 4006) - Atividade 10
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_POKEMON || 4006;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-pokemon'));

app.get('/status', (req, res) => {
  res.json({ servico: 'servico-pokemon', versao: '1.0.0', status: 'online' });
});

// Atividade 10: GET /pokemon/:id
app.get('/pokemon/:id', async (req, res) => {
  const identificador = String(req.params.id || '').toLowerCase().trim();

  if (!identificador) {
    return res.status(400).json({ erro: 'Informe um ID ou nome de pokémon válido.' });
  }

  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(identificador)}`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (resposta.status === 404) {
      return res.status(404).json({ erro: 'Pokémon não encontrado' });
    }

    if (!resposta.ok) throw new Error('Falha na PokéAPI');

    const dados = await resposta.json();
    res.status(200).json({
      id: dados.id,
      nome: dados.name,
      altura: dados.height,
      peso: dados.weight,
      tipos: dados.types.map(t => t.type.name),
      habilidades: dados.abilities.map(a => a.ability.name)
    });
  } catch (erro) {
    res.status(502).json({ erro: 'Serviço externo PokéAPI indisponível' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-pokemon] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
