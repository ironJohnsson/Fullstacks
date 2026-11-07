// Middleware compartilhado de logs e observabilidade (Atividade 19 / Requisitos)
function criarLogger(nomeServico) {
  return (req, res, next) => {
    const inicio = Date.now();
    const requestId = Math.random().toString(36).substring(2, 9).toUpperCase();

    res.on('finish', () => {
      const duracao = Date.now() - inicio;
      const timestamp = new Date().toISOString();
      const metodo = req.method;
      const rota = req.originalUrl || req.url;
      const status = res.statusCode;

      console.log(
        `[${timestamp}] [${nomeServico}] [REQ-${requestId}] ${metodo} ${rota} - Status: ${status} (${duracao}ms)`
      );
    });

    next();
  };
}

module.exports = { criarLogger };
