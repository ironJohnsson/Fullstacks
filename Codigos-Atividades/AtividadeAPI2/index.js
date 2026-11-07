// Inicializador Unificado dos Microsserviços e API Gateway
// Inicia todos os 3 serviços em portas independentes para desenvolvimento e demonstração
require('dotenv').config();

const appCidades = require('./servico-cidades/server');
const appClima = require('./servico-clima/server');
const appGateway = require('./gateway/server');

const PORT_CIDADES = process.env.PORT_CIDADES || 5001;
const PORT_CLIMA = process.env.PORT_CLIMA || 5002;
const PORT_GATEWAY = process.env.PORT_GATEWAY || 5000;

console.log('='.repeat(70));
console.log('  🌤️  SISTEMA DE MONITORAMENTO METEOROLÓGICO - ARQUITETURA DISTRIBUÍDA');
console.log('='.repeat(70));
console.log('Iniciando microsserviços em portas independentes...\n');

let servers = [];

function start() {
  const sCidades = appCidades.listen(PORT_CIDADES, () => {
    console.log(`  [1/3] 📍 Microsserviço de Cidades ativo em: http://localhost:${PORT_CIDADES}`);
  });

  const sClima = appClima.listen(PORT_CLIMA, () => {
    console.log(`  [2/3] 🌡️  Microsserviço de Clima ativo em:   http://localhost:${PORT_CLIMA}`);
  });

  const sGateway = appGateway.listen(PORT_GATEWAY, () => {
    console.log(`  [3/3] 🚀 API Gateway & Frontend ativo em:    http://localhost:${PORT_GATEWAY}`);
    console.log('\n' + '-'.repeat(70));
    console.log('  👉 Abra seu navegador em: http://localhost:' + PORT_GATEWAY);
    console.log('  👉 Para rodar a bateria de testes automatizados: npm run testar');
    console.log('-'.repeat(70) + '\n');
  });

  servers = [sCidades, sClima, sGateway];
}

function encerrar() {
  console.log('\nEncerrando todos os serviços...');
  servers.forEach(s => s.close());
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);

start();
