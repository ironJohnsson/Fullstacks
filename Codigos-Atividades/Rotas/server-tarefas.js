// 9 e 11. API de Tarefas com Express
const express = require('express');
const app = express();
const PORTA = 3000;

app.use(express.json());

let proximoId = 3;
let tarefas = [
  { id: 1, titulo: 'Estudar Node.js', concluida: false },
  { id: 2, titulo: 'Criar uma rota', concluida: true }
];

// Rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de tarefas no ar' });
});

// GET /tarefas - Listar tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});

// GET /buscar?termo=... - Busca por query string
app.get('/buscar', (req, res) => {
  const termo = String(req.query.termo || '').toLowerCase();
  const resultado = tarefas.filter(t =>
    t.titulo.toLowerCase().includes(termo)
  );
  res.json(resultado);
});

// GET /tarefas/:id - Consultar uma tarefa
app.get('/tarefas/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find(item => item.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.json(tarefa);
});

// POST /tarefas - Criar tarefa
app.post('/tarefas', (req, res) => {
  const { titulo } = req.body;

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ erro: 'Informe um título válido' });
  }

  const novaTarefa = {
    id: proximoId++,
    titulo: titulo.trim(),
    concluida: false
  };

  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// PUT /tarefas/:id - Atualizar tarefa
app.put('/tarefas/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find(item => item.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  const { titulo, concluida } = req.body;

  if (typeof titulo === 'string' && titulo.trim()) {
    tarefa.titulo = titulo.trim();
  }
  if (typeof concluida === 'boolean') {
    tarefa.concluida = concluida;
  }

  res.json(tarefa);
});

// DELETE /tarefas/:id - Remover tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = Number(req.params.id);
  const quantidadeAntes = tarefas.length;
  tarefas = tarefas.filter(item => item.id !== id);

  if (tarefas.length === quantidadeAntes) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.status(204).end();
});

app.listen(PORTA, () => {
  console.log(`API de tarefas ativa em http://localhost:${PORTA}`);
});
