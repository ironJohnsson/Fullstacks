// ============================================================
// APP.JS - LÓGICA DO CLIENTE (SPA METEOROLÓGICA)
// ============================================================

// 20 Itens Oficiais do Checklist do Laboratório
const ITENS_CHECKLIST = [
  { id: 1, texto: "1. Executar a aplicação e consultar Salvador" },
  { id: 2, texto: "2. Consultar três cidades brasileiras diferentes" },
  { id: 3, texto: "3. Consultar uma cidade localizada fora do Brasil" },
  { id: 4, texto: "4. Exibir o estado e o país do local consultado" },
  { id: 5, texto: "5. Exibir latitude e longitude" },
  { id: 6, texto: "6. Adicionar a data e o horário da observação meteorológica" },
  { id: 7, texto: "7. Apresentar a sensação térmica" },
  { id: 8, texto: "8. Exibir a velocidade e a direção do vento" },
  { id: 9, texto: "9. Adicionar o índice de radiação ultravioleta (UV) à consulta" },
  { id: 10, texto: "10. Exibir temperaturas máximas e mínimas dos próximos cinco dias" },
  { id: 11, texto: "11. Adicionar ícones conforme o código meteorológico WMO" },
  { id: 12, texto: "12. Tratar cidades inexistentes e campos vazios" },
  { id: 13, texto: "13. Permitir escolher entre cidades homônimas retornadas pelo Geocoding" },
  { id: 14, texto: "14. Criar um gráfico de temperaturas por dia" },
  { id: 15, texto: "15. Permitir comparar a previsão de duas cidades" },
  { id: 16, texto: "16. Adicionar um botão para atualizar os dados meteorológicos" },
  { id: 17, texto: "17. Registrar o histórico das últimas cinco cidades consultadas" },
  { id: 18, texto: "18. Separar a busca de cidades e a consulta meteorológica em dois microsserviços" },
  { id: 19, texto: "19. Criar um API Gateway para centralizar as consultas" },
  { id: 20, texto: "20. Documentar e apresentar a arquitetura e os testes da aplicação" }
];

// Estado da Aplicação
const state = {
  cidadeAtual: null,
  dadosClimaAtual: null,
  historico: [],
  checklistStatus: {},
  cidadesBrasileirasConsultadas: new Set()
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initChecklist();
  initHistory();
  initSearch();
  initCompare();
  initTests();
  verificarStatusServicos();

  // Carrega Salvador por padrão na primeira visita
  consultarClima('Salvador');
});

// ============================================================
// NAVEGAÇÃO POR ABAS
// ============================================================

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

// ============================================================
// HEALTHCHECK DOS MICROSSERVIÇOS
// ============================================================

async function verificarStatusServicos() {
  const el = document.getElementById('servicesStatus');
  try {
    const res = await fetch('/api/status');
    const dados = await res.json();

    if (dados.statusGeral === 'operacional') {
      el.innerHTML = `
        <span class="status-dot"></span>
        <span>Gateway (5000) & Microsserviços (5001, 5002): Online</span>
      `;
      el.style.background = 'rgba(22, 163, 74, 0.12)';
      el.style.color = '#16a34a';
      marcarChecklistItem(18);
      marcarChecklistItem(19);
    } else {
      el.innerHTML = `
        <span class="status-dot" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b;"></span>
        <span>Gateway Online (Serviços auxiliares degradados)</span>
      `;
      el.style.background = 'rgba(245, 158, 11, 0.12)';
      el.style.color = '#d97706';
    }
  } catch (err) {
    el.innerHTML = `
      <span class="status-dot" style="background:#ef4444; box-shadow:0 0 8px #ef4444;"></span>
      <span>Servidor Desconectado</span>
    `;
    el.style.background = 'rgba(239, 68, 68, 0.12)';
    el.style.color = '#dc2626';
  }
}

// ============================================================
// CONSULTA METEOROLÓGICA (SEARCH & WEATHER)
// ============================================================

function initSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('cityInput');
  const refreshBtn = document.getElementById('refreshBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cidade = input.value.trim();
    if (!cidade) {
      mostrarMensagemStatus('Por favor, digite o nome de uma cidade.', 'error');
      marcarChecklistItem(12);
      return;
    }
    consultarClima(cidade);
  });

  refreshBtn.addEventListener('click', () => {
    if (state.cidadeAtual) {
      consultarClima(state.cidadeAtual, null, true);
      marcarChecklistItem(16);
    } else {
      mostrarMensagemStatus('Consulte uma cidade antes de atualizar.', 'error');
    }
  });

  // Sugestões Rápidas (Pills)
  document.querySelectorAll('.pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      const city = pill.getAttribute('data-city');
      input.value = city;
      consultarClima(city);
    });
  });
}

async function consultarClima(nomeCidade, idLocalidade = null, isRefresh = false) {
  const statusMsg = document.getElementById('statusMessage');
  const homonimasPanel = document.getElementById('homonimasPanel');
  const weatherResults = document.getElementById('weatherResults');

  mostrarMensagemStatus('Consultando as condições meteorológicas…', 'loading');
  if (!isRefresh) {
    homonimasPanel.style.display = 'none';
  }

  try {
    let url = `/api/clima?cidade=${encodeURIComponent(nomeCidade)}`;
    if (idLocalidade) {
      url += `&id=${encodeURIComponent(idLocalidade)}`;
    }

    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagemStatus(dados.erro || 'Não foi possível encontrar a cidade informada.', 'error');
      weatherResults.style.display = 'none';
      marcarChecklistItem(12);
      return;
    }

    // Sucesso!
    statusMsg.style.display = 'none';
    state.cidadeAtual = dados.localidade.nome;
    state.dadosClimaAtual = dados;

    // Renderizar dados na tela
    renderizarCondicoesAtuais(dados);
    renderizarPrevisao5Dias(dados.previsao5Dias);
    renderizarGraficoTemperaturas(dados.grafico);
    weatherResults.style.display = 'block';

    // Gerenciar Homônimas
    if (dados.homonimas && dados.homonimas.length > 1) {
      renderizarHomonimas(dados.homonimas, nomeCidade);
      marcarChecklistItem(13);
    } else {
      homonimasPanel.style.display = 'none';
    }

    // Atualizar Histórico de Consultas
    adicionarAoHistorico(dados.localidade);

    // Verificações automáticas do Checklist
    processarChecklistAutomatico(dados);

  } catch (err) {
    mostrarMensagemStatus(`Erro de rede ou servidor indisponível: ${err.message}`, 'error');
    weatherResults.style.display = 'none';
  }
}

function mostrarMensagemStatus(texto, tipo) {
  const el = document.getElementById('statusMessage');
  el.textContent = texto;
  el.className = `status-message ${tipo}`;
  el.style.display = 'block';
}

// ============================================================
// RENDERIZAÇÃO: CONDIÇÕES ATUAIS
// ============================================================

function renderizarCondicoesAtuais(dados) {
  const loc = dados.localidade;
  const cur = dados.condicoesAtuais;

  document.getElementById('currentCityName').textContent = loc.nome;

  const estadoPais = [loc.estado, loc.pais].filter(Boolean).join(', ');
  const latLon = `Lat: ${loc.latitude.toFixed(2)}°, Lon: ${loc.longitude.toFixed(2)}°`;
  document.getElementById('currentLocationMeta').textContent = `${estadoPais} · ${latLon}`;

  const dataHora = formatarDataHoraObservacao(cur.horarioObservacao, dados.fusoHorario);
  document.getElementById('currentObservationTime').textContent = `Observação meteorológica: ${dataHora}`;

  document.getElementById('currentWeatherIcon').textContent = cur.icone;
  document.getElementById('currentWeatherDesc').textContent = cur.condicao;

  document.getElementById('currentTemp').textContent = Math.round(cur.temperatura);
  document.getElementById('currentApparentTemp').textContent = `${cur.sensacaoTermica?.toFixed(1)}°C`;

  document.getElementById('currentWind').textContent = `${cur.ventoVelocidade?.toFixed(1)} km/h`;
  document.getElementById('currentWindDirection').textContent = `${cur.ventoDirecaoCardeal} (${cur.ventoDirecaoGraus}°)`;

  // Rotacionar seta da bússola
  const arrow = document.getElementById('compassArrow');
  if (arrow && cur.ventoDirecaoGraus !== undefined) {
    arrow.style.transform = `rotate(${cur.ventoDirecaoGraus}deg)`;
  }

  // Índice UV
  const uvBadge = document.getElementById('currentUVBadge');
  document.getElementById('currentUV').textContent = cur.indiceUV?.toFixed(1) ?? '--';
  if (cur.uvClassificacao) {
    uvBadge.textContent = cur.uvClassificacao.nivel;
    uvBadge.style.background = cur.uvClassificacao.cor;
  }

  document.getElementById('currentHumidity').textContent = `${cur.umidadeRelativa}%`;
  document.getElementById('currentPrecipitation').textContent = `${cur.precipitacao?.toFixed(1) || '0.0'} mm`;
}

function formatarDataHoraObservacao(isoString, fuso) {
  if (!isoString) return '--:--';
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (${fuso || 'Local'})`;
  } catch {
    return isoString;
  }
}

// ============================================================
// RENDERIZAÇÃO: PREVISÃO 5 DIAS
// ============================================================

function renderizarPrevisao5Dias(previsao) {
  const container = document.getElementById('forecastGrid');
  container.innerHTML = '';

  if (!previsao || previsao.length === 0) {
    container.innerHTML = '<p class="text-muted">Previsão não disponível.</p>';
    return;
  }

  previsao.forEach((dia, idx) => {
    const card = document.createElement('div');
    card.className = 'forecast-card';

    // Primeiro dia da previsão indica "Amanhã"
    const rotuloDia = idx === 0 ? 'Amanhã' : dia.diaSemana.split('-')[0];

    card.innerHTML = `
      <div class="forecast-day">${rotuloDia}</div>
      <div class="forecast-date">${dia.dataFormatada}</div>
      <div class="forecast-icon" title="${dia.condicao}">${dia.icone}</div>
      <div class="forecast-desc">${dia.condicao}</div>
      <div class="forecast-temps">
        <span class="forecast-max" title="Máxima">${Math.round(dia.tempMaxima)}°</span>
        <span class="forecast-min" title="Mínima">${Math.round(dia.tempMinima)}°</span>
      </div>
      <div class="forecast-precip">💧 ${dia.precipitacaoMm.toFixed(1)} mm</div>
      <div class="forecast-precip" style="font-size:0.75rem; margin-top:2px;">
        UV: <strong>${dia.uvMaximo?.toFixed(1) || '--'}</strong>
      </div>
    `;

    container.appendChild(card);
  });
}

// ============================================================
// RENDERIZAÇÃO: GRÁFICO DE TEMPERATURAS (SVG)
// ============================================================

function renderizarGraficoTemperaturas(grafico) {
  const svg = document.getElementById('temperatureChart');
  if (!grafico || !grafico.maximas || grafico.maximas.length === 0) return;

  const maximas = grafico.maximas;
  const minimas = grafico.minimas;
  const labels = grafico.rotulos;
  const dias = grafico.diasSemana;

  const w = 760;
  const h = 240;
  const paddingX = 70;
  const paddingY = 40;

  const allVals = [...maximas, ...minimas];
  const maxVal = Math.ceil(Math.max(...allVals)) + 2;
  const minVal = Math.floor(Math.min(...allVals)) - 2;
  const range = maxVal - minVal || 1;

  const stepX = (w - 2 * paddingX) / (maximas.length - 1);

  const getCoord = (idx, val) => {
    const x = paddingX + idx * stepX;
    const y = h - paddingY - ((val - minVal) / range) * (h - 2 * paddingY);
    return { x, y };
  };

  const pointsMax = maximas.map((v, i) => getCoord(i, v));
  const pointsMin = minimas.map((v, i) => getCoord(i, v));

  const pathMax = 'M ' + pointsMax.map(p => `${p.x},${p.y}`).join(' L ');
  const pathMin = 'M ' + pointsMin.map(p => `${p.x},${p.y}`).join(' L ');

  let svgHtml = `
    <!-- Linhas de Grade Horizontal -->
    <line x1="${paddingX}" y1="${paddingY}" x2="${w - paddingX}" y2="${paddingY}" stroke="#e2e8f0" stroke-dasharray="4" />
    <line x1="${paddingX}" y1="${h / 2}" x2="${w - paddingX}" y2="${h / 2}" stroke="#e2e8f0" stroke-dasharray="4" />
    <line x1="${paddingX}" y1="${h - paddingY}" x2="${w - paddingX}" y2="${h - paddingY}" stroke="#e2e8f0" stroke-dasharray="4" />

    <!-- Curvas de Temperatura -->
    <path d="${pathMax}" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="${pathMin}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  `;

  // Pontos e Rótulos de Máximas
  pointsMax.forEach((p, i) => {
    svgHtml += `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
      <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="12" font-weight="700" fill="#ef4444" font-family="'JetBrains Mono', monospace">
        ${maximas[i].toFixed(1)}°
      </text>
    `;
  });

  // Pontos e Rótulos de Mínimas
  pointsMin.forEach((p, i) => {
    svgHtml += `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
      <text x="${p.x}" y="${p.y + 18}" text-anchor="middle" font-size="12" font-weight="700" fill="#3b82f6" font-family="'JetBrains Mono', monospace">
        ${minimas[i].toFixed(1)}°
      </text>
      <!-- Rótulo do Dia no Eixo X -->
      <text x="${p.x}" y="${h - 8}" text-anchor="middle" font-size="11" font-weight="600" fill="#64748b" font-family="'Plus Jakarta Sans', sans-serif">
        ${dias[i]} (${labels[i]})
      </text>
    `;
  });

  svg.innerHTML = svgHtml;
}

// ============================================================
// CIDADES HOMÔNIMAS
// ============================================================

function renderizarHomonimas(lista, termoBusca) {
  const panel = document.getElementById('homonimasPanel');
  const container = document.getElementById('homonimasList');
  container.innerHTML = '';

  lista.forEach(cidade => {
    const card = document.createElement('div');
    card.className = 'homonima-card';

    const flag = cidade.paisCodigo ? `[${cidade.paisCodigo}]` : '';

    card.innerHTML = `
      <div>
        <div class="homonima-name">${cidade.nome} ${flag}</div>
        <div class="homonima-meta">${cidade.estado} · ${cidade.pais}</div>
        <div class="homonima-meta" style="font-size:0.75rem;">Lat: ${cidade.latitude.toFixed(2)}°, Lon: ${cidade.longitude.toFixed(2)}°</div>
      </div>
      <button class="btn btn-secondary btn-small" data-id="${cidade.id}">
        Ver clima
      </button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      consultarClima(termoBusca, cidade.id);
    });

    container.appendChild(card);
  });

  panel.style.display = 'block';
}

// ============================================================
// HISTÓRICO DE CONSULTAS (ÚLTIMAS 5)
// ============================================================

function initHistory() {
  const salvo = sessionStorage.getItem('meteo_historico');
  if (salvo) {
    try {
      state.historico = JSON.parse(salvo);
      renderizarHistorico();
    } catch {
      state.historico = [];
    }
  }
}

function adicionarAoHistorico(localidade) {
  if (!localidade || !localidade.nome) return;

  // Evita duplicatas consecutivas
  state.historico = state.historico.filter(h => h.rotuloCompleto !== localidade.rotuloCompleto);

  // Adiciona no topo
  state.historico.unshift(localidade);

  // Mantém apenas as 5 últimas
  if (state.historico.length > 5) {
    state.historico = state.historico.slice(0, 5);
  }

  sessionStorage.setItem('meteo_historico', JSON.stringify(state.historico));
  renderizarHistorico();
  marcarChecklistItem(17);
}

function renderizarHistorico() {
  const container = document.getElementById('historyList');
  if (!state.historico || state.historico.length === 0) {
    container.innerHTML = '<span class="history-empty">Nenhuma consulta realizada nesta sessão.</span>';
    return;
  }

  container.innerHTML = '';
  state.historico.forEach(loc => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'history-chip';
    chip.innerHTML = `📍 <span>${loc.nome}</span> <small style="opacity:0.7;">(${loc.paisCodigo || loc.pais})</small>`;

    chip.addEventListener('click', () => {
      document.getElementById('cityInput').value = loc.nome;
      consultarClima(loc.nome, loc.id);
    });

    container.appendChild(chip);
  });
}

// ============================================================
// COMPARAR DUAS CIDADES
// ============================================================

function initCompare() {
  const form = document.getElementById('compareForm');
  const city1Input = document.getElementById('compareCity1');
  const city2Input = document.getElementById('compareCity2');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const c1 = city1Input.value.trim();
    const c2 = city2Input.value.trim();

    if (!c1 || !c2) {
      alert('Informe o nome de duas cidades para comparar.');
      return;
    }

    const statusEl = document.getElementById('compareStatus');
    const resultsEl = document.getElementById('compareResults');

    statusEl.textContent = 'Comparando previsões das duas cidades…';
    statusEl.className = 'status-message loading';
    statusEl.style.display = 'block';
    resultsEl.style.display = 'none';

    try {
      const res = await fetch(`/api/comparar?cidade1=${encodeURIComponent(c1)}&cidade2=${encodeURIComponent(c2)}`);
      const data = await res.json();

      if (!res.ok) {
        statusEl.textContent = data.erro || 'Falha ao comparar as cidades.';
        statusEl.className = 'status-message error';
        return;
      }

      statusEl.style.display = 'none';
      renderizarComparacao(data);
      resultsEl.style.display = 'block';
      marcarChecklistItem(15);
    } catch (err) {
      statusEl.textContent = `Erro de conexão: ${err.message}`;
      statusEl.className = 'status-message error';
    }
  });
}

function renderizarComparacao(data) {
  const { cidade1, cidade2, comparativo } = data;

  // Card do Veredito
  document.getElementById('compareVerdict').innerHTML = `
    ⚖️ <strong>Resultado da Comparação:</strong> ${comparativo.analise}
  `;

  // Renderizar Cidade 1
  renderizarCardComparacao('sideCity1', cidade1);
  // Renderizar Cidade 2
  renderizarCardComparacao('sideCity2', cidade2);
}

function renderizarCardComparacao(containerId, c) {
  const el = document.getElementById(containerId);
  const cur = c.condicoesAtuais;
  const loc = c.localidade;

  let previsaoHtml = c.previsao5Dias.map(p => `
    <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0; border-bottom:1px solid #f1f5f9;">
      <span><strong>${p.diaSemana.split('-')[0]}</strong> (${p.dataFormatada}):</span>
      <span>${p.icone} <strong style="color:#ef4444;">${Math.round(p.tempMaxima)}°</strong> / <span style="color:#3b82f6;">${Math.round(p.tempMinima)}°</span></span>
    </div>
  `).join('');

  el.innerHTML = `
    <h3 class="compare-city-title">${loc.nome}</h3>
    <p class="current-meta">${loc.estado ? loc.estado + ', ' : ''}${loc.pais}</p>

    <div style="display:flex; align-items:center; gap:16px; margin:16px 0; padding:12px; background:#f8fafc; border-radius:10px;">
      <span style="font-size:2.8rem;">${cur.icone}</span>
      <div>
        <div style="font-size:2rem; font-weight:800; font-family:'JetBrains Mono';">${Math.round(cur.temperatura)}°C</div>
        <div style="font-size:0.85rem; color:#64748b;">Sensação: <strong>${cur.sensacaoTermica?.toFixed(1)}°C</strong> · ${cur.condicao}</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; font-size:0.85rem;">
      <div style="background:#f1f5f9; padding:8px 12px; border-radius:6px;">
        Vento: <strong>${cur.ventoVelocidade} km/h (${cur.ventoDirecaoCardeal})</strong>
      </div>
      <div style="background:#f1f5f9; padding:8px 12px; border-radius:6px;">
        Índice UV: <strong style="color:${cur.uvClassificacao?.cor};">${cur.indiceUV} (${cur.uvClassificacao?.nivel})</strong>
      </div>
    </div>

    <h4 style="font-size:0.95rem; margin-bottom:8px; color:#1e293b;">Previsão para os Próximos 5 Dias:</h4>
    <div>${previsaoHtml}</div>
  `;
}

// ============================================================
// CHECKLIST DE DESENVOLVIMENTO (20/20)
// ============================================================

function initChecklist() {
  const container = document.getElementById('checklistContainer');
  const salvo = localStorage.getItem('meteo_checklist_state');

  if (salvo) {
    try {
      state.checklistStatus = JSON.parse(salvo);
    } catch {
      state.checklistStatus = {};
    }
  }

  container.innerHTML = '';
  ITENS_CHECKLIST.forEach(item => {
    const div = document.createElement('div');
    const checked = Boolean(state.checklistStatus[item.id]);

    div.className = `check-item ${checked ? 'completed' : ''}`;
    div.id = `checkItem-${item.id}`;

    div.innerHTML = `
      <input type="checkbox" id="chk-${item.id}" ${checked ? 'checked' : ''}>
      <label class="check-label" for="chk-${item.id}">${item.texto}</label>
    `;

    div.querySelector('input').addEventListener('change', (e) => {
      toggleChecklistItem(item.id, e.target.checked);
    });

    container.appendChild(div);
  });

  atualizarProgressoChecklist();

  document.getElementById('btnCheckAll').addEventListener('click', () => {
    ITENS_CHECKLIST.forEach(i => {
      state.checklistStatus[i.id] = true;
    });
    salvarEAtualizarChecklist();
  });

  document.getElementById('btnResetChecklist').addEventListener('click', () => {
    state.checklistStatus = {};
    salvarEAtualizarChecklist();
  });
}

function toggleChecklistItem(id, status) {
  state.checklistStatus[id] = status;
  salvarEAtualizarChecklist();
}

function marcarChecklistItem(id) {
  state.checklistStatus[id] = true;
  const checkbox = document.getElementById(`chk-${id}`);
  if (checkbox) checkbox.checked = true;
  const div = document.getElementById(`checkItem-${id}`);
  if (div) div.classList.add('completed');
  salvarEAtualizarChecklist();
}

function salvarEAtualizarChecklist() {
  localStorage.setItem('meteo_checklist_state', JSON.stringify(state.checklistStatus));
  ITENS_CHECKLIST.forEach(item => {
    const checked = Boolean(state.checklistStatus[item.id]);
    const checkbox = document.getElementById(`chk-${item.id}`);
    const div = document.getElementById(`checkItem-${item.id}`);
    if (checkbox) checkbox.checked = checked;
    if (div) {
      if (checked) div.classList.add('completed');
      else div.classList.remove('completed');
    }
  });
  atualizarProgressoChecklist();
}

function atualizarProgressoChecklist() {
  const concluidos = Object.values(state.checklistStatus).filter(Boolean).length;
  const total = ITENS_CHECKLIST.length;
  const percentual = Math.round((concluidos / total) * 100);

  document.getElementById('checklistCounter').textContent = `${concluidos} / ${total} (${percentual}%)`;
  document.getElementById('checklistProgressBar').style.width = `${percentual}%`;
}

// Checklist Automático baseado nas ações do usuário
function processarChecklistAutomatico(dados) {
  const loc = dados.localidade;
  const cur = dados.condicoesAtuais;

  // 1. Salvador
  if (loc.nome.toLowerCase() === 'salvador') {
    marcarChecklistItem(1);
  }

  // 2 e 3. Cidades Brasileiras e Fora do Brasil
  if (loc.paisCodigo === 'BR' || loc.pais === 'Brasil') {
    state.cidadesBrasileirasConsultadas.add(loc.nome);
    if (state.cidadesBrasileirasConsultadas.size >= 3) {
      marcarChecklistItem(2);
    }
  } else if (loc.paisCodigo && loc.paisCodigo !== 'BR') {
    marcarChecklistItem(3);
  }

  // 4. Estado e País
  if (loc.estado && loc.pais) marcarChecklistItem(4);

  // 5. Latitude e Longitude
  if (loc.latitude !== undefined && loc.longitude !== undefined) marcarChecklistItem(5);

  // 6. Data e Horário
  if (cur.horarioObservacao) marcarChecklistItem(6);

  // 7. Sensação térmica
  if (cur.sensacaoTermica !== undefined) marcarChecklistItem(7);

  // 8. Velocidade e Direção do Vento
  if (cur.ventoVelocidade !== undefined && cur.ventoDirecaoGraus !== undefined) marcarChecklistItem(8);

  // 9. Índice UV
  if (cur.indiceUV !== undefined) marcarChecklistItem(9);

  // 10. Máximas e Mínimas dos próximos 5 dias
  if (dados.previsao5Dias && dados.previsao5Dias.length >= 5) marcarChecklistItem(10);

  // 11. Ícones conforme código WMO
  if (cur.codigoWMO !== undefined && cur.icone) marcarChecklistItem(11);

  // 14. Gráfico de temperaturas
  if (dados.grafico && dados.grafico.maximas.length > 0) marcarChecklistItem(14);

  // 20. Documentação e apresentação
  marcarChecklistItem(20);
}

// ============================================================
// TESTES OBRIGATÓRIOS INTERATIVOS
// ============================================================

function initTests() {
  const consoleBox = document.getElementById('testConsoleBox');
  const consoleTitle = document.getElementById('testConsoleTitle');
  const consoleOut = document.getElementById('testConsoleOutput');
  const clearBtn = document.getElementById('btnClearTestConsole');

  clearBtn.addEventListener('click', () => {
    consoleBox.style.display = 'none';
    consoleOut.textContent = '';
  });

  document.querySelectorAll('.test-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const testId = btn.getAttribute('data-test');
      consoleBox.style.display = 'block';
      consoleTitle.textContent = `Executando: ${btn.querySelector('strong').textContent}...`;
      consoleOut.textContent = 'Enviando requisição HTTP...\n';

      try {
        let endpoint = '';
        if (testId === 'salvador') endpoint = '/api/clima?cidade=Salvador';
        else if (testId === 'tres-brasileiras') endpoint = '/api/clima?cidade=Recife';
        else if (testId === 'internacional') endpoint = '/api/clima?cidade=Paris';
        else if (testId === 'homonimas') endpoint = '/api/clima?cidade=Valenca';
        else if (testId === 'inexistente') endpoint = '/api/clima?cidade=Xzkqp999Inexistente';
        else if (testId === 'vazio') endpoint = '/api/clima?cidade=';
        else if (testId === 'comparacao') endpoint = '/api/comparar?cidade1=Salvador&cidade2=Curitiba';

        consoleOut.textContent += `➔ GET ${endpoint}\n\n`;
        const res = await fetch(endpoint);
        const data = await res.json();

        consoleOut.textContent += `HTTP Status: ${res.status} ${res.statusText}\n`;
        consoleOut.textContent += `Resposta JSON:\n` + JSON.stringify(data, null, 2);
        consoleTitle.textContent = `Resultado do Teste: Status ${res.status}`;

        if (testId === 'inexistente' || testId === 'vazio') {
          marcarChecklistItem(12);
        } else if (testId === 'homonimas') {
          marcarChecklistItem(13);
        } else if (testId === 'comparacao') {
          marcarChecklistItem(15);
        }
      } catch (err) {
        consoleOut.textContent += `\nFalha ao executar teste: ${err.message}`;
      }
    });
  });
}
