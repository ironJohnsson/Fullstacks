# Laboratório Prático de Microsserviços e APIs REST

Este projeto implementa na íntegra todas as **20 atividades**, o **Projeto Integrador** e o **Gabarito Completo das 40 Questões** do laboratório:
> **LAB / MICROSSERVIÇOS: Construindo sistemas que conversam**  
> *Desenvolvimento de Sistemas · Básico ao Intermediário (Node.js, Express, HTTP, JSON)*

---

## 1. Estrutura da Arquitetura

O ecossistema é distribuído em processos e portas independentes:

```
AtividadeAPI's/
├── gateway/              # Porta 4000: API Gateway (roteador centralizado e timeout)
├── servico-produtos/     # Porta 4001: CRUD de Produtos, filtros e status
├── servico-enderecos/    # Porta 4002: Integração com a API ViaCEP
├── servico-usuarios/     # Porta 4003: Integração com JSONPlaceholder (/users)
├── servico-tarefas/      # Porta 4004: Integração com JSONPlaceholder (/todos)
├── servico-clima/        # Porta 4005: Integração com a API Open-Meteo
├── servico-pokemon/      # Porta 4006: Integração com a PokéAPI
├── servico-pedidos/      # Porta 4007: Gestão de Pedidos Integrada e Persistência
│   └── pedidos.json      # Arquivo de persistência local (Atividade 16)
├── shared/
│   └── logger.js         # Middleware compartilhado de observabilidade (Atividade 19)
├── testar-tudo.js        # Bateria de testes automatizados ponta a ponta (Atividade 18)
├── index.js              # Orquestrador único para inicializar todos os serviços
├── package.json          # Dependências e scripts de execução
├── .env / .env.example   # Configuração de portas e variáveis de ambiente (Atividade 17)
└── GABARITO_QUIZ_40_QUESTOES.md # Gabarito oficial comentado das 40 questões
```

---

## 2. Tabela de Portas e Serviços

| Serviço | Porta | Principais Endpoints | Descrição / Atividade |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `4000` | `/api/*` | Centraliza requisições e encaminha para os microsserviços (Atividade 14) |
| **servico-produtos** | `4001` | `/status`, `/produtos`, `/produtos/:id` | CRUD de catálogo, filtros por query e validação JSON (Ativ. 1–4, 11, 12) |
| **servico-enderecos** | `4002` | `/enderecos/:cep` | Consulta de CEP brasileiro via ViaCEP com timeout (Atividade 7) |
| **servico-usuarios** | `4003` | `/users`, `/usuarios/:id` | Consumo de usuários simulados na JSONPlaceholder (Atividades 5 e 6) |
| **servico-tarefas** | `4004` | `/tarefas?usuario=` | Tarefas remotas com filtro por usuário (Atividade 8) |
| **servico-clima** | `4005` | `/clima?lat=&lon=` | Clima atual via Open-Meteo (Atividade 9) |
| **servico-pokemon** | `4006` | `/pokemon/:id` | Dados de personagens via PokéAPI (Atividade 10) |
| **servico-pedidos** | `4007` | `/pedidos`, `/pedidos/:id` | Projeto Final: cálculo de total via servico-produtos e persistência JSON (Ativ. 13, 15, 16, 20) |

---

## 3. As 20 Atividades Implementadas

* **Atividade 1 (Fundamentos - Primeiro microsserviço):** Express na porta 4001 com `GET /status` retornando JSON com serviço, versão e status.
* **Atividade 2 (Fundamentos - Rotas e métodos HTTP):** `GET /produtos` e `GET /produtos/:id` retornando 200 ou 404 para ID inexistente.
* **Atividade 3 (Fundamentos - Parâmetros e consultas):** Filtros `?categoria=` e `?limite=` lendo e validando `req.query`.
* **Atividade 4 (Fundamentos - Validação de JSON):** `POST /produtos` validando `nome` e `preco`, retornando 201 ou 400.
* **Atividade 5 (APIs públicas - Primeira consulta externa):** Consulta a `https://jsonplaceholder.typicode.com/users` com `fetch`.
* **Atividade 6 (APIs públicas - Detalhes de usuário):** `GET /usuarios/:id` com validação de ID e 404 para inexistente.
* **Atividade 7 (APIs públicas - Consulta de CEP):** `GET /enderecos/:cep` usando ViaCEP, validando 8 dígitos e timeout.
* **Atividade 8 (APIs públicas - Tarefas remotas):** `GET /tarefas?usuario=` filtrando por `userId`.
* **Atividade 9 (APIs públicas - Dados meteorológicos):** `GET /clima` com latitude e longitude via Open-Meteo.
* **Atividade 10 (APIs públicas - Catálogo de personagens):** `GET /pokemon/:id` via PokéAPI tratando 404.
* **Atividade 11 (CRUD - Cadastro local):** CRUD de produtos em memória com auto-incremento.
* **Atividade 12 (CRUD - Atualização e remoção):** `PUT /produtos/:id` e `DELETE /produtos/:id` com status 200, 204 e 404.
* **Atividade 13 (CRUD - Separação de serviços):** Produtos na porta 4001 e Pedidos na porta 4007 em processos independentes.
* **Atividade 14 (Integração - Gateway de API):** API Gateway na porta 4000 que unifica o acesso a todos os serviços em uma única porta.
* **Atividade 15 (Integração - Timeout e indisponibilidade):** Timeout configurado com `AbortSignal.timeout()` e resposta controlada com 502/503.
* **Atividade 16 (Integração - Persistência de pedidos):** Pedidos gravados em `pedidos.json`, mantendo os dados após reiniciar o serviço.
* **Atividade 17 (Qualidade - Configuração segura):** Portas e URLs definidas em variáveis de ambiente (`.env` e `.env.example`).
* **Atividade 18 (Qualidade - Testes de integração):** Script automatizado `testar-tudo.js` validando 27 cenários de teste ponta a ponta.
* **Atividade 19 (Qualidade - Logs e observabilidade):** Middleware com timestamp, `requestId`, serviço, rota, status e tempo de resposta em ms.
* **Atividade 20 (Projeto final - Gestão de pedidos integrada):** Criação de pedidos com validação de produtos no outro microsserviço, cálculo do valor total e persistência.

---

## 4. Como Executar

### 1. Iniciar todos os microsserviços simultaneamente:
```powershell
npm.cmd start
```
*(Todos os 8 microsserviços serão iniciados nas portas 4000 a 4007).*

### 2. Rodar a bateria completa de testes automatizados:
```powershell
npm.cmd run testar
```

### 3. Rodar qualquer serviço individualmente:
```powershell
npm.cmd run gateway     # Porta 4000
npm.cmd run produtos    # Porta 4001
npm.cmd run enderecos   # Porta 4002
npm.cmd run usuarios    # Porta 4003
npm.cmd run tarefas     # Porta 4004
npm.cmd run clima       # Porta 4005
npm.cmd run pokemon     # Porta 4006
npm.cmd run pedidos     # Porta 4007
```
