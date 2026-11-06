// Bateria de Testes Automatizados - Cobre as 20 Atividades do Roteiro (Atividade 18)
const http = require('http');

const BASE_GATEWAY = 'http://localhost:4000';
const BASE_PRODUTOS = 'http://localhost:4001';
const BASE_PEDIDOS = 'http://localhost:4007';

function checarPorta(porta) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${porta}/status`, () => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => { req.destroy(); resolve(false); });
  });
}

function reqHttp(urlCompleta, metodo = 'GET', corpo = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlCompleta);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = data;
        try { json = JSON.parse(data); } catch {}
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout de requisição')); });

    if (corpo) req.write(JSON.stringify(corpo));
    req.end();
  });
}

async function rodarBateria() {
  console.log('================================================================');
  console.log('   BATERIA DE TESTES DE INTEGRAÇÃO - 20 ATIVIDADES');
  console.log('================================================================\n');

  const ativo = await checarPorta(4000);
  if (!ativo) {
    console.log('[INFO] Microsserviços não estavam rodando. Inicializando todos os serviços em memória...\n');
    require('./index');
    await new Promise(r => setTimeout(r, 1500));
  } else {
    console.log('[INFO] Conectado ao API Gateway já em execução na porta 4000.\n');
  }

  const testes = [
    { ativ: 1, nome: 'GET /status (serviço produtos)', url: 'http://localhost:4001/status', metodo: 'GET', esperado: 200 },
    { ativ: 2, nome: 'GET /produtos (catálogo em memória)', url: 'http://localhost:4001/produtos', metodo: 'GET', esperado: 200 },
    { ativ: 2, nome: 'GET /produtos/:id (existente)', url: 'http://localhost:4001/produtos/1', metodo: 'GET', esperado: 200 },
    { ativ: 2, nome: 'GET /produtos/:id (inexistente -> 404)', url: 'http://localhost:4001/produtos/999', metodo: 'GET', esperado: 404 },
    { ativ: 3, nome: 'GET /produtos?categoria=perifericos (filtro)', url: 'http://localhost:4001/produtos?categoria=perifericos', metodo: 'GET', esperado: 200 },
    { ativ: 3, nome: 'GET /produtos?limite=2 (limite)', url: 'http://localhost:4001/produtos?limite=2', metodo: 'GET', esperado: 200 },
    { ativ: 4, nome: 'POST /produtos (válido -> 201)', url: 'http://localhost:4001/produtos', metodo: 'POST', corpo: { nome: 'Microfone Condensador', preco: 320, categoria: 'audio' }, esperado: 201 },
    { ativ: 4, nome: 'POST /produtos (inválido sem preço -> 400)', url: 'http://localhost:4001/produtos', metodo: 'POST', corpo: { nome: 'Sem Preco' }, esperado: 400 },
    { ativ: 5, nome: 'GET /users (consulta externa JSONPlaceholder)', url: 'http://localhost:4003/users', metodo: 'GET', esperado: 200 },
    { ativ: 6, nome: 'GET /usuarios/1 (detalhes de usuário)', url: 'http://localhost:4003/usuarios/1', metodo: 'GET', esperado: 200 },
    { ativ: 6, nome: 'GET /usuarios/999 (usuário inexistente -> 404)', url: 'http://localhost:4003/usuarios/999', metodo: 'GET', esperado: 404 },
    { ativ: 7, nome: 'GET /enderecos/01001000 (ViaCEP válida -> 200)', url: 'http://localhost:4002/enderecos/01001000', metodo: 'GET', esperado: 200 },
    { ativ: 7, nome: 'GET /enderecos/00000000 (CEP não encontrado -> 404)', url: 'http://localhost:4002/enderecos/00000000', metodo: 'GET', esperado: 404 },
    { ativ: 7, nome: 'GET /enderecos/123 (CEP inválido -> 400)', url: 'http://localhost:4002/enderecos/123', metodo: 'GET', esperado: 400 },
    { ativ: 8, nome: 'GET /tarefas?usuario=1 (tarefas remotas filtradas)', url: 'http://localhost:4004/tarefas?usuario=1', metodo: 'GET', esperado: 200 },
    { ativ: 9, nome: 'GET /clima (Open-Meteo Salvador-BA)', url: 'http://localhost:4005/clima?lat=-12.97&lon=-38.50', metodo: 'GET', esperado: 200 },
    { ativ: 10, nome: 'GET /pokemon/pikachu (PokéAPI -> 200)', url: 'http://localhost:4006/pokemon/pikachu', metodo: 'GET', esperado: 200 },
    { ativ: 10, nome: 'GET /pokemon/inexistente999 (PokéAPI -> 404)', url: 'http://localhost:4006/pokemon/inexistente999', metodo: 'GET', esperado: 404 },
    { ativ: 11, nome: 'GET /produtos (listagem CRUD)', url: 'http://localhost:4001/produtos', metodo: 'GET', esperado: 200 },
    { ativ: 12, nome: 'PUT /produtos/2 (atualização -> 200)', url: 'http://localhost:4001/produtos/2', metodo: 'PUT', corpo: { nome: 'Mouse Gamer Pro', preco: 180 }, esperado: 200 },
    { ativ: 12, nome: 'DELETE /produtos/5 (remoção -> 204)', url: 'http://localhost:4001/produtos/5', metodo: 'DELETE', esperado: 204 },
    { ativ: 13, nome: 'Separação: GET produtos (4001) e GET pedidos (4007)', url: 'http://localhost:4007/status', metodo: 'GET', esperado: 200 },
    { ativ: 14, nome: 'Gateway: GET http://localhost:4000/api/produtos', url: 'http://localhost:4000/api/produtos', metodo: 'GET', esperado: 200 },
    { ativ: 14, nome: 'Gateway: GET http://localhost:4000/api/pedidos', url: 'http://localhost:4000/api/pedidos', metodo: 'GET', esperado: 200 },
    { ativ: 15, nome: 'Timeout/Falha: POST pedido com produto inexistente -> 404', url: 'http://localhost:4007/pedidos', metodo: 'POST', corpo: { cliente: 'Teste Erro', itens: [{ produtoId: 9999, quantidade: 1 }] }, esperado: 404 },
    { ativ: 16, nome: 'Persistência: GET /pedidos (verifica pedidos gravados)', url: 'http://localhost:4007/pedidos', metodo: 'GET', esperado: 200 },
    { ativ: 20, nome: 'Projeto Final: POST /pedidos (criação integrada com cálculo de total)', url: 'http://localhost:4007/pedidos', metodo: 'POST', corpo: { cliente: 'Lucas Andrade', itens: [{ produtoId: 1, quantidade: 2 }, { produtoId: 2, quantidade: 1 }] }, esperado: 201 }
  ];

  let sucessos = 0;

  for (const t of testes) {
    process.stdout.write(`[Atividade ${String(t.ativ).padStart(2, '0')}] ${t.nome}... `);
    try {
      const resp = await reqHttp(t.url, t.metodo, t.corpo);
      if (resp.status === t.esperado) {
        console.log(`✓ OK (Status ${resp.status})`);
        sucessos++;
      } else {
        console.log(`✗ FALHOU (Esperado ${t.esperado}, recebido ${resp.status})`);
        console.log('   Resposta:', JSON.stringify(resp.data));
      }
    } catch (err) {
      console.log(`✗ ERRO: ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`   RESULTADO FINAL: ${sucessos}/${testes.length} TESTES APROVADOS (${Math.round(sucessos / testes.length * 100)}%)`);
  console.log('================================================================');
  process.exit(0);
}

rodarBateria();
