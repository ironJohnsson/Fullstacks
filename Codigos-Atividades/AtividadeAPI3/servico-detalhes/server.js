// Microsserviço de Detalhes, Estatísticas e Evolução de Pokémon (Porta 5052)
// Responsável pela ficha completa: medidas convertidas, 6 atributos base, espécies e cadeia evolutiva
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');
const { traduzirTipo } = require('../shared/pokemon-types');

const app = express();
const PORT = process.env.PORT_DETALHES || 5052;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-detalhes'));

// Cache em memória de fichas completas
const cacheDetalhes = {};
const cacheEvolucoes = {};

app.get('/status', (req, res) => {
  res.json({
    servico: 'servico-detalhes',
    versao: '1.0.0',
    descricao: 'Serviço de ficha técnica, estatísticas base, espécie e cadeia evolutiva via PokéAPI v2',
    status: 'online',
    pokemonsEmCache: Object.keys(cacheDetalhes).length
  });
});

app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Microsserviço de Detalhes · Porta ${PORT}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b1320; color: #f1f5f9; padding: 2.5rem; line-height: 1.6; }
          .card { max-width: 660px; margin: 0 auto; background: #132238; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .badge { display: inline-block; background: #16a34a; color: white; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; }
          h1 { margin-top: 0.75rem; font-size: 1.5rem; }
          p { color: #94a3b8; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 0.8rem; }
          a.endpoint { color: #38bdf8; text-decoration: none; font-family: monospace; background: rgba(56, 189, 248, 0.1); padding: 4px 8px; border-radius: 6px; }
          a.endpoint:hover { text-decoration: underline; background: rgba(56, 189, 248, 0.2); }
          .cta { display: block; margin-top: 1.5rem; text-align: center; background: #ec7457; color: white; padding: 12px; border-radius: 8px; font-weight: bold; text-decoration: none; }
          .cta:hover { background: #d95e41; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">ONLINE · PORTA ${PORT}</span>
          <h1>🔍 Microsserviço de Detalhes e Estatísticas</h1>
          <p>Responsável pela ficha detalhada do Pokémon, conversão de medidas (metros e kg), 6 atributos base com barras, dados de espécie e cadeia evolutiva.</p>
          
          <h3>Endpoints de API disponíveis para teste:</h3>
          <ul>
            <li>👉 <a class="endpoint" href="/status">/status</a> — Saúde e status do serviço</li>
            <li>👉 <a class="endpoint" href="/pokemon/pikachu">/pokemon/pikachu</a> — Ficha do Pikachu (por nome)</li>
            <li>👉 <a class="endpoint" href="/pokemon/25">/pokemon/25</a> — Ficha do Pikachu (por número)</li>
            <li>👉 <a class="endpoint" href="/pokemon/charizard">/pokemon/charizard</a> — Ficha do Charizard com evolução</li>
            <li>👉 <a class="endpoint" href="/pokemon/bulbasaur">/pokemon/bulbasaur</a> — Ficha do Bulbasaur</li>
          </ul>

          <a href="http://localhost:5050" class="cta">🌐 Abrir a Pokédex Explorer Completa (Porta 5050)</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      servico: 'servico-detalhes',
      porta: PORT,
      status: 'online',
      rotas: ['/status', '/pokemon/:idOuNome']
    });
  }
});

// Tradução amigável dos atributos base para exibição nas barras
const STATS_MAP = {
  hp: { nome: 'HP', cor: '#df2140', max: 255 },
  attack: { nome: 'Ataque', cor: '#ff994d', max: 190 },
  defense: { nome: 'Defesa', cor: '#eecd3d', max: 250 },
  'special-attack': { nome: 'Ataque Especial', cor: '#85ddff', max: 194 },
  'special-defense': { nome: 'Defesa Especial', cor: '#96da83', max: 250 },
  speed: { nome: 'Velocidade', cor: '#fb94a8', max: 200 }
};

// Helper para extrair a cadeia evolutiva a partir do objeto raiz da PokéAPI
async function extrairCadeiaEvolutiva(urlCadeia) {
  if (!urlCadeia) return [];
  if (cacheEvolucoes[urlCadeia]) return cacheEvolucoes[urlCadeia];

  try {
    const res = await fetch(urlCadeia, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];

    const dados = await res.json();
    const passos = [];

    function processarNo(no) {
      if (!no || !no.species) return;

      const urlParts = no.species.url.split('/').filter(Boolean);
      const id = parseInt(urlParts[urlParts.length - 1], 10);

      const detalhesEvolucao = no.evolution_details && no.evolution_details.length > 0 ? no.evolution_details[0] : null;
      let gatilho = '';
      if (detalhesEvolucao) {
        if (detalhesEvolucao.min_level) gatilho = `Nível ${detalhesEvolucao.min_level}`;
        else if (detalhesEvolucao.item) gatilho = detalhesEvolucao.item.name.replace('-', ' ');
        else if (detalhesEvolucao.trigger?.name === 'trade') gatilho = 'Troca';
        else if (detalhesEvolucao.trigger?.name) gatilho = detalhesEvolucao.trigger.name;
      }

      passos.push({
        id,
        nome: no.species.name,
        nomeFormatado: no.species.name.charAt(0).toUpperCase() + no.species.name.slice(1),
        imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        imagemPixel: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        gatilho
      });

      if (no.evolves_to && no.evolves_to.length > 0) {
        no.evolves_to.forEach(filho => processarNo(filho));
      }
    }

    processarNo(dados.chain);
    cacheEvolucoes[urlCadeia] = passos;
    return passos;
  } catch (e) {
    console.error('[servico-detalhes] Erro ao extrair cadeia evolutiva:', e.message);
    return [];
  }
}

// GET /pokemon/:idOuNome
app.get('/pokemon/:idOuNome', async (req, res) => {
  const { idOuNome } = req.params;

  if (!idOuNome || typeof idOuNome !== 'string' || idOuNome.trim() === '') {
    return res.status(400).json({
      erro: 'Informe o nome ou número de um Pokémon para consultar.',
      exemplo: '/pokemon/pikachu ou /pokemon/25'
    });
  }

  const termo = idOuNome.trim().toLowerCase();

  // Verifica cache
  if (cacheDetalhes[termo]) {
    return res.json(cacheDetalhes[termo]);
  }

  try {
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(termo)}`;
    const resposta = await fetch(urlPokemon, { signal: AbortSignal.timeout(7000) });

    if (resposta.status === 404) {
      return res.status(404).json({
        erro: `Nenhum Pokémon encontrado com o termo "${idOuNome}".`,
        termo: idOuNome
      });
    }

    if (!resposta.ok) {
      return res.status(502).json({
        erro: 'Falha ao consultar os dados do Pokémon na PokéAPI.',
        statusHttp: resposta.status
      });
    }

    const p = await resposta.json();

    // 1. Conversão de Altura e Peso (Atividade 9)
    const alturaMetros = p.height / 10;
    const pesoKg = p.weight / 10;

    // 2. Mapeamento dos 6 atributos base com totais e porcentagens (Atividade 10)
    let totalStats = 0;
    const estatisticas = p.stats.map(s => {
      const valor = s.base_stat;
      totalStats += valor;
      const info = STATS_MAP[s.stat.name] || { nome: s.stat.name, cor: '#888888', max: 200 };
      const porcentagem = Math.min(100, Math.round((valor / info.max) * 100));

      return {
        chave: s.stat.name,
        nome: info.nome,
        valor,
        maximoReferencia: info.max,
        porcentagem,
        cor: info.cor
      };
    });

    // 3. Tipos e Habilidades
    const tipos = p.types.map(t => ({
      tipo: t.type.name,
      ...traduzirTipo(t.type.name)
    }));

    const habilidades = p.abilities.map(a => ({
      nome: a.ability.name.replace('-', ' '),
      oculta: a.is_hidden,
      slot: a.slot
    }));

    // 4. Consulta opcional de Espécie para pegar descrição e cadeia evolutiva (Atividade 17)
    let especieInfo = {
      descricao: '',
      categoria: '',
      geracao: '',
      taxaCaptura: null,
      felicidadeBase: null,
      cadeiaEvolutiva: []
    };

    if (p.species && p.species.url) {
      try {
        const resEspecie = await fetch(p.species.url, { signal: AbortSignal.timeout(6000) });
        if (resEspecie.ok) {
          const esp = await resEspecie.json();

          // Descrição (preferência em PT, fallback em EN)
          const entradaPt = esp.flavor_text_entries?.find(e => e.language?.name === 'pt' || e.language?.name === 'pt-BR');
          const entradaEn = esp.flavor_text_entries?.find(e => e.language?.name === 'en');
          const textoDescricao = (entradaPt || entradaEn)?.flavor_text?.replace(/[\f\n\r]/g, ' ') || '';

          // Categoria (gênero)
          const generoPt = esp.genera?.find(g => g.language?.name === 'pt' || g.language?.name === 'pt-BR');
          const generoEn = esp.genera?.find(g => g.language?.name === 'en');
          const categoria = (generoPt || generoEn)?.genus || '';

          // Linha evolutiva
          const cadeiaEvolutiva = esp.evolution_chain?.url
            ? await extrairCadeiaEvolutiva(esp.evolution_chain.url)
            : [];

          especieInfo = {
            descricao: textoDescricao,
            categoria,
            geracao: esp.generation?.name ? esp.generation.name.toUpperCase().replace('-', ' ') : '',
            taxaCaptura: esp.capture_rate,
            felicidadeBase: esp.base_happiness,
            habitat: esp.habitat?.name || 'Não informado',
            cadeiaEvolutiva
          };
        }
      } catch (errEsp) {
        console.warn(`[servico-detalhes] Falha leve ao obter espécie de ${p.name}:`, errEsp.message);
      }
    }

    const fichaCompleta = {
      sucesso: true,
      id: p.id,
      numeroFormatado: `#${String(p.id).padStart(3, '0')}`,
      nome: p.name,
      nomeFormatado: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      imagens: {
        oficial: p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '',
        pixel: p.sprites?.front_default || '',
        shiny: p.sprites?.other?.['official-artwork']?.front_shiny || p.sprites?.front_shiny || '',
        pixelShiny: p.sprites?.front_shiny || ''
      },
      medidas: {
        alturaMetros,
        alturaFormatada: `${alturaMetros.toFixed(1)} m`,
        pesoKg,
        pesoFormatado: `${pesoKg.toFixed(1)} kg`
      },
      tipos,
      habilidades,
      estatisticas,
      totalEstatisticas: totalStats,
      experienciaBase: p.base_experience,
      especie: especieInfo
    };

    // Armazena no cache pelo nome e pelo id
    cacheDetalhes[termo] = fichaCompleta;
    cacheDetalhes[p.name.toLowerCase()] = fichaCompleta;
    cacheDetalhes[String(p.id)] = fichaCompleta;

    return res.json(fichaCompleta);

  } catch (erro) {
    if (erro.name === 'TimeoutError' || erro.name === 'AbortError') {
      return res.status(504).json({
        erro: 'Tempo limite excedido ao consultar a PokéAPI.',
        detalhes: 'O serviço externo não respondeu dentro do tempo limite.'
      });
    }

    console.error('[servico-detalhes] Erro:', erro.message);
    res.status(502).json({
      erro: 'Serviço externo PokéAPI indisponível no momento.',
      detalhes: erro.message
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-detalhes] Ativo na porta ${PORT}`);
  });
}

module.exports = app;
