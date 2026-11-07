// Inicializador Unificado dos Microsserviços e API Gateway - AtividadeAPI3
// Inicia todos os 3 serviços em portas independentes para desenvolvimento e demonstração
require('dotenv').config();

const appCatalogo = require('./servico-catalogo/server');
const appDetalhes = require('./servico-detalhes/server');
const appGateway = require('./gateway/server');

const PORT_CATALOGO = process.env.PORT_CATALOGO || 5051;
const PORT_DETALHES = process.env.PORT_DETALHES || 5052;
const PORT_GATEWAY = process.env.PORT_GATEWAY || 5050;

console.log('='.repeat(70));
console.log('  🔴  POKÉDEX EXPLORER - ARQUITETURA DE MICROSSERVIÇOS & API GATEWAY');
console.log('='.repeat(70));
console.log('Iniciando microsserviços em portas independentes...\n');

let servers = [];

function start() {
  const sCatalogo = appCatalogo.listen(PORT_CATALOGO, () => {
    console.log(`  [1/3] 📖 Microsserviço de Catálogo ativo em: http://localhost:${PORT_CATALOGO}`);
  });

  const sDetalhes = appDetalhes.listen(PORT_DETALHES, () => {
    console.log(`  [2/3] 🔍 Microsserviço de Detalhes ativo em: http://localhost:${PORT_DETALHES}`);
  });

  const sGateway = appGateway.listen(PORT_GATEWAY, () => {
    console.log(`  [3/3] 🚀 API Gateway & Pokédex SPA ativa em: http://localhost:${PORT_GATEWAY}`);
    console.log('\n' + '-'.repeat(70));
    console.log('  👉 Abra seu navegador em: http://localhost:' + PORT_GATEWAY);
    console.log('  👉 Para rodar a bateria de testes automatizados: npm run testar');
    console.log('-'.repeat(70) + '\n');
  });

  servers = [sCatalogo, sDetalhes, sGateway];
}

function encerrar() {
  console.log('\nEncerrando todos os serviços da Pokédex...');
  servers.forEach(s => s.close());
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);

start();
