// 14. Atividade prática avaliada para os alunos: API de Livros
const express = require('express');
const app = express();
const PORTA = process.env.PORT || 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Dados em memória para os livros
let proximoId = 4;
let livros = [
  { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien' },
  { id: 2, titulo: '1984', autor: 'George Orwell' },
  { id: 3, titulo: 'Dom Casmurro', autor: 'Machado de Assis' }
];

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Livros no ar com sucesso!',
    endpoints: [
      'GET /livros',
      'GET /livros/:id',
      'GET /buscar?termo=...',
      'POST /livros',
      'PUT /livros/:id',
      'DELETE /livros/:id'
    ]
  });
});

// 1. GET /livros - Listar todos os livros
app.get('/livros', (req, res) => {
  res.status(200).json(livros);
});

// 2. GET /buscar?termo=... - Buscar por título ou autor via query string
app.get('/buscar', (req, res) => {
  const termo = String(req.query.termo || '').toLowerCase().trim();

  if (!termo) {
    return res.status(200).json(livros);
  }

  const resultado = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(termo) ||
    livro.autor.toLowerCase().includes(termo)
  );

  res.status(200).json(resultado);
});

// 3. GET /livros/:id - Consultar um livro por ID
app.get('/livros/:id', (req, res) => {
  const id = Number(req.params.id);
  const livro = livros.find(item => item.id === id);

  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado' });
  }

  res.status(200).json(livro);
});

// 4. POST /livros - Criar livro (valida se titulo e autor foram informados)
app.post('/livros', (req, res) => {
  const { titulo, autor } = req.body;

  // Validação: ambos os campos são obrigatórios
  if (!titulo || !titulo.trim() || !autor || !autor.trim()) {
    return res.status(400).json({
      erro: 'Informe título e autor válidos para cadastrar o livro.'
    });
  }

  const novoLivro = {
    id: proximoId++,
    titulo: titulo.trim(),
    autor: autor.trim()
  };

  livros.push(novoLivro);
  res.status(201).json(novoLivro);
});

// 5. PUT /livros/:id - Atualizar título ou autor
app.put('/livros/:id', (req, res) => {
  const id = Number(req.params.id);
  const livro = livros.find(item => item.id === id);

  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado' });
  }

  const { titulo, autor } = req.body;

  let atualizou = false;

  if (typeof titulo === 'string' && titulo.trim()) {
    livro.titulo = titulo.trim();
    atualizou = true;
  }

  if (typeof autor === 'string' && autor.trim()) {
    livro.autor = autor.trim();
    atualizou = true;
  }

  if (!atualizou) {
    return res.status(400).json({
      erro: 'Envie pelo menos um campo (titulo ou autor) para atualizar.'
    });
  }

  res.status(200).json(livro);
});

// 6. DELETE /livros/:id - Remover livro pelo ID
app.delete('/livros/:id', (req, res) => {
  const id = Number(req.params.id);
  const quantidadeAntes = livros.length;

  livros = livros.filter(item => item.id !== id);

  if (livros.length === quantidadeAntes) {
    return res.status(404).json({ erro: 'Livro não encontrado' });
  }

  // 204 No Content para remoção com sucesso
  res.status(204).end();
});

// Inicia o servidor
app.listen(PORTA, () => {
  console.log(`Servidor da API de Livros ativo em http://localhost:${PORTA}`);
});

module.exports = app;
