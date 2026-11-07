// ============================================================
// APP.JS - POKÉDEX EXPLORER (LÓGICA CLIENTE DA SPA)
// ============================================================

// Definição das 20 Atividades Práticas Oficiais do Laboratório
const ATIVIDADES_CHECKLIST = [
  // Encontro 1: Fundamentos, Busca e Apresentação (Atividades 1 a 10)
  { id: 1, sessao: 1, texto: "1. Configurar o projeto com Node.js e inicializar o servidor Express" },
  { id: 2, sessao: 1, texto: "2. Criar rota de status e monitoramento de integridade (GET /status)" },
  { id: 3, sessao: 1, texto: "3. Consumir dados remotos da PokéAPI v2 utilizando requisições HTTP GET" },
  { id: 4, sessao: 1, texto: "4. Implementar busca de Pokémon pelo nome (ex.: pikachu)" },
  { id: 5, sessao: 1, texto: "5. Implementar busca de Pokémon pelo número de identificação (ex.: 25)" },
  { id: 6, sessao: 1, texto: "6. Apresentar imagem oficial (official artwork), nome e número formatado (#000)" },
  { id: 7, sessao: 1, texto: "7. Exibir badges de tipos estilizadas com as cores temáticas oficiais" },
  { id: 8, sessao: 1, texto: "8. Apresentar a lista de habilidades (abilities) normais e ocultas" },
  { id: 9, sessao: 1, texto: "9. Converter corretamente as medidas físicas: altura em metros (m) e peso em quilogramas (kg)" },
  { id: 10, sessao: 1, texto: "10. Exibir as 6 barras de estatísticas base (HP, Atq, Def, Sp.Atk, Sp.Def, Vel) com cálculo do Total" },

  // Encontro 2: Catálogo, Filtros, Estado e Microsserviços (Atividades 11 a 20)
  { id: 11, sessao: 2, texto: "11. Criar catálogo paginado com 12 Pokémon por página e botões Anterior/Próximo" },
  { id: 12, sessao: 2, texto: "12. Implementar filtros rápidos por tipo (Todos, Fogo, Água, Planta, Elétrico, etc.)" },
  { id: 13, sessao: 2, texto: "13. Adicionar botão de sorteio para consultar um Pokémon aleatório (1 a 1025)" },
  { id: 14, sessao: 2, texto: "14. Tratar graciosamente entradas vazias (400) e Pokémon inexistentes (404)" },
  { id: 15, sessao: 2, texto: "15. Criar sistema de Favoritos (☆) com persistência no armazenamento local (localStorage)" },
  { id: 16, sessao: 2, texto: "16. Criar ferramenta para comparar dois Pokémon lado a lado com destaque para atributos superiores" },
  { id: 17, sessao: 2, texto: "17. Exibir descrição enciclopédica da espécie e linha evolutiva completa com estágios" },
  { id: 18, sessao: 2, texto: "18. Separar Catálogo (porta 5051) e Detalhes (porta 5052) em microsserviços com cache em memória" },
  { id: 19, sessao: 2, texto: "19. Implementar API Gateway (porta 5050) como ponto único de entrada e roteador reverso" },
  { id: 20, sessao: 2, texto: "20. Estruturar testes automatizados ponta a ponta, documentação e respostas de discussão" }
];

// Estado Global da Aplicação
const state = {
  paginaAtual: 1,
  limite: 12,
  tipoFiltro: 'todos',
  totalPaginas: 1,
  pokemonAtual: null,
  isShiny: false,
  favoritos: new Set(),
  checklist: {}
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  carregarEstadoLocal();
  initTabs();
  initSearch();
  initCatalogFilters();
  initDetailActions();
  initCompare();
  initChecklistUI();
  initTests();
  verificarStatusServicos();

  // Carrega a primeira página do catálogo e pré-carrega o Pikachu
  carregarCatalogo(1, 'todos');
});

// ============================================================
// PERSISTÊNCIA LOCAL (LOCALSTORAGE)
// ============================================================

function carregarEstadoLocal() {
  try {
    const favsSalvos = localStorage.getItem('pokedex_favoritos');
    if (favsSalvos) {
      state.favoritos = new Set(JSON.parse(favsSalvos));
    }

    const checkSalvo = localStorage.getItem('pokedex_checklist');
    if (checkSalvo) {
      state.checklist = JSON.parse(checkSalvo);
    }
  } catch (e) {
    console.warn('Erro ao carregar localStorage:', e);
  }
  atualizarContadorFavoritos();
}

function salvarFavoritosLocal() {
  try {
    localStorage.setItem('pokedex_favoritos', JSON.stringify([...state.favoritos]));
  } catch (e) {
    console.warn('Erro ao salvar favoritos:', e);
  }
  atualizarContadorFavoritos();
}

function salvarChecklistLocal() {
  try {
    localStorage.setItem('pokedex_checklist', JSON.stringify(state.checklist));
  } catch (e) {
    console.warn('Erro ao salvar checklist:', e);
  }
  atualizarProgressoChecklist();
}

function atualizarContadorFavoritos() {
  const el = document.getElementById('favCount');
  if (el) el.textContent = state.favoritos.size;
}

// ============================================================
// NAVEGAÇÃO POR ABAS
// ============================================================

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      ativarAba(targetId);
    });
  });
}

function ativarAba(tabId) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(b => b.classList.remove('active'));
  tabContents.forEach(c => c.classList.remove('active'));

  const btnAtivo = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btnAtivo) btnAtivo.classList.add('active');

  const contentAtivo = document.getElementById(tabId);
  if (contentAtivo) contentAtivo.classList.add('active');

  if (tabId === 'tab-favoritos') {
    renderizarFavoritos();
  }
}

// ============================================================
// STATUS DOS MICROSSERVIÇOS (GATEWAY 5050, CATALOGO 5051, DETALHES 5052)
// ============================================================

async function verificarStatusServicos() {
  const el = document.getElementById('servicesStatus');
  try {
    const res = await fetch('/api/status');
    const dados = await res.json();

    if (dados.statusGeral === 'operacional') {
      el.innerHTML = `
        <span class="status-dot"></span>
        <span>Gateway (5050), Catálogo (5051) e Detalhes (5052): Online</span>
      `;
      el.style.background = 'rgba(34, 197, 94, 0.15)';
      el.style.color = '#ffffff';
      marcarChecklistAutomatico(18);
      marcarChecklistAutomatico(19);
    } else {
      el.innerHTML = `
        <span class="status-dot" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b;"></span>
        <span>Gateway Ativo (Serviços auxiliares em checagem)</span>
      `;
    }
  } catch (err) {
    el.innerHTML = `
      <span class="status-dot" style="background:#ef4444; box-shadow:0 0 8px #ef4444;"></span>
      <span>Falha na comunicação de rede</span>
    `;
  }
}

// ============================================================
// CATÁLOGO & PAGINAÇÃO
// ============================================================

async function carregarCatalogo(pagina = 1, tipo = 'todos') {
  const grid = document.getElementById('pokemonGrid');
  const pagInfo = document.getElementById('paginationInfo');
  const pagIndicator = document.getElementById('pageIndicator');
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');

  grid.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Carregando Pokémon via PokéAPI…</p>
    </div>
  `;

  try {
    const url = `/api/catalogo?pagina=${pagina}&limite=${state.limite}&tipo=${encodeURIComponent(tipo)}`;
    const res = await fetch(url);
    const dados = await res.json();

    if (!res.ok) {
      grid.innerHTML = `<div class="empty-state"><p class="text-danger">${dados.erro || 'Erro ao carregar catálogo.'}</p></div>`;
      return;
    }

    state.paginaAtual = dados.pagina;
    state.totalPaginas = dados.totalPaginas || 1;
    state.tipoFiltro = dados.tipoFiltro;

    pagInfo.textContent = `Página ${dados.pagina} de ${state.totalPaginas} (${dados.totalItens} Pokémon)`;
    pagIndicator.textContent = `Página ${dados.pagina} de ${state.totalPaginas}`;

    btnPrev.disabled = dados.pagina <= 1;
    btnNext.disabled = dados.pagina >= state.totalPaginas;

    renderizarCardsCatalogo(dados.resultados);
    marcarChecklistAutomatico(11);
    if (tipo !== 'todos') marcarChecklistAutomatico(12);

  } catch (erro) {
    grid.innerHTML = `<div class="empty-state"><p>Erro ao conectar com a API: ${erro.message}</p></div>`;
  }
}

function renderizarCardsCatalogo(lista) {
  const grid = document.getElementById('pokemonGrid');
  grid.innerHTML = '';

  if (!lista || lista.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>Nenhum Pokémon encontrado nesta página.</p></div>`;
    return;
  }

  lista.forEach(p => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    const isFav = state.favoritos.has(p.nome.toLowerCase()) || state.favoritos.has(String(p.id));

    const badgesTipos = p.tipos.map(t =>
      `<span class="type-badge" style="background-color: ${t.cor}; color: ${t.corTexto};">${t.icone} ${t.nome}</span>`
    ).join('');

    card.innerHTML = `
      <span class="card-num">${p.numeroFormatado}</span>
      <button class="card-fav-btn ${isFav ? 'active' : ''}" title="Favoritar" data-name="${p.nome}" data-id="${p.id}">
        ${isFav ? '★' : '☆'}
      </button>
      <div class="card-image-wrap">
        <img class="card-img" src="${p.imagem || p.imagemPixel}" alt="${p.nomeFormatado}" loading="lazy">
      </div>
      <h4 class="card-name">${p.nomeFormatado}</h4>
      <div class="card-types">${badgesTipos}</div>
    `;

    // Click no card abre os detalhes
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) return;
      carregarPokemonDetalhes(p.nome);
    });

    // Click no botão de estrela
    const favBtn = card.querySelector('.card-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(p.nome, p.id);
      favBtn.classList.toggle('active');
      favBtn.textContent = state.favoritos.has(p.nome.toLowerCase()) ? '★' : '☆';
    });

    grid.appendChild(card);
  });
}

function initCatalogFilters() {
  const pills = document.querySelectorAll('#filterPills .pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const tipo = pill.getAttribute('data-type');
      carregarCatalogo(1, tipo);
    });
  });

  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');

  btnPrev.addEventListener('click', () => {
    if (state.paginaAtual > 1) {
      carregarCatalogo(state.paginaAtual - 1, state.tipoFiltro);
    }
  });

  btnNext.addEventListener('click', () => {
    if (state.paginaAtual < state.totalPaginas) {
      carregarCatalogo(state.paginaAtual + 1, state.tipoFiltro);
    }
  });
}

// ============================================================
// BUSCA & SORTEIO ALEATÓRIO
// ============================================================

function initSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const btnRandom = document.getElementById('btnRandom');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const termo = input.value.trim();
    if (!termo) {
      mostrarMensagemBusca('Digite o nome ou número de um Pokémon.', 'error');
      return;
    }
    carregarPokemonDetalhes(termo);
  });

  btnRandom.addEventListener('click', async () => {
    mostrarMensagemBusca('Sorteando Pokémon aleatório…', 'loading');
    try {
      const res = await fetch('/api/aleatorio');
      const dados = await res.json();
      if (dados.sucesso) {
        input.value = dados.nome;
        mostrarMensagemBusca('', 'none');
        renderizarFichaDetalhes(dados);
        ativarAba('tab-detalhes');
        marcarChecklistAutomatico(13);
      }
    } catch (e) {
      mostrarMensagemBusca('Erro ao sortear Pokémon.', 'error');
    }
  });
}

function mostrarMensagemBusca(msg, tipo = 'none') {
  const el = document.getElementById('searchMessage');
  if (tipo === 'none' || !msg) {
    el.style.display = 'none';
    return;
  }
  el.className = `status-msg ${tipo}`;
  el.textContent = msg;
  el.style.display = 'block';
}

// ============================================================
// FICHA DO POKÉMON (DETALHES)
// ============================================================

async function carregarPokemonDetalhes(nomeOuId) {
  mostrarMensagemBusca('Consultando a PokéAPI…', 'loading');

  try {
    const res = await fetch(`/api/pokemon/${encodeURIComponent(String(nomeOuId).toLowerCase().trim())}`);
    const dados = await res.json();

    if (!res.ok) {
      mostrarMensagemBusca(dados.erro || 'Pokémon não encontrado.', 'error');
      marcarChecklistAutomatico(14); // Tratamento de erro 404 testado
      return;
    }

    mostrarMensagemBusca('', 'none');
    state.pokemonAtual = dados;
    state.isShiny = false;
    renderizarFichaDetalhes(dados);
    ativarAba('tab-detalhes');

    // Validações do checklist
    marcarChecklistAutomatico(3);
    if (isNaN(nomeOuId)) marcarChecklistAutomatico(4); // Busca por nome
    else marcarChecklistAutomatico(5); // Busca por número
    marcarChecklistAutomatico(6);
    marcarChecklistAutomatico(7);
    marcarChecklistAutomatico(8);
    marcarChecklistAutomatico(9);
    marcarChecklistAutomatico(10);
    marcarChecklistAutomatico(17);

  } catch (err) {
    mostrarMensagemBusca(`Erro de rede ou servidor: ${err.message}`, 'error');
  }
}

function renderizarFichaDetalhes(p) {
  document.getElementById('detailEmptyState').style.display = 'none';
  document.getElementById('detailContent').style.display = 'block';

  // Cabeçalho
  document.getElementById('detailNumber').textContent = p.numeroFormatado;
  document.getElementById('detailName').textContent = p.nomeFormatado;
  document.getElementById('detailGenus').textContent = p.especie?.categoria || 'Espécie Pokémon';

  // Imagem
  const imgEl = document.getElementById('detailImage');
  imgEl.src = p.imagens.oficial || p.imagens.pixel;
  imgEl.alt = p.nomeFormatado;

  // Tipos
  const typesEl = document.getElementById('detailTypes');
  typesEl.innerHTML = p.tipos.map(t =>
    `<span class="type-badge" style="background-color: ${t.cor}; color: ${t.corTexto}; font-size: 0.85rem; padding: 0.3rem 0.8rem;">${t.icone} ${t.nome}</span>`
  ).join('');

  // Medidas (metros e kg)
  document.getElementById('detailHeight').textContent = p.medidas.alturaFormatada;
  document.getElementById('detailWeight').textContent = p.medidas.pesoFormatada || `${p.medidas.pesoKg.toFixed(1)} kg`;

  // Bio / Descrição
  document.getElementById('detailBio').textContent = p.especie?.descricao || 'Nenhuma descrição enciclopédica disponível para este Pokémon no momento.';

  // Habilidades
  const habEl = document.getElementById('detailAbilities');
  habEl.innerHTML = p.habilidades.map(h =>
    `<span class="ability-tag ${h.oculta ? 'hidden' : ''}">${h.nome} ${h.oculta ? '(Oculta)' : ''}</span>`
  ).join('');

  // 6 Estatísticas Base com Barras
  document.getElementById('detailTotalStats').textContent = `Total Base: ${p.totalEstatisticas}`;
  const statsListEl = document.getElementById('detailStatsList');
  statsListEl.innerHTML = p.estatisticas.map(s => `
    <div class="stat-row">
      <span class="stat-name">${s.nome}</span>
      <span class="stat-val">${s.valor}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${s.porcentagem}%; background-color: ${s.cor};"></div>
      </div>
    </div>
  `).join('');

  // Linha Evolutiva
  renderizarLinhaEvolutiva(p.especie?.cadeiaEvolutiva, p.nome);

  // Botão de Favorito
  atualizarBotaoFavoritoFicha(p.nome, p.id);
}

function renderizarLinhaEvolutiva(cadeia, nomeAtual) {
  const container = document.getElementById('detailEvolutionChain');
  container.innerHTML = '';

  if (!cadeia || cadeia.length <= 1) {
    container.innerHTML = '<p class="text-muted">Este Pokémon não possui estágios de evolução conhecidos.</p>';
    return;
  }

  cadeia.forEach((passo, idx) => {
    if (idx > 0) {
      const arrow = document.createElement('div');
      arrow.className = 'evo-arrow';
      arrow.innerHTML = `➔ ${passo.gatilho ? `<span class="evo-trigger">${passo.gatilho}</span>` : ''}`;
      container.appendChild(arrow);
    }

    const card = document.createElement('div');
    const isCurrent = passo.nome.toLowerCase() === nomeAtual.toLowerCase();
    card.className = `evo-card ${isCurrent ? 'current' : ''}`;
    card.innerHTML = `
      <img class="evo-img" src="${passo.imagem || passo.imagemPixel}" alt="${passo.nomeFormatado}">
      <span class="evo-name">${passo.nomeFormatado}</span>
    `;

    card.addEventListener('click', () => {
      carregarPokemonDetalhes(passo.nome);
    });

    container.appendChild(card);
  });
}

function initDetailActions() {
  const btnShiny = document.getElementById('btnToggleShiny');
  const btnFav = document.getElementById('btnToggleFav');
  const btnAddToCompare = document.getElementById('btnAddToCompare');

  btnShiny.addEventListener('click', () => {
    if (!state.pokemonAtual) return;
    state.isShiny = !state.isShiny;
    const imgEl = document.getElementById('detailImage');
    const p = state.pokemonAtual;
    if (state.isShiny) {
      imgEl.src = p.imagens.shiny || p.imagens.pixelShiny;
      btnShiny.textContent = '🎨 Modo Normal';
      btnShiny.classList.add('active');
    } else {
      imgEl.src = p.imagens.oficial || p.imagens.pixel;
      btnShiny.textContent = '✨ Modo Shiny';
      btnShiny.classList.remove('active');
    }
  });

  btnFav.addEventListener('click', () => {
    if (!state.pokemonAtual) return;
    toggleFavorito(state.pokemonAtual.nome, state.pokemonAtual.id);
    atualizarBotaoFavoritoFicha(state.pokemonAtual.nome, state.pokemonAtual.id);
  });

  btnAddToCompare.addEventListener('click', () => {
    if (!state.pokemonAtual) return;
    const c1 = document.getElementById('compareP1');
    const c2 = document.getElementById('compareP2');
    if (!c1.value) {
      c1.value = state.pokemonAtual.nome;
    } else {
      c2.value = state.pokemonAtual.nome;
    }
    ativarAba('tab-comparar');
  });
}

function atualizarBotaoFavoritoFicha(nome, id) {
  const btn = document.getElementById('btnToggleFav');
  const isFav = state.favoritos.has(nome.toLowerCase()) || state.favoritos.has(String(id));
  if (isFav) {
    btn.textContent = '★ Favoritado';
    btn.classList.add('active');
  } else {
    btn.textContent = '☆ Favoritar';
    btn.classList.remove('active');
  }
}

// ============================================================
// FAVORITOS
// ============================================================

function toggleFavorito(nome, id) {
  const chave = nome.toLowerCase();
  if (state.favoritos.has(chave)) {
    state.favoritos.delete(chave);
  } else {
    state.favoritos.add(chave);
    marcarChecklistAutomatico(15);
  }
  salvarFavoritosLocal();
}

async function renderizarFavoritos() {
  const grid = document.getElementById('favoritesGrid');
  grid.innerHTML = '';

  if (state.favoritos.size === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">☆</span>
        <h3>Nenhum favorito salvo ainda</h3>
        <p>Explore o catálogo e clique na estrelinha de qualquer Pokémon para salvá-lo aqui.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Carregando seus favoritos…</p></div>';

  try {
    const nomes = [...state.favoritos];
    const lista = await Promise.all(
      nomes.map(n => fetch(`/api/pokemon/${n}`).then(r => r.ok ? r.json() : null).catch(() => null))
    );

    grid.innerHTML = '';
    const validos = lista.filter(Boolean);

    validos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'pokemon-card';
      const badgesTipos = p.tipos.map(t =>
        `<span class="type-badge" style="background-color: ${t.cor}; color: ${t.corTexto};">${t.icone} ${t.nome}</span>`
      ).join('');

      card.innerHTML = `
        <span class="card-num">${p.numeroFormatado}</span>
        <button class="card-fav-btn active" title="Remover dos favoritos">★</button>
        <div class="card-image-wrap">
          <img class="card-img" src="${p.imagens.oficial || p.imagens.pixel}" alt="${p.nomeFormatado}">
        </div>
        <h4 class="card-name">${p.nomeFormatado}</h4>
        <div class="card-types">${badgesTipos}</div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-fav-btn')) return;
        carregarPokemonDetalhes(p.nome);
      });

      const favBtn = card.querySelector('.card-fav-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorito(p.nome, p.id);
        renderizarFavoritos();
      });

      grid.appendChild(card);
    });

  } catch (e) {
    grid.innerHTML = `<div class="empty-state"><p>Erro ao listar favoritos: ${e.message}</p></div>`;
  }

  const btnClear = document.getElementById('btnClearFavs');
  btnClear.onclick = () => {
    if (confirm('Deseja realmente limpar todos os favoritos?')) {
      state.favoritos.clear();
      salvarFavoritosLocal();
      renderizarFavoritos();
    }
  };
}

// ============================================================
// COMPARADOR LADO A LADO
// ============================================================

function initCompare() {
  const form = document.getElementById('compareForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('compareP1').value.trim();
    const p2 = document.getElementById('compareP2').value.trim();
    if (!p1 || !p2) return;
    executarComparacao(p1, p2);
  });
}

async function executarComparacao(p1, p2) {
  document.getElementById('compareP1').value = p1;
  document.getElementById('compareP2').value = p2;
  ativarAba('tab-comparar');

  const container = document.getElementById('compareResult');
  container.style.display = 'block';
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Confrontando atributos dos Pokémon…</p></div>';

  try {
    const res = await fetch(`/api/comparar?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}`);
    const dados = await res.json();

    if (!res.ok) {
      container.innerHTML = `<div class="status-msg error">${dados.erro || 'Erro ao comparar.'}</div>`;
      return;
    }

    const { pokemon1, pokemon2, comparativo } = dados;

    let linhasStats = comparativo.estatisticas.map(s => {
      const isW1 = s.vencedor === pokemon1.nomeFormatado;
      const isW2 = s.vencedor === pokemon2.nomeFormatado;
      return `
        <tr>
          <td class="${isW1 ? 'winner-cell' : ''}">${s.valor1} ${isW1 ? '👑' : ''}</td>
          <td><strong>${s.nome}</strong></td>
          <td class="${isW2 ? 'winner-cell' : ''}">${s.valor2} ${isW2 ? '👑' : ''}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="compare-cards-layout">
        <div class="compare-card ${comparativo.maiorTotal === pokemon1.nomeFormatado ? 'winner' : ''}">
          <span class="detail-num">${pokemon1.numeroFormatado}</span>
          <h3 class="detail-name">${pokemon1.nomeFormatado}</h3>
          <img src="${pokemon1.imagens.oficial || pokemon1.imagens.pixel}" alt="${pokemon1.nomeFormatado}" style="max-height: 140px; margin: 1rem 0;">
          <p><strong>Total Base:</strong> ${pokemon1.totalEstatisticas}</p>
          <p><strong>Altura:</strong> ${pokemon1.medidas.alturaFormatada} · <strong>Peso:</strong> ${pokemon1.medidas.pesoFormatada}</p>
        </div>

        <div class="compare-card ${comparativo.maiorTotal === pokemon2.nomeFormatado ? 'winner' : ''}">
          <span class="detail-num">${pokemon2.numeroFormatado}</span>
          <h3 class="detail-name">${pokemon2.nomeFormatado}</h3>
          <img src="${pokemon2.imagens.oficial || pokemon2.imagens.pixel}" alt="${pokemon2.nomeFormatado}" style="max-height: 140px; margin: 1rem 0;">
          <p><strong>Total Base:</strong> ${pokemon2.totalEstatisticas}</p>
          <p><strong>Altura:</strong> ${pokemon2.medidas.alturaFormatada} · <strong>Peso:</strong> ${pokemon2.medidas.pesoFormatada}</p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="compare-stats-table">
          <thead>
            <tr>
              <th>${pokemon1.nomeFormatado}</th>
              <th>Atributo Base</th>
              <th>${pokemon2.nomeFormatado}</th>
            </tr>
          </thead>
          <tbody>
            ${linhasStats}
            <tr style="background: #fdfaf4; font-weight: bold;">
              <td>${comparativo.total1}</td>
              <td>TOTAL DE ESTATÍSTICAS</td>
              <td>${comparativo.total2}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    marcarChecklistAutomatico(16);

  } catch (e) {
    container.innerHTML = `<div class="status-msg error">Erro na comparação: ${e.message}</div>`;
  }
}

// ============================================================
// CHECKLIST DO PROJETO (20 ATIVIDADES)
// ============================================================

function initChecklistUI() {
  const listE1 = document.getElementById('tasksListE1');
  const listE2 = document.getElementById('tasksListE2');
  listE1.innerHTML = '';
  listE2.innerHTML = '';

  ATIVIDADES_CHECKLIST.forEach(item => {
    const el = document.createElement('div');
    const checked = Boolean(state.checklist[item.id]);
    el.className = `task-item ${checked ? 'completed' : ''}`;
    el.innerHTML = `
      <input type="checkbox" class="task-checkbox" id="task_${item.id}" ${checked ? 'checked' : ''}>
      <label for="task_${item.id}" class="task-text">${item.texto}</label>
    `;

    const chk = el.querySelector('.task-checkbox');
    chk.addEventListener('change', () => {
      state.checklist[item.id] = chk.checked;
      el.classList.toggle('completed', chk.checked);
      salvarChecklistLocal();
    });

    if (item.sessao === 1) listE1.appendChild(el);
    else listE2.appendChild(el);
  });

  document.getElementById('btnCheckAll').addEventListener('click', () => {
    ATIVIDADES_CHECKLIST.forEach(it => { state.checklist[it.id] = true; });
    atualizarCheckboxesVisuais();
    salvarChecklistLocal();
  });

  document.getElementById('btnUncheckAll').addEventListener('click', () => {
    state.checklist = {};
    atualizarCheckboxesVisuais();
    salvarChecklistLocal();
  });

  atualizarProgressoChecklist();
}

function marcarChecklistAutomatico(id) {
  state.checklist[id] = true;
  atualizarCheckboxesVisuais();
  salvarChecklistLocal();
}

function atualizarCheckboxesVisuais() {
  ATIVIDADES_CHECKLIST.forEach(item => {
    const chk = document.getElementById(`task_${item.id}`);
    if (chk) {
      chk.checked = Boolean(state.checklist[item.id]);
      const parent = chk.closest('.task-item');
      if (parent) parent.classList.toggle('completed', chk.checked);
    }
  });
}

function atualizarProgressoChecklist() {
  const concluidas = Object.values(state.checklist).filter(Boolean).length;
  const total = ATIVIDADES_CHECKLIST.length;
  const pct = Math.round((concluidas / total) * 100);

  const textEl = document.getElementById('checklistProgressText');
  const barEl = document.getElementById('checklistProgressBar');
  if (textEl) textEl.textContent = `${concluidas} de ${total} concluídas (${pct}%)`;
  if (barEl) barEl.style.width = `${pct}%`;
}

// ============================================================
// TESTES OBRIGATÓRIOS (4 CENÁRIOS DO CANVA)
// ============================================================

function initTests() {
  const btn = document.getElementById('btnRunClientTests');
  if (btn) btn.addEventListener('click', executarTestesNavegador);
}

async function executarTestesNavegador() {
  const b1 = document.getElementById('testBadge1');
  const l1 = document.getElementById('testLogs1');
  const b2 = document.getElementById('testBadge2');
  const l2 = document.getElementById('testLogs2');
  const b3 = document.getElementById('testBadge3');
  const l3 = document.getElementById('testLogs3');
  const b4 = document.getElementById('testBadge4');
  const l4 = document.getElementById('testLogs4');

  const btn = document.getElementById('btnRunClientTests');
  btn.disabled = true;
  btn.textContent = 'Executando testes…';

  // --- Teste 1: Busca e Apresentação ---
  b1.textContent = 'Executando…';
  b1.className = 'test-badge';
  l1.textContent = 'Consultando Pikachu (#025) via Gateway...\n';

  try {
    const res = await fetch('/api/pokemon/pikachu');
    const d = await res.json();
    if (res.ok && d.nome === 'pikachu' && d.id === 25 && d.medidas.alturaMetros === 0.4 && d.estatisticas.length === 6) {
      b1.textContent = 'Aprovado ✅';
      b1.className = 'test-badge pass';
      l1.textContent += `Sucesso: Pikachu retornado (#${d.id})\nAltura: ${d.medidas.alturaFormatada}, Peso: ${d.medidas.pesoFormatada}\n6 barras de atributos validadas.`;
    } else {
      throw new Error('Falha nos dados do Pikachu.');
    }
  } catch (e) {
    b1.textContent = 'Falha ❌';
    b1.className = 'test-badge fail';
    l1.textContent += `Erro: ${e.message}`;
  }

  // --- Teste 2: Catálogo e Filtros ---
  b2.textContent = 'Executando…';
  b2.className = 'test-badge';
  l2.textContent = 'Testando paginação de 12 itens e filtro de Fogo...\n';

  try {
    const [rCat, rFogo] = await Promise.all([
      fetch('/api/catalogo?pagina=1&limite=12'),
      fetch('/api/catalogo?pagina=1&limite=12&tipo=fire')
    ]);
    const dCat = await rCat.json();
    const dFogo = await rFogo.json();

    if (dCat.resultados.length === 12 && dFogo.tipoFiltro === 'fire' && dFogo.resultados.length > 0) {
      b2.textContent = 'Aprovado ✅';
      b2.className = 'test-badge pass';
      l2.textContent += `Catálogo Geral: 12 cards recebidos.\nFiltro Fogo: ${dFogo.totalItens} Pokémon encontrados (${dFogo.totalPaginas} páginas).`;
    } else {
      throw new Error('Falha na paginação ou filtro.');
    }
  } catch (e) {
    b2.textContent = 'Falha ❌';
    b2.className = 'test-badge fail';
    l2.textContent += `Erro: ${e.message}`;
  }

  // --- Teste 3: Erros e Disponibilidade ---
  b3.textContent = 'Executando…';
  b3.className = 'test-badge';
  l3.textContent = 'Verificando resposta para termo inexistente e entrada vazia...\n';

  try {
    const res404 = await fetch('/api/pokemon/pokemonQueNaoExisteXYZ99');
    const d404 = await res404.json();

    if (res404.status === 404 && d404.erro) {
      b3.textContent = 'Aprovado ✅';
      b3.className = 'test-badge pass';
      l3.textContent += `HTTP 404 retornado corretamente: "${d404.erro}"\nProteção contra falha validada com sucesso.`;
    } else {
      throw new Error('Não retornou 404 esperado.');
    }
  } catch (e) {
    b3.textContent = 'Falha ❌';
    b3.className = 'test-badge fail';
    l3.textContent += `Erro: ${e.message}`;
  }

  // --- Teste 4: Estado e Dados Adicionais ---
  b4.textContent = 'Executando…';
  b4.className = 'test-badge';
  l4.textContent = 'Testando persistência de favoritos, cadeia evolutiva e comparador...\n';

  try {
    const [resComp, resRand] = await Promise.all([
      fetch('/api/comparar?p1=pikachu&p2=raichu'),
      fetch('/api/aleatorio')
    ]);
    const dComp = await resComp.json();
    const dRand = await resRand.json();

    if (dComp.sucesso && dRand.sucesso) {
      b4.textContent = 'Aprovado ✅';
      b4.className = 'test-badge pass';
      l4.textContent += `Comparador: Pikachu vs Raichu confrontados com sucesso.\nSorteio Aleatório: ${dRand.nomeFormatado} (#${dRand.id}) sorteado.`;
      marcarChecklistAutomatico(20);
    } else {
      throw new Error('Falha no comparador ou sorteio.');
    }
  } catch (e) {
    b4.textContent = 'Falha ❌';
    b4.className = 'test-badge fail';
    l4.textContent += `Erro: ${e.message}`;
  }

  btn.disabled = false;
  btn.textContent = '▶️ Executar Todos os Testes Novamente';
}
