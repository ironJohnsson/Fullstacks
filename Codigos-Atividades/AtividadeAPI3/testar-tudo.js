// Bateria Completa de Testes Automatizados - Pokédex Explorer (AtividadeAPI3)
// Valida os 4 cenários obrigatórios e as 20 atividades do roteiro
require('dotenv').config();

const appCatalogo = require('./servico-catalogo/server');
const appDetalhes = require('./servico-detalhes/server');
const appGateway = require('./gateway/server');

const PORT_CATALOGO = process.env.PORT_CATALOGO || 5051;
const PORT_DETALHES = process.env.PORT_DETALHES || 5052;
const PORT_GATEWAY = process.env.PORT_GATEWAY || 5050;

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
    const s1 = appCatalogo.listen(PORT_CATALOGO);
    const s2 = appDetalhes.listen(PORT_DETALHES);
    const s3 = appGateway.listen(PORT_GATEWAY);
    servers = [s1, s2, s3];
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
  console.log('🧪 INICIANDO TESTES DO SISTEMA POKÉDEX EXPLORER (POKÉAPI v2)');
  console.log('='.repeat(75) + '\n');

  try {
    await iniciarServidoresSeNecessario();

    // -------------------------------------------------------------
    // Arquitetura: Microsserviços e Gateway Online
    // -------------------------------------------------------------
    console.log('📌 [Arquitetura] Verificação de Portas e Saúde dos Serviços...');
    const sc = await getJSON(`http://localhost:${PORT_CATALOGO}/status`);
    assercao('Microsserviço de Catálogo ativo na porta 5051', sc.status === 200 && sc.data.status === 'online');

    const sd = await getJSON(`http://localhost:${PORT_DETALHES}/status`);
    assercao('Microsserviço de Detalhes ativo na porta 5052', sd.status === 200 && sd.data.status === 'online');

    const sg = await getJSON(`http://localhost:${PORT_GATEWAY}/api/status`);
    assercao('API Gateway ativo na porta 5050 com orquestração operacional', sg.status === 200 && sg.data.statusGeral === 'operacional');

    // -------------------------------------------------------------
    // Cenário 01: Busca e Apresentação (Atividades 1 a 10)
    // -------------------------------------------------------------
    console.log('\n📌 [Cenário 01] Busca e Apresentação dos Dados...');
    const resPikachuNome = await getJSON(`http://localhost:${PORT_GATEWAY}/api/pokemon/pikachu`);
    assercao('Busca por nome válido ("pikachu") retorna HTTP 200', resPikachuNome.status === 200 && resPikachuNome.data.sucesso);
    assercao('ID e número formatado (#025) corretos', resPikachuNome.data.id === 25 && resPikachuNome.data.numeroFormatado === '#025');

    const resPikachuId = await getJSON(`http://localhost:${PORT_GATEWAY}/api/pokemon/25`);
    assercao('Busca por número de identificação ("25") retorna o mesmo Pokémon', resPikachuId.status === 200 && resPikachuId.data.nome === 'pikachu');

    const dPika = resPikachuNome.data;
    assercao('Imagem oficial (official artwork) presente', Boolean(dPika.imagens?.oficial));
    assercao('Tipos presentes com tradução em português (Elétrico)', dPika.tipos?.some(t => t.nome === 'Elétrico'));
    assercao('Lista de habilidades presentes', Array.isArray(dPika.habilidades) && dPika.habilidades.length > 0);
    assercao('Conversão de altura correta em metros (0.4 m)', dPika.medidas?.alturaMetros === 0.4);
    assercao('Conversão de peso correta em kg (6.0 kg)', dPika.medidas?.pesoKg === 6.0);
    assercao('As 6 barras de atributos presentes com total calculado', Array.isArray(dPika.estatisticas) && dPika.estatisticas.length === 6 && dPika.totalEstatisticas > 0);

    // -------------------------------------------------------------
    // Cenário 02: Catálogo e Filtros (Atividades 11 e 12)
    // -------------------------------------------------------------
    console.log('\n📌 [Cenário 02] Catálogo Paginado e Filtros por Tipo...');
    const resCat = await getJSON(`http://localhost:${PORT_GATEWAY}/api/catalogo?pagina=1&limite=12`);
    assercao('Catálogo geral retorna exatamente 12 itens na página 1', resCat.status === 200 && resCat.data.resultados?.length === 12);
    assercao('Informações de total de páginas presentes na paginação', resCat.data.totalPaginas > 0 && resCat.data.pagina === 1);

    const resFogo = await getJSON(`http://localhost:${PORT_GATEWAY}/api/catalogo?pagina=1&limite=12&tipo=fire`);
    assercao('Filtro por tipo "fire" (Fogo) retorna Pokémon de fogo', resFogo.status === 200 && resFogo.data.tipoFiltro === 'fire' && resFogo.data.resultados.length > 0);
    assercao('Primeiro card do filtro de fogo possui tipo Fogo', resFogo.data.resultados[0]?.tipos?.some(t => t.nome === 'Fogo'));

    const resAgua = await getJSON(`http://localhost:${PORT_GATEWAY}/api/catalogo?pagina=1&limite=12&tipo=water`);
    assercao('Filtro por tipo "water" (Água) retorna lista de água', resAgua.status === 200 && resAgua.data.tipoFiltro === 'water');

    // -------------------------------------------------------------
    // Cenário 03: Erros e Disponibilidade (Atividade 14)
    // -------------------------------------------------------------
    console.log('\n📌 [Cenário 03] Tratamento de Erros e Casos Limite...');
    const res404 = await getJSON(`http://localhost:${PORT_GATEWAY}/api/pokemon/pokemonQueNaoExisteXYZ999`);
    assercao('Pokémon inexistente devolve status HTTP 404 Not Found', res404.status === 404 && Boolean(res404.data.erro));

    const resTipoInvalido = await getJSON(`http://localhost:${PORT_CATALOGO}/catalogo?tipo=tipoTotalmenteInvalido99`);
    assercao('Tipo inválido de catálogo tratado adequadamente', resTipoInvalido.status === 404 && Boolean(resTipoInvalido.data.erro));

    // -------------------------------------------------------------
    // Cenário 04: Estado, Comparador, Espécie e Evoluções (Atividades 13, 15, 16, 17)
    // -------------------------------------------------------------
    console.log('\n📌 [Cenário 04] Recursos Avançados, Comparação e Evolução...');
    const resRand = await getJSON(`http://localhost:${PORT_GATEWAY}/api/aleatorio`);
    assercao('Endpoint de sorteio (/api/aleatorio) retorna um Pokémon válido', resRand.status === 200 && resRand.data.id >= 1 && resRand.data.id <= 1025);

    const resComp = await getJSON(`http://localhost:${PORT_GATEWAY}/api/comparar?p1=pikachu&p2=raichu`);
    assercao('Comparação lado a lado entre Pikachu e Raichu retorna comparativo completo', 
      resComp.status === 200 &&
      resComp.data.comparativo?.maiorTotal === 'Raichu' &&
      Array.isArray(resComp.data.comparativo?.estatisticas)
    );

    const resChar = await getJSON(`http://localhost:${PORT_GATEWAY}/api/pokemon/charizard`);
    assercao('Dados de espécie e descrição presentes (Charizard)', Boolean(resChar.data.especie?.descricao));
    assercao('Cadeia evolutiva completa retornada com múltiplos estágios', 
      Array.isArray(resChar.data.especie?.cadeiaEvolutiva) && 
      resChar.data.especie.cadeiaEvolutiva.length >= 3
    );

    console.log('\n' + '='.repeat(75));
    console.log(`📊 RESULTADO DOS TESTES: ${aprovados}/${totalTestes} APROVADOS (${falhas} FALHAS)`);
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
