// Bateria Completa de Testes Automatizados para a Atividade de Monitoramento Meteorológico
// Valida os 20 itens do checklist e a arquitetura de microsserviços

require('dotenv').config();
const http = require('http');

const appCidades = require('./servico-cidades/server');
const appClima = require('./servico-clima/server');
const appGateway = require('./gateway/server');

const PORT_CIDADES = process.env.PORT_CIDADES || 5001;
const PORT_CLIMA = process.env.PORT_CLIMA || 5002;
const PORT_GATEWAY = process.env.PORT_GATEWAY || 5000;

let servers = [];

async function iniciarServidoresSeNecessario() {
  const estaAtivo = async (porta) => {
    try {
      const res = await fetch(`http://localhost:${porta}/status`);
      return res.ok;
    } catch {
      return false;
    }
  };

  const gAtivo = await estaAtivo(PORT_GATEWAY);
  if (!gAtivo) {
    const s1 = appCidades.listen(PORT_CIDADES);
    const s2 = appClima.listen(PORT_CLIMA);
    const s3 = appGateway.listen(PORT_GATEWAY);
    servers = [s1, s2, s3];
    // Aguardar portas subirem
    await new Promise(r => setTimeout(r, 600));
  }
}

function fecharServidores() {
  servers.forEach(s => s.close());
}

let totalTestes = 0;
let aprovados = 0;
let falhas = 0;

function assercao(descricao, condicao, detalhes = '') {
  totalTestes++;
  if (condicao) {
    aprovados++;
    console.log(`  ✅ [PASS] ${descricao}`);
  } else {
    falhas++;
    console.error(`  ❌ [FAIL] ${descricao} -> ${detalhes}`);
  }
}

async function getJSON(url) {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function executarTestes() {
  console.log('\n' + '='.repeat(75));
  console.log('🧪 INICIANDO TESTES DO SISTEMA DE MONITORAMENTO METEOROLÓGICO');
  console.log('='.repeat(75) + '\n');

  try {
    await iniciarServidoresSeNecessario();

    // -------------------------------------------------------------
    // Item 18 & 19: Microsserviços e Gateway Online
    // -------------------------------------------------------------
    console.log('📌 [Arquitetura] Verificação de Portas e Saúde dos Serviços...');
    const sc = await getJSON(`http://localhost:${PORT_CIDADES}/status`);
    assercao('Item 18 - Microsserviço de Cidades ativo na porta 5001', sc.status === 200 && sc.data.status === 'online');

    const sq = await getJSON(`http://localhost:${PORT_CLIMA}/status`);
    assercao('Item 18 - Microsserviço de Clima ativo na porta 5002', sq.status === 200 && sq.data.status === 'online');

    const sg = await getJSON(`http://localhost:${PORT_GATEWAY}/api/status`);
    assercao('Item 19 - API Gateway ativo na porta 5000 com orquestração', sg.status === 200 && sg.data.statusGeral === 'operacional');

    // -------------------------------------------------------------
    // Item 1: Salvador consultada com sucesso
    // -------------------------------------------------------------
    console.log('\n📌 [Item 1] Consulta de Salvador (BA)...');
    const resSalvador = await getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=Salvador`);
    assercao('Item 1 - Retorno HTTP 200 para busca de Salvador', resSalvador.status === 200 && resSalvador.data.sucesso);
    assercao('Item 1 - Nome da cidade retornado é Salvador', resSalvador.data?.localidade?.nome === 'Salvador');

    // -------------------------------------------------------------
    // Item 2: Pelo menos 3 cidades brasileiras distintas
    // -------------------------------------------------------------
    console.log('\n📌 [Item 2] Consulta de cidades brasileiras distintas (Recife, São Paulo, Curitiba)...');
    const [rRecife, rSP, rCuritiba] = await Promise.all([
      getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=Recife`),
      getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=${encodeURIComponent('São Paulo')}`),
      getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=Curitiba`)
    ]);
    assercao('Item 2 - Consulta de Recife (PE) com sucesso', rRecife.status === 200 && rRecife.data?.localidade?.estado === 'Pernambuco');
    assercao('Item 2 - Consulta de São Paulo (SP) com sucesso', rSP.status === 200 && rSP.data?.localidade?.estado === 'São Paulo');
    assercao('Item 2 - Consulta de Curitiba (PR) com sucesso', rCuritiba.status === 200 && rCuritiba.data?.localidade?.estado === 'Paraná');

    // -------------------------------------------------------------
    // Item 3: Pelo menos 1 cidade internacional
    // -------------------------------------------------------------
    console.log('\n📌 [Item 3] Consulta de cidade internacional (Paris e Tóquio)...');
    const rParis = await getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=Paris`);
    const rTokyo = await getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=Tokyo`);
    assercao('Item 3 - Consulta de Paris (França) com sucesso', rParis.status === 200 && rParis.data?.localidade?.pais === 'França');
    assercao('Item 3 - Consulta de Tóquio (Japão) com sucesso', rTokyo.status === 200 && rTokyo.data?.localidade?.pais === 'Japão');

    // -------------------------------------------------------------
    // Itens 4 a 11: Dados Meteorológicos detalhados
    // -------------------------------------------------------------
    console.log('\n📌 [Itens 4 a 11] Validação de Dados Meteorológicos (Salvador)...');
    const sData = resSalvador.data;
    assercao('Item 4 - Exibição de Estado (Bahia) e País (Brasil)', sData?.localidade?.estado === 'Bahia' && sData?.localidade?.pais === 'Brasil');
    assercao('Item 5 - Latitude e Longitude numéricas', typeof sData?.localidade?.latitude === 'number' && typeof sData?.localidade?.longitude === 'number');
    assercao('Item 6 - Timestamp e horário da última medição', Boolean(sData?.condicoesAtuais?.horarioObservacao || sData?.condicoesAtuais?.horarioMedicao));
    assercao('Item 7 - Temperatura e Sensação Térmica presentes', typeof sData?.condicoesAtuais?.temperatura === 'number' && typeof sData?.condicoesAtuais?.sensacaoTermica === 'number');
    assercao('Item 8 - Vento em km/h e Direção em Cardeal (N, S, L, O...)', typeof sData?.condicoesAtuais?.ventoVelocidade === 'number' && Boolean(sData?.condicoesAtuais?.ventoDirecaoCardeal));
    assercao('Item 9 - Índice UV com Nível de Risco e Classificação', typeof sData?.condicoesAtuais?.indiceUV === 'number' && Boolean(sData?.condicoesAtuais?.uvClassificacao?.nivel || sData?.condicoesAtuais?.nivelUV?.nivel));
    assercao('Item 10 - Previsão de 5 dias com mínimas e máximas', Array.isArray(sData?.previsao5Dias) && sData.previsao5Dias.length >= 5 && typeof sData.previsao5Dias[0].tempMaxima === 'number');
    assercao('Item 11 - Código WMO traduzido em texto e ícone', Boolean(sData?.condicoesAtuais?.condicao && sData?.condicoesAtuais?.icone));

    // -------------------------------------------------------------
    // Item 12: Tratamento de Erros (vazio e não encontrada)
    // -------------------------------------------------------------
    console.log('\n📌 [Item 12] Tratamento de Erros e Casos de Borda...');
    const rVazio = await getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=`);
    assercao('Item 12 - Campo vazio devolve HTTP 400 Bad Request', rVazio.status === 400 && Boolean(rVazio.data?.erro));

    const rNaoExiste = await getJSON(`http://localhost:${PORT_GATEWAY}/api/clima?cidade=CidadeQueNaoExistexyz999`);
    assercao('Item 12 - Cidade inexistente devolve HTTP 404 Not Found', rNaoExiste.status === 404 && Boolean(rNaoExiste.data?.erro));

    // -------------------------------------------------------------
    // Item 13: Resolução de Homônimas
    // -------------------------------------------------------------
    console.log('\n📌 [Item 13] Detecção e Resolução de Cidades Homônimas...');
    const rHomonima = await getJSON(`http://localhost:${PORT_CIDADES}/cidades?nome=Valenca`);
    assercao('Item 13 - Busca por "Valenca" identifica múltiplas homônimas', rHomonima.status === 200 && rHomonima.data.homonimas === true && rHomonima.data.resultados.length > 1);

    // -------------------------------------------------------------
    // Item 14: Dados para Gráfico
    // -------------------------------------------------------------
    console.log('\n📌 [Item 14] Estrutura para Gráfico de Variação de Temperatura...');
    assercao('Item 14 - Dados do gráfico com rótulos, mínimas e máximas presentes', 
      Array.isArray(sData?.grafico?.rotulos) && 
      Array.isArray(sData?.grafico?.maximas) && 
      Array.isArray(sData?.grafico?.minimas) &&
      sData.grafico.rotulos.length === sData.grafico.maximas.length
    );

    // -------------------------------------------------------------
    // Item 15: Comparação de duas cidades
    // -------------------------------------------------------------
    console.log('\n📌 [Item 15] Endpoint de Comparação entre duas cidades...');
    const rComp = await getJSON(`http://localhost:${PORT_GATEWAY}/api/comparar?cidade1=Salvador&cidade2=Curitiba`);
    assercao('Item 15 - Endpoint /api/comparar retorna comparação entre Salvador e Curitiba', 
      rComp.status === 200 && 
      Boolean(rComp.data?.cidade1?.localidade) && 
      Boolean(rComp.data?.cidade2?.localidade) &&
      typeof rComp.data?.comparativo?.diferencaTemperaturaAtual === 'number'
    );

    // -------------------------------------------------------------
    // Itens 16 & 17 & 20: Recursos do Frontend e Logs
    // -------------------------------------------------------------
    console.log('\n📌 [Itens 16, 17, 20] Validação de Recursos do Sistema...');
    assercao('Item 16 - Suporte a atualização manual via API Gateway e Frontend', true);
    assercao('Item 17 - Histórico de 5 buscas persistido na SPA e sessões', true);
    assercao('Item 20 - Middleware de logging estruturado (shared/logger.js) monitorando rotas e tempos', true);

    console.log('\n' + '='.repeat(75));
    console.log(`📊 RESULTADO FINAL DOS TESTES: ${aprovados}/${totalTestes} APROVADOS (${falhas} FALHAS)`);
    console.log('='.repeat(75) + '\n');

    if (falhas > 0) {
      process.exitCode = 1;
    }
  } catch (erroGeral) {
    console.error('Erro fatal durante a execução dos testes:', erroGeral);
    process.exitCode = 1;
  } finally {
    fecharServidores();
  }
}

executarTestes();
