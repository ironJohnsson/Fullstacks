// Microsserviço de Catálogo e Listagem de Pokémon (Porta 5051)
// Responsável por paginação (12 por página), filtros por tipo e cache em memória
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');
const { traduzirTipo, TIPOS_POKEMON } = require('../shared/pokemon-types');

const app = express();
const PORT = process.env.PORT_CATALOGO || 5051;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-catalogo'));

// Cache em memória para otimizar requisições e garantir estabilidade (Atividade 18 / Questões de discussão)
const cache = {
  tipos: {},           // tipo -> lista completa de Pokémon daquele tipo
  detalhesCards: {},   // idOuNome -> dados resumidos do card
  paginas: {}          // chave de paginação -> resultado
};

app.get('/status', (req, res) => {
  res.json({
    servico: 'servico-catalogo',
    versao: '1.0.0',
    descricao: 'Serviço de listagem, paginação (12 itens) e filtros por tipo via PokéAPI v2',
    status: 'online',
    cacheItens: Object.keys(cache.detalhesCards).length
  });
});

app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Microsserviço de Catálogo · Porta ${PORT}</title>
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
          <h1>📖 Microsserviço de Catálogo de Pokémon</h1>
          <p>Responsável pelo catálogo de Pokémon com paginação de 12 itens por página, filtros por tipo (Fogo, Água, Planta, etc.) e cache de resultados.</p>
          
          <h3>Endpoints de API disponíveis para teste:</h3>
          <ul>
            <li>👉 <a class="endpoint" href="/status">/status</a> — Saúde e status do serviço</li>
            <li>👉 <a class="endpoint" href="/catalogo?pagina=1&limite=12">/catalogo?pagina=1&limite=12</a> — Página 1 (Todos os tipos)</li>
            <li>👉 <a class="endpoint" href="/catalogo?pagina=1&limite=12&tipo=fire">/catalogo?pagina=1&limite=12&tipo=fire</a> — Filtro por Fogo</li>
            <li>👉 <a class="endpoint" href="/catalogo?pagina=1&limite=12&tipo=water">/catalogo?pagina=1&limite=12&tipo=water</a> — Filtro por Água</li>
            <li>👉 <a class="endpoint" href="/catalogo?pagina=1&limite=12&tipo=grass">/catalogo?pagina=1&limite=12&tipo=grass</a> — Filtro por Planta</li>
          </ul>

          <a href="http://localhost:5050" class="cta">🌐 Abrir a Pokédex Explorer Completa (Porta 5050)</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      servico: 'servico-catalogo',
      porta: PORT,
      status: 'online',
      rotas: ['/status', '/catalogo?pagina=1&limite=12&tipo=todos']
    });
  }
});

// Helper para obter dados resumidos de um Pokémon (para os cards do catálogo)
async function obterCardPokemon(nomeOuId) {
  const chave = String(nomeOuId).toLowerCase();
  if (cache.detalhesCards[chave]) {
    return cache.detalhesCards[chave];
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${chave}`, {
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) return null;
    const p = await res.json();

    const card = {
      id: p.id,
      numeroFormatado: `#${String(p.id).padStart(3, '0')}`,
      nome: p.name,
      nomeFormatado: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      imagem: p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '',
      imagemPixel: p.sprites?.front_default || '',
      tipos: p.types.map(t => ({
        tipo: t.type.name,
        ...traduzirTipo(t.type.name)
      })),
      alturaM: p.height / 10,
      pesoKg: p.weight / 10,
      baseExp: p.base_experience
    };

    cache.detalhesCards[chave] = card;
    cache.detalhesCards[p.id] = card;
    return card;
  } catch (erro) {
    console.error(`[servico-catalogo] Erro ao carregar card de "${nomeOuId}":`, erro.message);
    return null;
  }
}

// GET /catalogo?pagina=1&limite=12&tipo=todos
app.get('/catalogo', async (req, res) => {
  const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
  const limite = Math.min(50, Math.max(1, parseInt(req.query.limite, 10) || 12));
  const tipoFiltro = String(req.query.tipo || 'todos').toLowerCase().trim();

  const cacheKey = `${pagina}_${limite}_${tipoFiltro}`;
  if (cache.paginas[cacheKey]) {
    return res.json(cache.paginas[cacheKey]);
  }

  try {
    let listaTotalNomes = [];
    let totalItens = 0;

    // Se o filtro for "todos", consumimos /pokemon com limit e offset diretamente
    if (tipoFiltro === 'todos' || tipoFiltro === '') {
      const offset = (pagina - 1) * limite;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offset}`;

      const resposta = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (!resposta.ok) {
        return res.status(502).json({ erro: 'Falha ao consultar a lista de Pokémon na PokéAPI.' });
      }

      const dados = await resposta.json();
      totalItens = dados.count;

      const cards = await Promise.all(
        dados.results.map(item => obterCardPokemon(item.name))
      );

      const resultado = {
        sucesso: true,
        pagina,
        limite,
        totalItens,
        totalPaginas: Math.ceil(totalItens / limite),
        tipoFiltro: 'todos',
        resultados: cards.filter(Boolean)
      };

      cache.paginas[cacheKey] = resultado;
      return res.json(resultado);
    }

    // Se o filtro for por tipo específico (fogo, água, planta...)
    if (!cache.tipos[tipoFiltro]) {
      const urlTipo = `https://pokeapi.co/api/v2/type/${tipoFiltro}`;
      const resTipo = await fetch(urlTipo, { signal: AbortSignal.timeout(7000) });

      if (!resTipo.ok) {
        return res.status(404).json({
          erro: `Tipo "${tipoFiltro}" não encontrado na PokéAPI.`,
          tiposValidos: Object.keys(TIPOS_POKEMON)
        });
      }

      const dadosTipo = await resTipo.json();
      cache.tipos[tipoFiltro] = dadosTipo.pokemon.map(p => p.pokemon.name);
    }

    listaTotalNomes = cache.tipos[tipoFiltro];
    totalItens = listaTotalNomes.length;
    const offset = (pagina - 1) * limite;
    const paginaNomes = listaTotalNomes.slice(offset, offset + limite);

    const cards = await Promise.all(
      paginaNomes.map(nome => obterCardPokemon(nome))
    );

    const resultado = {
      sucesso: true,
      pagina,
      limite,
      totalItens,
      totalPaginas: Math.ceil(totalItens / limite),
      tipoFiltro,
      tipoInfo: traduzirTipo(tipoFiltro),
      resultados: cards.filter(Boolean)
    };

    cache.paginas[cacheKey] = resultado;
    return res.json(resultado);

  } catch (erro) {
    if (erro.name === 'TimeoutError' || erro.name === 'AbortError') {
      return res.status(504).json({
        erro: 'Tempo limite excedido ao consultar a PokéAPI.',
        detalhes: 'O serviço externo não respondeu a tempo.'
      });
    }

    console.error('[servico-catalogo] Erro:', erro.message);
    res.status(502).json({
      erro: 'Serviço externo PokéAPI indisponível ou inacessível.',
      detalhes: erro.message
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-catalogo] Ativo na porta ${PORT}`);
  });
}

module.exports = app;
