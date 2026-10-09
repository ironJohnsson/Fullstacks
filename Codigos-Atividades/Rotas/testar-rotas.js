// Script para testar automaticamente todos os endpoints da API de Livros
// e registrar método, URL, corpo enviado, status e resposta recebida
const http = require('http');

const PORTA = 3000;
const BASE_URL = 'http://localhost:3000';

function checarServidor() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, () => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function fazerRequisicao(metodo, caminho, corpo = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(caminho, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = data;
        try { json = JSON.parse(data); } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json
        });
      });
    });

    req.on('error', reject);

    if (corpo) {
      req.write(JSON.stringify(corpo));
    }
    req.end();
  });
}

async function executarBateriaTestes() {
  console.log('=====================================================');
  console.log('   BATERIA DE TESTES - ATIVIDADE PRÁTICA (API LIVROS)');
  console.log('=====================================================');

  const servidorAtivo = await checarServidor();
  if (!servidorAtivo) {
    console.log('\n[INFO] Servidor não estava rodando na porta 3000.');
    console.log('[INFO] Inicializando a API automaticamente para os testes...\n');
    require('./server');
    await new Promise(r => setTimeout(r, 800));
  } else {
    console.log('\n[INFO] Conectado ao servidor já em execução na porta 3000.\n');
  }

  const testes = [
    {
      nome: '1. GET /livros - Listar livros iniciais',
      metodo: 'GET',
      url: '/livros',
      corpo: null
    },
    {
      nome: '2. GET /livros/2 - Consultar livro existente (id=2)',
      metodo: 'GET',
      url: '/livros/2',
      corpo: null
    },
    {
      nome: '3. GET /livros/99 - Consultar livro inexistente (esperado 404)',
      metodo: 'GET',
      url: '/livros/99',
      corpo: null
    },
    {
      nome: '4. POST /livros - Cadastrar novo livro válido (esperado 201)',
      metodo: 'POST',
      url: '/livros',
      corpo: { titulo: 'Clean Code', autor: 'Robert C. Martin' }
    },
    {
      nome: '5. POST /livros - Tentar cadastrar livro sem autor (esperado 400)',
      metodo: 'POST',
      url: '/livros',
      corpo: { titulo: 'Livro Sem Autor' }
    },
    {
      nome: '6. PUT /livros/1 - Atualizar título do livro 1 (esperado 200)',
      metodo: 'PUT',
      url: '/livros/1',
      corpo: { titulo: 'O Senhor dos Anéis: A Sociedade do Anel' }
    },
    {
      nome: '7. PUT /livros/99 - Tentar atualizar livro inexistente (esperado 404)',
      metodo: 'PUT',
      url: '/livros/99',
      corpo: { titulo: 'Livro Fantasma' }
    },
    {
      nome: '8. GET /buscar?termo=george - Buscar livro por autor (esperado 1984)',
      metodo: 'GET',
      url: '/buscar?termo=george',
      corpo: null
    },
    {
      nome: '9. DELETE /livros/2 - Excluir livro (id=2) (esperado 204)',
      metodo: 'DELETE',
      url: '/livros/2',
      corpo: null
    },
    {
      nome: '10. DELETE /livros/2 - Tentar excluir novamente livro já removido (esperado 404)',
      metodo: 'DELETE',
      url: '/livros/2',
      corpo: null
    },
    {
      nome: '11. GET /livros - Listar livros após as alterações',
      metodo: 'GET',
      url: '/livros',
      corpo: null
    }
  ];

  let sucessos = 0;

  for (const t of testes) {
    console.log(`[TESTE] ${t.nome}`);
    console.log(`  > Requisição: ${t.metodo} ${t.url}`);
    if (t.corpo) {
      console.log(`  > Corpo enviado: ${JSON.stringify(t.corpo)}`);
    }
    try {
      const resp = await fazerRequisicao(t.metodo, t.url, t.corpo);
      console.log(`  < Status retornado: ${resp.status}`);
      console.log(`  < Resposta recebida: ${JSON.stringify(resp.data)}\n`);
      sucessos++;
    } catch (e) {
      console.log(`  < Erro de conexão: ${e.message}\n`);
    }
  }

  console.log('=====================================================');
  console.log(`   FIM DA BATERIA: ${sucessos}/${testes.length} TESTES EXECUTADOS COM SUCESSO`);
  console.log('=====================================================');

  process.exit(0);
}

executarBateriaTestes();
