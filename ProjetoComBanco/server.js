// server.js
const express = require('express');
const path = require('path');
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Informe nome e e-mail.' });
  }

  try {
    const sql = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';
    const [resultado] = await pool.execute(sql, [nome, email]);
    res.status(201).json({ id: resultado.insertId, nome, email });
  } catch (erro) {
    res.status(500).json({ erro: 'Não foi possível cadastrar.' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const [usuarios] = await pool.execute(
      'SELECT id, nome, email, criado_em FROM usuarios ORDER BY id DESC'
    );
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Não foi possível consultar.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
