# 🔴 Pokédex Explorer · Laboratório de APIs e Microsserviços
> **Atividade Prática Fullstack · Node.js, Express, PokéAPI v2 & API Gateway**  
> Desenvolvido com base no roteiro interativo do SENAI CIMATEC ([Apresentação Canva](https://senaiba.my.canva.site/pokapi)).

---

## 📋 Sumário
- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema (Do Monólito aos Serviços)](#-arquitetura-do-sistema)
- [Tabela de Portas e Serviços](#-tabela-de-portas-e-serviços)
- [Checklist do Projeto (20 Atividades Concluídas)](#-checklist-do-projeto-20-atividades)
- [Os 4 Cenários de Testes Obrigatórios](#-os-4-cenários-de-testes-obrigatórios)
- [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Testes Automatizados](#-testes-automatizados)
- [Endpoints da API](#-endpoints-da-api)
- [Respostas às Questões de Discussão da Aula](#-respostas-às-questões-de-discussão-da-aula)

---

## 🎯 Visão Geral
Aplicação web moderna e reativa inspirada na Pokédex oficial, desenvolvida para explorar o consumo de APIs REST públicas (PokéAPI v2) e demonstrar a transição prática de um backend único para uma **Arquitetura de Microsserviços com API Gateway**.

A aplicação oferece catálogo paginado (12 Pokémon por página), filtros por tipo (Fogo, Água, Planta, Elétrico...), busca por nome ou número, ficha técnica detalhada com imagem official-artwork, conversão de medidas (metros e kg), 6 atributos base com barras visuais, dados da espécie (flavor text), árvore de evolução interativa, comparador de atributos lado a lado e sistema de favoritos persistido em `localStorage`.

---

## 🏛️ Arquitetura do Sistema

```
                       [ Cliente / Navegador Web ]
                                    │
                            HTTP Port 5050 (SPA)
                                    ▼
               ┌─────────────────────────────────────────┐
               │               API GATEWAY               │
               │        (Porta 5050 / Express.js)        │
               │  - Serve a SPA Frontend (HTML/CSS/JS)   │
               │  - Ponto único de entrada               │
               │  - Proxy reverso, timeout e logging     │
               │  - Comparador lado a lado               │
               │  - Sorteio aleatório                    │
               └────────────────────┬────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
        HTTP Port 5051                              HTTP Port 5052
                    ▼                               ▼
   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
   │     Microsserviço de Catálogo   │   │     Microsserviço de Detalhes   │
   │       (servico-catalogo)        │   │        (servico-detalhes)       │
   │          (Porta 5051)           │   │          (Porta 5052)           │
   │  - Paginação (12 itens/página)  │   │  - Ficha completa do Pokémon    │
   │  - Filtros rápidos por tipo     │   │  - Conversão de medidas (m / kg)│
   │  - Cache em memória             │   │  - 6 Atributos base + Total     │
   │  - Normalização de cards        │   │  - Espécie e Árvore Evolutiva   │
   └────────────────┬────────────────┘   └────────────────┬────────────────┘
                    │                                     │
                    ▼                                     ▼
         PokéAPI v2 (Catálogo / Tipos)          PokéAPI v2 (Espécies / Evolução)
              (pokeapi.co/api/v2)                     (pokeapi.co/api/v2)
```

---

## 🔌 Tabela de Portas e Serviços

| Serviço | Porta | Arquivo | Descrição / Endpoints |
| :--- | :---: | :--- | :--- |
| **API Gateway & SPA** | `5050` | [`gateway/server.js`](file:///c:/Users/Usuário/Documents/Projetos_Git/Fullstacks/Codigos-Atividades/AtividadeAPI3/gateway/server.js) | Centraliza chamadas, hospeda o frontend, comparador e sorteio (`/api/catalogo`, `/api/pokemon/:id`, `/api/comparar`, `/api/aleatorio`) |
| **Microsserviço de Catálogo** | `5051` | [`servico-catalogo/server.js`](file:///c:/Users/Usuário/Documents/Projetos_Git/Fullstacks/Codigos-Atividades/AtividadeAPI3/servico-catalogo/server.js) | Catálogo de 12 em 12 itens, filtros por tipo (fire, water...) e cache (`/catalogo`, `/status`) |
| **Microsserviço de Detalhes** | `5052` | [`servico-detalhes/server.js`](file:///c:/Users/Usuário/Documents/Projetos_Git/Fullstacks/Codigos-Atividades/AtividadeAPI3/servico-detalhes/server.js) | Estatísticas, conversão de decímetros/hectogramas, espécie e cadeia de evolução (`/pokemon/:idOuNome`, `/status`) |

---

## ✅ Checklist do Projeto (20 Atividades)

Todas as 20 atividades propostas na carga horária de 8 horas foram implementadas e validadas:

### 📦 Encontro 1 · Fundamentos, Busca e Apresentação (Atividades 1 a 10)
- [x] **01.** Configurar o projeto com Node.js e inicializar o servidor Express.
- [x] **02.** Criar rota de status e monitoramento de integridade (`GET /status`).
- [x] **03.** Consumir dados remotos da PokéAPI v2 utilizando requisições HTTP GET.
- [x] **04.** Implementar busca de Pokémon pelo nome (ex.: `pikachu`).
- [x] **05.** Implementar busca de Pokémon pelo número de identificação (ex.: `25`).
- [x] **06.** Apresentar imagem oficial (*official-artwork*), nome e número formatado (`#000`).
- [x] **07.** Exibir badges de tipos estilizadas com as cores temáticas oficiais.
- [x] **08.** Apresentar a lista de habilidades (*abilities*) normais e ocultas.
- [x] **09.** Converter corretamente as medidas físicas: altura em metros (m) e peso em quilogramas (kg).
- [x] **10.** Exibir as 6 barras de estatísticas base (HP, Atq, Def, Sp.Atk, Sp.Def, Vel) com cálculo do Total.

### 🚀 Encontro 2 · Catálogo, Filtros, Estado e Microsserviços (Atividades 11 a 20)
- [x] **11.** Criar catálogo paginado com 12 Pokémon por página e botões Anterior/Próximo.
- [x] **12.** Implementar filtros rápidos por tipo (Todos, Fogo, Água, Planta, Elétrico, etc.).
- [x] **13.** Adicionar botão de sorteio para consultar um Pokémon aleatório (1 a 1025).
- [x] **14.** Tratar graciosamente entradas vazias (`400 Bad Request`) e Pokémon inexistentes (`404 Not Found`).
- [x] **15.** Criar sistema de Favoritos (☆) com persistência no armazenamento local (`localStorage`).
- [x] **16.** Criar ferramenta para comparar dois Pokémon lado a lado com destaque para atributos superiores.
- [x] **17.** Exibir descrição enciclopédica da espécie e linha evolutiva completa com estágios.
- [x] **18.** Separar Catálogo (porta 5051) e Detalhes (porta 5052) em microsserviços com cache em memória.
- [x] **19.** Implementar API Gateway (porta 5050) como ponto único de entrada e roteador reverso.
- [x] **20.** Estruturar testes automatizados ponta a ponta, documentação e respostas de discussão.

---

## 🧪 Os 4 Cenários de Testes Obrigatórios

Conforme especificado no painel **"Qualidade antes da entrega"** da apresentação:

1. **01 · Busca e apresentação**: Busca por nome (`pikachu`) e número (`25`); confere imagem artwork, tipos em português, habilidades, conversão de altura (0.4 m), peso (6.0 kg) e as seis barras de estatísticas com total.
2. **02 · Catálogo e filtros**: Navegação entre páginas de 12 itens, conferência de total de páginas, teste de anterior/próximo e alternância entre tipos (Fogo, Água, Planta e Todos).
3. **03 · Erros e disponibilidade**: Busca de Pokémon inexistente (`404 Not Found`), proteção contra páginas/tipos inválidos e tolerância a falhas na comunicação com a API externa.
4. **04 · Estado e dados adicionais**: Marcação e desmarcação de atividades do checklist com persistência no navegador, adição/remoção de favoritos, comparador de dois Pokémon, consulta de espécie, linha evolutiva e sorteio aleatório.

---

## 🚀 Como Executar a Aplicação

### Pré-requisitos
- Node.js instalado (v18 ou superior)
- Conexão com a internet

### Passos:
```bash
# 1. Entrar na pasta da AtividadeAPI3
cd Codigos-Atividades/AtividadeAPI3

# 2. Instalar dependências (express, cors, dotenv)
npm install

# 3. Iniciar todos os serviços simultaneamente
npm start
```

Abra seu navegador em:  
👉 **[http://localhost:5050](http://localhost:5050)**

*(Opcional) Executar cada serviço isoladamente em terminais diferentes:*
```bash
npm run catalogo   # Porta 5051: http://localhost:5051
npm run detalhes   # Porta 5052: http://localhost:5052
npm run gateway    # Porta 5050: http://localhost:5050
```

---

## 📊 Testes Automatizados

Para rodar a bateria de testes via terminal:
```bash
npm run testar
```

**Resultado verificado:**
```text
===========================================================================
📊 RESULTADO DOS TESTES: 23/23 APROVADOS (0 FALHAS)
===========================================================================
```

> **Dica**: Você também pode executar todos os testes diretamente pelo navegador na aba **"🧪 Testes Obrigatórios"** com feedback visual em tempo real!

---

## 💡 Respostas às Questões de Discussão da Aula

### 1. Quando um backend único deixa de ser suficiente? Quais custos os microsserviços adicionam?
* **Quando o backend único não basta**: Um monólito torna-se um gargalo quando há **escalabilidade assimétrica** (por exemplo, o catálogo tem milhões de acessos para leitura, enquanto o detalhamento complexo ou o módulo de pagamento tem menor volume), quando times distintos precisam publicar atualizações de forma independente sem retestar a aplicação inteira, ou quando domínios específicos demandam tecnologias diferentes.
* **Custos adicionados pelos microsserviços**:
  1. **Complexidade Operacional**: Orquestração de múltiplos processos, gerenciamento de portas e deploys coordenados.
  2. **Latência de Rede**: A comunicação entre serviços (HTTP/JSON) introduz latência adicional comparada a chamadas de funções em memória.
  3. **Falhas Parciais**: Necessidade de resiliência, timeouts estritos e Circuit Breakers para evitar que a queda de um serviço derrube o sistema inteiro.
  4. **Dificuldade de Debug**: Torna indispensável o uso de logs distribuídos correlacionados por Request ID.

### 2. Onde implementar cache e como lidar com dados desatualizados ou falhas da PokéAPI?
* **Onde implementar cache**:
  - **No API Gateway**: Para rotas completas de catálogo e listagens gerais acessadas frequentemente.
  - **Nos Microsserviços**: Em memória RAM (como implementado no `servico-catalogo` e `servico-detalhes`) ou com Redis compartilhado para entidades individuais (`/pokemon/:id`).
  - **No Navegador do Cliente**: Armazenando preferências e dados de sessão via `localStorage`.
* **Como lidar com falhas e dados desatualizados**:
  - Como os dados biológicos dos Pokémon são essencialmente estáticos e imutáveis (os atributos de Pikachu não mudam a cada hora), adota-se um **TTL longo (Time to Live)** de horas ou dias.
  - Utiliza-se a estratégia **Stale-While-Revalidate**: o sistema entrega imediatamente a versão em cache e atualiza os dados em segundo plano.
  - Em caso de queda ou lentidão da PokéAPI, o cache atua como **Graceful Degradation**, permitindo que os usuários continuem navegando normalmente.

### 3. Por que usar apenas GET na PokéAPI e onde armazenar favoritos em uma solução com backend?
* **Por que apenas GET na PokéAPI**: A PokéAPI é uma base pública aberta, colaborativa e estritamente enciclopédica (*read-only*). Ela atende a centenas de milhares de consultas diárias ao redor do mundo; se permitisse métodos de escrita (POST, PUT, DELETE), estaria vulnerável a vandalismo e demandaria controle de autenticação, permissões e concorrência para cada desenvolvedor.
* **Onde armazenar favoritos**: Os favoritos representam o estado e as preferências individuais de cada usuário.
  - Em uma solução de estudo/demonstração frontend: diretamente no **`localStorage` do navegador**, garantindo privacidade e acesso instantâneo sem custo de servidor.
  - Em uma solução empresarial com backend: em um microsserviço dedicado de **Usuários/Preferências** com persistência em banco de dados relacional (ex: **MySQL**) indexado pelo `user_id` e `pokemon_id`.
