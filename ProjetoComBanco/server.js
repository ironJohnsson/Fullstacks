// server.js
const express = require('express');
const path = require('path');
const { oracledb, initPool, getConnection } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para cadastrar usuário no Oracle
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Informe nome e e-mail.' });
  }

  let connection;
  try {
    connection = await getConnection();
    const sql = `
      INSERT INTO usuarios (nome, email)
      VALUES (:nome, :email)
      RETURNING id INTO :id
    `;

    const resultado = await connection.execute(
      sql,
      {
        nome,
        email,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    const id = resultado.outBinds.id[0];
    res.status(201).json({ id, nome, email });
  } catch (erro) {
    console.error('Erro ao cadastrar no Oracle:', erro);
    res.status(500).json({ erro: 'Não foi possível cadastrar.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error('Erro ao fechar conexão:', e);
      }
    }
  }
});

// Rota para consultar usuários no Oracle
app.get('/usuarios', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    // Usamos alias com aspas duplas ("id", "nome", "email", "criado_em")
    // para retornar em minúsculas e manter compatibilidade total com o script.js do frontend
    const sql = `
      SELECT id AS "id", nome AS "nome", email AS "email", criado_em AS "criado_em"
      FROM usuarios
      ORDER BY id DESC
    `;
    const resultado = await connection.execute(sql);
    res.json(resultado.rows || []);
  } catch (erro) {
    console.error('Erro ao consultar no Oracle:', erro);
    res.status(500).json({ erro: 'Não foi possível consultar.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error('Erro ao fechar conexão:', e);
      }
    }
  }
});

async function startServer() {
  try {
    await initPool();
    console.log('Pool de conexões Oracle criado com sucesso.');
  } catch (err) {
    console.warn('Aviso: Falha ao inicializar pool Oracle na inicialização:', err.message);
    console.warn('Verifique suas credenciais em .env e se o listener do Oracle está ativo.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
  });
}

startServer();
