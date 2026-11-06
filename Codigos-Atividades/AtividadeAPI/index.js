// Orquestrador Central dos Microsserviços
require('dotenv').config();
const http = require('http');

const servicos = [
  { nome: 'API Gateway', app: require('./gateway/server'), porta: process.env.PORT_GATEWAY || 4000 },
  { nome: 'Serviço de Produtos', app: require('./servico-produtos/server'), porta: process.env.PORT_PRODUTOS || 4001 },
  { nome: 'Serviço de Endereços', app: require('./servico-enderecos/server'), porta: process.env.PORT_ENDERECOS || 4002 },
  { nome: 'Serviço de Usuários', app: require('./servico-usuarios/server'), porta: process.env.PORT_USUARIOS || 4003 },
  { nome: 'Serviço de Tarefas', app: require('./servico-tarefas/server'), porta: process.env.PORT_TAREFAS || 4004 },
  { nome: 'Serviço de Clima', app: require('./servico-clima/server'), porta: process.env.PORT_CLIMA || 4005 },
  { nome: 'Serviço de Pokémon', app: require('./servico-pokemon/server'), porta: process.env.PORT_POKEMON || 4006 },
  { nome: 'Serviço de Pedidos', app: require('./servico-pedidos/server'), porta: process.env.PORT_PEDIDOS || 4007 }
];

console.log('=====================================================');
console.log('   INICIANDO LABORATÓRIO DE MICROSSERVIÇOS');
console.log('=====================================================');

const servidores = [];

servicos.forEach(s => {
  try {
    const server = s.app.listen(s.porta, () => {
      console.log(`✓ [${s.nome}] ativo em http://localhost:${s.porta}`);
    });
    servidores.push(server);
  } catch (err) {
    console.error(`✗ Falha ao iniciar ${s.nome} na porta ${s.porta}:`, err.message);
  }
});

console.log('\nTodos os microsserviços foram inicializados com sucesso!');
console.log('Acesse o API Gateway em: http://localhost:4000\n');

module.exports = { servidores };
