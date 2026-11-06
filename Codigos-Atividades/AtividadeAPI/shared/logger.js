// Middleware de Logs e Observabilidade (Atividade 19)
const crypto = require('crypto');

function criarLogger(nomeServico) {
  return function loggerMiddleware(req, res, next) {
    const inicio = Date.now();
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const duracao = Date.now() - inicio;
      const logInfo = {
        servico: nomeServico,
        timestamp: new Date().toISOString(),
        requestId,
        metodo: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duracaoMs: duracao
      };
      console.log(`[${logInfo.timestamp}] [${logInfo.servico}] [${logInfo.requestId.slice(0, 8)}] ${logInfo.metodo} ${logInfo.url} -> ${logInfo.status} (${logInfo.duracaoMs}ms)`);
    });

    next();
  };
}

module.exports = { criarLogger };
