// 6 e 7. Servidor HTTP nativo do Node.js com rotas manuais
const http = require('node:http');

const PORTA = 3000;

const servidor = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    return res.end('Página inicial');
  }

  if (req.method === 'GET' && req.url === '/sobre') {
    res.statusCode = 200;
    return res.end('API de demonstração da turma');
  }

  res.statusCode = 404;
  res.end('Rota não encontrada');
});

servidor.listen(PORTA, () => {
  console.log(`Servidor nativo disponível em http://localhost:${PORTA}`);
});
