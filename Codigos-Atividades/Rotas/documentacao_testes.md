# Documentação da Aula de Back-End: Node.js, Servidores e Rotas

**Professor:** Celso Barreto  
**Disciplina:** Desenvolvimento Back-End  
**Produto:** API de Livros e API de Tarefas em Node.js com Express  

---

## 1. Estrutura do Projeto

```
Rotas/
├── app.js               # Primeiro script Node.js (Seção 4)
├── server-nativo.js     # Servidor HTTP com módulo nativo http (Seções 6 e 7)
├── server-tarefas.js    # API de Tarefas desenvolvida em aula (Seções 9 e 11)
├── server.js            # API de Livros (Atividade prática avaliada da Seção 14)
├── testar-rotas.js      # Script de teste automatizado de todos os endpoints
├── package.json         # Manifesto npm com dependências (express, nodemon)
└── documentacao_testes.md # Relatório técnico e evidências de teste
```

---

## 2. Endpoints da API de Livros (Seção 14)

| Método | Rota | Descrição | Status Sucesso | Status Erro |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/livros` | Lista todos os livros cadastrados | `200 OK` | — |
| **GET** | `/livros/:id` | Consulta os dados de um livro pelo ID | `200 OK` | `404 Not Found` |
| **GET** | `/buscar?termo=...` | Busca livros por título ou autor via query string | `200 OK` | — |
| **POST** | `/livros` | Cadastra novo livro (requer `titulo` e `autor`) | `201 Created` | `400 Bad Request` |
| **PUT** | `/livros/:id` | Atualiza o título e/ou autor do livro | `200 OK` | `404 Not Found` / `400 Bad Request` |
| **DELETE** | `/livros/:id` | Remove o livro do sistema | `204 No Content` | `404 Not Found` |

---

## 3. Registro dos Testes Realizados (Evidências)

| Teste | Método | URL | Corpo Enviado | Status | Resposta Recebida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Listar todos** | `GET` | `/livros` | *(nenhum)* | `200` | `[{"id":1,"titulo":"O Senhor dos Anéis","autor":"J.R.R. Tolkien"}, ...]` |
| **Consultar por ID** | `GET` | `/livros/2` | *(nenhum)* | `200` | `{"id":2,"titulo":"1984","autor":"George Orwell"}` |
| **ID Inexistente** | `GET` | `/livros/99` | *(nenhum)* | `404` | `{"erro":"Livro não encontrado"}` |
| **Criar Válido** | `POST` | `/livros` | `{"titulo":"Clean Code","autor":"Robert C. Martin"}` | `201` | `{"id":4,"titulo":"Clean Code","autor":"Robert C. Martin"}` |
| **Criar Inválido** | `POST` | `/livros` | `{"titulo":"Sem Autor"}` | `400` | `{"erro":"Informe título e autor válidos para cadastrar o livro."}` |
| **Atualizar Livro**| `PUT` | `/livros/1` | `{"titulo":"O Senhor dos Anéis: A Sociedade do Anel"}` | `200` | `{"id":1,"titulo":"O Senhor dos Anéis: A Sociedade do Anel","autor":"J.R.R. Tolkien"}` |
| **Atualizar Inexistente**| `PUT` | `/livros/99` | `{"titulo":"Fantasma"}` | `404` | `{"erro":"Livro não encontrado"}` |
| **Buscar por Termo**| `GET` | `/buscar?termo=george` | *(nenhum)* | `200` | `[{"id":2,"titulo":"1984","autor":"George Orwell"}]` |
| **Excluir Livro** | `DELETE` | `/livros/2` | *(nenhum)* | `204` | *(vazio / No Content)* |
| **Excluir Já Removido** | `DELETE` | `/livros/2` | *(nenhum)* | `404` | `{"erro":"Livro não encontrado"}` |

---

## 4. Respostas às Perguntas de Checagem (Seção 11 e 15)

1. **O que faz o `listen`?**
   O método `listen(PORTA)` inicia o processo do servidor e coloca-o em estado de escuta passiva, aguardando conexões e requisições HTTP que cheguem na porta de rede informada (ex: 3000).

2. **Como o servidor sabe qual rota executar?**
   O servidor analisa a combinação de **Método HTTP** (`GET`, `POST`, `PUT`, `DELETE`) e **Caminho da URL** (`/`, `/livros`, `/buscar`) presentes no cabeçalho da requisição. O Express faz o casamento (*matching*) dessa combinação com as funções de rota declaradas no código.

3. **Qual a diferença entre `req.params` e `req.query`?**
   * **`req.params`**: Representa parâmetros nomeados diretamente no caminho da URL (ex.: `/livros/:id` -> `/livros/15`, acessado como `req.params.id`). Usado tipicamente para identificar um recurso específico.
   * **`req.query`**: Representa parâmetros opcionais passados na *query string* após o `?` (ex.: `/buscar?termo=node&ordem=asc`, acessado como `req.query.termo`). Usado para filtros, buscas e paginação.

4. **Por que `app.use(express.json())` deve aparecer antes das rotas que usam `req.body`?**
   O Express processa os middlewares em ordem sequencial. O middleware `express.json()` é responsável por interceptar o fluxo binário da requisição, decodificar a string JSON e popular o objeto `req.body`. Se as rotas forem declaradas antes dele, o `req.body` chegará como `undefined`.

5. **O que muda entre os códigos HTTP 200, 201 e 404?**
   * **`200 OK`**: A requisição foi atendida com sucesso (comum em consultas GET e atualizações PUT).
   * **`201 Created`**: A requisição foi atendida com sucesso e um **novo recurso foi criado** no servidor (padrão em POST).
   * **`404 Not Found`**: O cliente requisitou um recurso ou uma rota que não existe no servidor.

---

## 5. Como Executar

### Iniciar o servidor principal (API de Livros - Seção 14):
```powershell
npm.cmd start
```
*(ou com reinicialização automática: `npm.cmd run dev`)*

### Executar a bateria de testes automatizados:
```powershell
npm.cmd run testar
```

### Executar a API de Tarefas da aula:
```powershell
npm.cmd run tarefas
```

### Executar o servidor HTTP nativo:
```powershell
npm.cmd run nativo
```
