// Servico de Endereços (Porta 4002) - Atividade 7
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { criarLogger } = require('../shared/logger');

const app = express();
const PORT = process.env.PORT_ENDERECOS || 4002;

app.use(cors());
app.use(express.json());
app.use(criarLogger('servico-enderecos'));

app.get('/status', (req, res) => {
  res.json({ servico: 'servico-enderecos', versao: '1.0.0', status: 'online' });
});

// GET /enderecos/:cep
app.get('/enderecos/:cep', async (req, res) => {
  const cepLimpo = String(req.params.cep || '').replace(/\D/g, '');

  // Validação: exatamente 8 dígitos numéricos
  if (!/^\d{8}$/.test(cepLimpo)) {
    return res.status(400).json({ erro: 'CEP deve conter exatamente 8 dígitos numéricos.' });
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!resposta.ok) {
      throw new Error(`Falha na API ViaCEP (status ${resposta.status})`);
    }

    const dados = await resposta.json();

    if (dados.erro === true || dados.erro === 'true') {
      return res.status(404).json({ erro: 'CEP não encontrado' });
    }

    res.status(200).json({
      cep: dados.cep,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      uf: dados.uf
    });
  } catch (erro) {
    console.error('[servico-enderecos] Erro ao consultar ViaCEP:', erro.message);
    res.status(502).json({ erro: 'Serviço externo ViaCEP indisponível' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[servico-enderecos] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
