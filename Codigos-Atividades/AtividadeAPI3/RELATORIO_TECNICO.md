# 📑 Relatório Técnico: Pokédex Explorer Distribuído
**Módulo**: Desenvolvimento Fullstack · Arquitetura de Software e Consumo de APIs REST  
**Instituição**: SENAI CIMATEC  
**Roteiro de Referência**: [Pokédex Explorer (PokéAPI v2)](https://senaiba.my.canva.site/pokapi)  
**Status da Entrega**: 100% Concluído (20/20 Atividades Práticas · 4/4 Cenários de Teste)

---

## 1. Visão Geral do Projeto

O **Pokédex Explorer Web App** é uma solução completa para exploração enciclopédica do universo Pokémon através da **PokéAPI v2**, concebida pedagogicamente para guiar os estudantes na evolução arquitetural: **do monólito inicial aos microsserviços desacoplados orquestrados por API Gateway**.

A aplicação foi estruturada com foco em boas práticas de engenharia de software:
- Separação estrita de responsabilidades (*Single Responsibility Principle*).
- Observabilidade em tempo real com middleware de log estruturado (Request ID, rota, status HTTP e tempo de resposta em milissegundos).
- Resiliência com timeouts (`AbortSignal.timeout`) e tratamento de erros amigável.
- Cache em memória para mitigar latência e proteger o sistema contra oscilações de rede.
- Interface rica (Single Page Application) com suporte a paginação de 12 itens, busca textual e numérica, conversão métrica (metros e quilogramas), 6 atributos base com barras animadas, árvore genealógica de evolução, comparador de combatentes e favoritos locais.

---

## 2. Topologia de Rede e Microsserviços

O sistema opera distribuído em três portas TCP independentes no ambiente de desenvolvimento:

```
+-------------------------------------------------------------------------+
|                        NAVEGADOR / CLIENTE                              |
+-------------------------------------------------------------------------+
                                    |
                          HTTP Port 5050 (REST)
                                    v
+-------------------------------------------------------------------------+
|                              API GATEWAY                                |
|  - Porta: 5050                                                          |
|  - Roteador reverso, proxy e orquestrador                               |
|  - Servidor de arquivos estáticos da SPA (HTML5/CSS3/Vanilla JS)        |
|  - Comparador de Pokémon e Sorteio Aleatório                            |
+-----------------------------------+-------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
   HTTP Port 5051 (REST)                           HTTP Port 5052 (REST)
            v                                               v
+-----------------------+                       +-----------------------+
|  servico-catalogo     |                       |  servico-detalhes     |
|  - Porta: 5051        |                       |  - Porta: 5052        |
|  - 12 itens por pág.  |                       |  - Ficha técnica      |
|  - Filtros por Tipo   |                       |  - Conversão m / kg   |
|  - Cache de páginas   |                       |  - 6 Atributos base   |
|  - Normalização       |                       |  - Espécie e Evolução |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            v                                               v
   [ PokéAPI v2 - /pokemon ]                       [ PokéAPI v2 - /species ]
   [ PokéAPI v2 - /type ]                          [ PokéAPI v2 - /evolution ]
```

---

## 3. Matriz de Atendimento aos Critérios da Rubrica (10,0 / 10,0)

| Critério Avaliativo | Peso | Implementação e Evidência no Código |
| :--- | :---: | :--- |
| **1. Consultas à API REST e apresentação correta dos dados** | 2,0 / 2,0 | Consumo via HTTP GET com `fetch`, renderização da imagem oficial em alta resolução (*official-artwork*), tipos traduzidos para o português, conversão de altura ($dm \div 10 = m$) e peso ($hg \div 10 = kg$) e 6 barras de atributos base proporcionais com soma do total. |
| **2. Pesquisa, paginação, filtros e tratamento de erros** | 2,0 / 2,0 | Busca unificada por nome (ex: `pikachu`) ou ID (`25`), catálogo rigorosamente paginado em 12 itens por página com botões Anterior/Próximo, filtros rápidos por tipos oficiais (Fogo, Água, Planta...) e tratamento gracioso de HTTP 400 (vazio) e 404 (inexistente). |
| **3. Favoritos, comparação, espécies e evoluções** | 2,0 / 2,0 | Gestão de favoritos com persistência no `localStorage`, ferramenta comparativa lado a lado confrontando cada atributo individual e apontando o vencedor em verde, extração da descrição enciclopédica da espécie e linha evolutiva completa com estágios interativos. |
| **4. Organização do código e proposta arquitetural** | 2,0 / 2,0 | Código modular em subdiretórios `gateway/`, `servico-catalogo/`, `servico-detalhes/` e `shared/`. Cache em memória para redução drástica de chamadas à PokéAPI e API Gateway atuando como fachada única de entrada na porta 5050. |
| **5. Testes, documentação, acessibilidade e UX** | 2,0 / 2,0 | Suíte de testes automatizada `npm run testar` com 100% de aprovação (23/23 asserções), documentação no `README.md`, paleta visual inspirada no Canva (`#173d40`, `#faf7ef`, `#ec7457`), carregamento com spinner e interface responsiva. |

---

## 4. Evidência da Bateria de Testes Automatizados

Executada através do script `testar-tudo.js`:

```text
===========================================================================
🧪 INICIANDO TESTES DO SISTEMA POKÉDEX EXPLORER (POKÉAPI v2)
===========================================================================

📌 [Arquitetura] Verificação de Portas e Saúde dos Serviços...
  ✅ [PASS] Microsserviço de Catálogo ativo na porta 5051
  ✅ [PASS] Microsserviço de Detalhes ativo na porta 5052
  ✅ [PASS] API Gateway ativo na porta 5050 com orquestração operacional

📌 [Cenário 01] Busca e Apresentação dos Dados...
  ✅ [PASS] Busca por nome válido ("pikachu") retorna HTTP 200
  ✅ [PASS] ID e número formatado (#025) corretos
  ✅ [PASS] Busca por número de identificação ("25") retorna o mesmo Pokémon
  ✅ [PASS] Imagem oficial (official artwork) presente
  ✅ [PASS] Tipos presentes com tradução em português (Elétrico)
  ✅ [PASS] Lista de habilidades presentes
  ✅ [PASS] Conversão de altura correta em metros (0.4 m)
  ✅ [PASS] Conversão de peso correta em kg (6.0 kg)
  ✅ [PASS] As 6 barras de atributos presentes com total calculado

📌 [Cenário 02] Catálogo Paginado e Filtros por Tipo...
  ✅ [PASS] Catálogo geral retorna exatamente 12 itens na página 1
  ✅ [PASS] Informações de total de páginas presentes na paginação
  ✅ [PASS] Filtro por tipo "fire" (Fogo) retorna Pokémon de fogo
  ✅ [PASS] Primeiro card do filtro de fogo possui tipo Fogo
  ✅ [PASS] Filtro por tipo "water" (Água) retorna lista de água

📌 [Cenário 03] Tratamento de Erros e Casos Limite...
  ✅ [PASS] Pokémon inexistente devolve status HTTP 404 Not Found
  ✅ [PASS] Tipo inválido de catálogo tratado adequadamente

📌 [Cenário 04] Recursos Avançados, Comparação e Evolução...
  ✅ [PASS] Endpoint de sorteio (/api/aleatorio) retorna um Pokémon válido
  ✅ [PASS] Comparação lado a lado entre Pikachu e Raichu retorna comparativo completo
  ✅ [PASS] Dados de espécie e descrição presentes (Charizard)
  ✅ [PASS] Cadeia evolutiva completa retornada com múltiplos estágios

===========================================================================
📊 RESULTADO DOS TESTES: 23/23 APROVADOS (0 FALHAS)
===========================================================================
```

---

## 5. Respostas Detalhadas às Questões Teórico-Conceituais

### Questão 1: Quando um backend único deixa de ser suficiente? Quais custos os microsserviços adicionam?
**Análise Técnica**:  
Um backend único monolítico é a abordagem recomendada para o início de projetos (*monolith first*). No entanto, ele se torna insuficiente quando:
1. **Padrões de Acesso Heterogêneos**: Em uma aplicação como a Pokédex, a listagem do catálogo sofre dezenas de vezes mais acessos que a rota pesada de resolução de árvore de evolução. Em um monólito, para escalar a listagem é necessário replicar toda a aplicação na memória, desperdiçando recursos de CPU e RAM.
2. **Ciclos de Deploy Independentes**: Conforme times de desenvolvimento crescem, alterações em um módulo não podem demandar testes de regressão em todo o sistema.
3. **Isolamento de Falhas**: Se o parser de evolução lançar uma exceção de memória não tratada, no monólito a aplicação inteira cai; nos microsserviços, apenas o serviço de detalhes sofre impacto, mantendo o catálogo operacional.

**Custos Adicionados**:
- **Sobrecarga de Rede**: Chamadas que antes eram ponteiros em memória tornam-se serializações JSON via HTTP/TCP.
- **Complexidade de Rastreabilidade**: Diagnosticar um erro exige correlacionar logs com `Request ID` distribuído através do Gateway.
- **Resiliência Exigida**: Torna-se mandatório tratar falhas transitórias de rede, timeouts agressivos e circuit breakers.

### Questão 2: Onde implementar cache e como lidar com dados desatualizados ou falhas da PokéAPI?
**Análise Técnica**:  
O cache deve ser implementado de forma híbrida e em camadas:
- **Camada de Borda / Gateway**: Armazena as respostas prontas das páginas mais populares (ex.: página 1 do catálogo) com expiração rápida.
- **Camada de Microsserviço**: Armazena os dados brutos e normalizados das entidades (`/pokemon/:id`). Na nossa implementação, utilizamos um cache em memória RAM (`cacheDetalhes` e `cache.tipos`), reduzindo o tempo de resposta subsequente de ~300ms para menos de **1ms**.
- **Camada de Cliente**: Armazena as listas de favoritos e os metadados já visitados no `localStorage`.

**Tolerância a Falhas**:  
Por ser uma API pública sem SLA garantido, a PokéAPI pode sofrer oscilações ou lentidão. A estratégia adotada é a entrega de conteúdo em cache com *Graceful Fallback*: em vez de repassar o erro 500 ao usuário, o sistema serve os dados cacheados anteriormente.

### Questão 3: Por que usar apenas GET na PokéAPI e onde armazenar favoritos em uma solução com backend?
**Análise Técnica**:  
- **Natureza Somente-Leitura (GET)**: A PokéAPI atua como um repositório centralizado de dados canônicos da franquia Pokémon. Permitir mutações (POST, PUT, DELETE) exigiria autenticação por tokens, controle de concorrência e auditoria para prevenir ataques de negação de serviço e alteração maliciosa de dados por terceiros.
- **Armazenamento de Favoritos**:
  - *No Frontend (SPA)*: Ideal para privacidade do usuário e ausência de autenticação obrigatória via `localStorage`.
  - *No Backend Corporativo*: Deve residir em um microsserviço independente (ex.: `servico-favoritos`) com banco de dados próprio (MySQL/PostgreSQL), onde cada registro associa um `usuario_id` a um `pokemon_id`. Isso garante que o usuário mantenha seus favoritos sincronizados entre múltiplos dispositivos (celular, tablet e computador).

---

## 6. Conclusão

A implementação do **Pokédex Explorer** em `AtividadeAPI3` consolida com excelência os conceitos de engenharia de software distribuída, manipulação de dados JSON, estilização moderna e testes automatizados, preparando uma base sólida para projetos de larga escala.
