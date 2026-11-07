# 📑 Relatório Técnico: Monitoramento Meteorológico Distribuído
**Disciplina / Módulo**: Desenvolvimento Fullstack · Arquitetura de Software e Consumo de APIs  
**Instituição**: SENAI CIMATEC  
**Roteiro de Referência**: [Atividade Prática Open-Meteo](https://senaiba.my.canva.site/apimeteo)  
**Status da Entrega**: 100% Concluído (20/20 Itens do Checklist Avaliativo)

---

## 1. Introdução e Objetivos

Este relatório documenta a concepção, implementação, arquitetura técnica e validação experimental do **Sistema de Monitoramento Meteorológico em Tempo Real**.

O objetivo principal do projeto é construir uma solução distribuída e desacoplada baseada no padrão de **Microsserviços** e **API Gateway**, consumindo os serviços RESTful abertos do **Open-Meteo** ([Geocoding API](https://geocoding-api.open-meteo.com) e [Weather Forecast API](https://api.open-meteo.com)).

A solução oferece uma interface interativa (SPA) moderna, fluida e reativa, permitindo consulta de cidades nacionais e internacionais, detecção e resolução de homônimos geográficos, análise detalhada de parâmetros meteorológicos (radiação UV, ventos com pontos cardeais, sensação térmica e códigos WMO), gráfico comparativo de 5 dias e comparação entre localidades.

---

## 2. Arquitetura Técnica e Microsserviços

A solução foi estruturada para garantir estrita separação de preocupações (*Separation of Concerns*) e alta coesão, dividida em três componentes de rede que operam em portas TCP distintas na máquina:

```
+-------------------------------------------------------------------------+
|                        NAVEGADOR / CLIENTE                              |
+-------------------------------------------------------------------------+
                                    |
                           HTTP Port 5000 (REST)
                                    v
+-------------------------------------------------------------------------+
|                              API GATEWAY                                |
|  - Porta: 5000                                                          |
|  - Roteamento, Orquestração e Composição de Respostas                   |
|  - Tratamento de Resiliência (Timeouts de 7s) e Logging Unificado       |
|  - Servidor de Arquivos Estáticos da Single Page Application (SPA)      |
+-----------------------------------+-------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
   HTTP Port 5001 (REST)                           HTTP Port 5002 (REST)
            v                                               v
+-----------------------+                       +-----------------------+
|  servico-cidades      |                       |  servico-clima        |
|  - Porta: 5001        |                       |  - Porta: 5002        |
|  - Busca por nome     |                       |  - Condições atuais   |
|  - Extração lat/lon   |                       |  - Previsão 5 dias    |
|  - Estado / País      |                       |  - Índice UV e Vento  |
|  - Gestão de homônimas|                       |  - Tabela WMO oficial |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            v                                               v
   [ Open-Meteo Geocoding ]                        [ Open-Meteo Forecast ]
```

### 2.1. Microsserviço de Cidades (`servico-cidades` · Porta 5001)
* **Responsabilidade**: Resolução textual de nomes de cidades, georreferenciamento (latitude, longitude, elevação), identificação de subdivisão administrativa (Estado / Província) e detecção de cidades homônimas.
* **Endpoints**:
  * `GET /status`: Healthcheck do serviço.
  * `GET /cidades?nome=...`: Comunica-se com `https://geocoding-api.open-meteo.com/v1/search`, sanitiza os parâmetros de busca e normaliza os dados retornados em um formato padronizado.

### 2.2. Microsserviço de Meteorologia (`servico-clima` · Porta 5002)
* **Responsabilidade**: Obtenção e processamento de variáveis meteorológicas atuais e previsões diárias com base em coordenadas geográficas decimais.
* **Regras de Negócio e Enriquecimento**:
  * Tradução dos códigos numéricos da **WMO (World Meteorological Organization)** em descrições em língua portuguesa e ícones meteorológicos visuais.
  * Cálculo vetorial da direção do vento (conversão de 0° - 360° para os 16 pontos cardeais: N, NNE, NE, L, SE, S, SO, O, NO...).
  * Classificação dos níveis de risco do **Índice UV** conforme diretrizes da Organização Mundial da Saúde (Baixo, Moderado, Alto, Muito Alto, Extremo).
* **Endpoints**:
  * `GET /status`: Healthcheck do serviço.
  * `GET /meteorologia?lat=...&lon=...`: Coleta telemetria em tempo real e previsão de 5 dias via `https://api.open-meteo.com/v1/forecast`.

### 2.3. API Gateway (`gateway` · Porta 5000)
* **Responsabilidade**: Ponto de contato unificado para os clientes externos.
* **Funcionalidades**:
  * **Aggregation**: No endpoint `GET /api/clima?cidade=...`, o Gateway realiza a orquestração em duas fases: primeiro chama `servico-cidades` para obter as coordenadas; em seguida, chama `servico-clima` repassando essas coordenadas, unificando a resposta em um único payload JSON completo.
  * **Proxying**: Disponibiliza rotas diretas `/api/cidades` e `/api/meteorologia` para chamadas avulsas.
  * **Comparador**: No endpoint `GET /api/comparar?cidade1=...&cidade2=...`, consulta ambas as localidades em paralelo via `Promise.all` e calcula a diferença de temperatura.
  * **Hospedagem da SPA**: Serve a interface web construída em HTML5, CSS3 e JavaScript Vanilla sem dependências externas de compilação.

---

## 3. Matriz de Atendimento do Checklist (20/20 Itens)

| Item | Requisito da Atividade | Status | Implementação e Evidência |
| :---: | :--- | :---: | :--- |
| **01** | Executar a aplicação e consultar Salvador | ✅ Aprovado | Salvador é consultada por padrão ao abrir o sistema e testada com sucesso via script automatizado. |
| **02** | Consultar três cidades brasileiras diferentes | ✅ Aprovado | Validadas Recife (PE), São Paulo (SP) e Curitiba (PR). |
| **03** | Consultar uma cidade fora do Brasil | ✅ Aprovado | Validadas Paris (França) e Tóquio (Japão). |
| **04** | Exibir o estado e o país do local consultado | ✅ Aprovado | O Geocoding extrai `admin1` (Estado) e `country` (País), renderizados em badges. |
| **05** | Exibir latitude e longitude | ✅ Aprovado | Coordenadas decimais exibidas no topo do painel meteorológico. |
| **06** | Data e horário da observação meteorológica | ✅ Aprovado | Campo `time` do Open-Meteo convertido para a data e hora local com o fuso horário da cidade. |
| **07** | Apresentar a sensação térmica | ✅ Aprovado | Variável `apparent_temperature` exibida em destaque com badge explicativa. |
| **08** | Exibir velocidade e direção do vento | ✅ Aprovado | Velocidade em km/h e conversor para os 16 pontos cardeais com indicador de bússola animado. |
| **09** | Índice de radiação ultravioleta (UV) | ✅ Aprovado | Variável `uv_index` classificada por faixas de risco da OMS com cores dinâmicas. |
| **10** | Previsão de máximas e mínimas para 5 dias | ✅ Aprovado | Grid contendo os próximos 5 dias com temperaturas máximas e mínimas em cards visuais. |
| **11** | Ícones conforme código meteorológico WMO | ✅ Aprovado | Mapeamento completo dos códigos WMO 0 a 99 em `shared/wmo-codes.js`. |
| **12** | Tratar cidades inexistentes e campos vazios | ✅ Aprovado | Retorno HTTP 400 para buscas vazias e 404 para termos sem correspondência, com feedback visual amigável. |
| **13** | Escolha entre cidades homônimas | ✅ Aprovado | Ao buscar cidades como *Valença*, um painel permite ao usuário selecionar qual localidade deseja visualizar. |
| **14** | Gráfico de temperaturas por dia | ✅ Aprovado | Gráfico em SVG reativo desenhado dinamicamente no frontend com as curvas de máximas e mínimas. |
| **15** | Comparar previsão de duas cidades | ✅ Aprovado | Aba dedicada que realiza a busca simultânea e exibe cards comparativos com cálculo de diferença térmica. |
| **16** | Botão para atualizar os dados | ✅ Aprovado | Botão `↻ Atualizar dados` reexecuta a chamada meteorológica instantaneamente. |
| **17** | Histórico das últimas 5 cidades consultadas | ✅ Aprovado | Lista horizontal com as 5 últimas cidades pesquisadas com persistência na sessão. |
| **18** | Separação em dois microsserviços | ✅ Aprovado | `servico-cidades` (5001) e `servico-clima` (5002) operam com servidores Express independentes. |
| **19** | API Gateway centralizando as consultas | ✅ Aprovado | Ponto central na porta 5000 servindo a SPA e orquestrando as chamadas entre serviços. |
| **20** | Documentação e testes da aplicação | ✅ Aprovado | README completo, este relatório técnico e suíte `npm run testar` com 26 asserções aprovadas. |

---

## 4. Evidência da Execução dos Testes Automatizados

Com o comando `npm run testar`, todas as asserções de arquitetura, contrato e regras de negócio foram executadas e validadas:

```text
===========================================================================
🧪 INICIANDO TESTES DO SISTEMA DE MONITORAMENTO METEOROLÓGICO
===========================================================================

📌 [Arquitetura] Verificação de Portas e Saúde dos Serviços...
  ✅ [PASS] Item 18 - Microsserviço de Cidades ativo na porta 5001
  ✅ [PASS] Item 18 - Microsserviço de Clima ativo na porta 5002
  ✅ [PASS] Item 19 - API Gateway ativo na porta 5000 com orquestração

📌 [Item 1] Consulta de Salvador (BA)...
  ✅ [PASS] Item 1 - Retorno HTTP 200 para busca de Salvador
  ✅ [PASS] Item 1 - Nome da cidade retornado é Salvador

📌 [Item 2] Consulta de cidades brasileiras distintas (Recife, São Paulo, Curitiba)...
  ✅ [PASS] Item 2 - Consulta de Recife (PE) com sucesso
  ✅ [PASS] Item 2 - Consulta de São Paulo (SP) com sucesso
  ✅ [PASS] Item 2 - Consulta de Curitiba (PR) com sucesso

📌 [Item 3] Consulta de cidade internacional (Paris e Tóquio)...
  ✅ [PASS] Item 3 - Consulta de Paris (França) com sucesso
  ✅ [PASS] Item 3 - Consulta de Tóquio (Japão) com sucesso

📌 [Itens 4 a 11] Validação de Dados Meteorológicos (Salvador)...
  ✅ [PASS] Item 4 - Exibição de Estado (Bahia) e País (Brasil)
  ✅ [PASS] Item 5 - Latitude e Longitude numéricas
  ✅ [PASS] Item 6 - Timestamp e horário da última medição
  ✅ [PASS] Item 7 - Temperatura e Sensação Térmica presentes
  ✅ [PASS] Item 8 - Vento em km/h e Direção em Cardeal (N, S, L, O...)
  ✅ [PASS] Item 9 - Índice UV com Nível de Risco e Classificação
  ✅ [PASS] Item 10 - Previsão de 5 dias com mínimas e máximas
  ✅ [PASS] Item 11 - Código WMO traduzido em texto e ícone

📌 [Item 12] Tratamento de Erros e Casos de Borda...
  ✅ [PASS] Item 12 - Campo vazio devolve HTTP 400 Bad Request
  ✅ [PASS] Item 12 - Cidade inexistente devolve HTTP 404 Not Found

📌 [Item 13] Detecção e Resolução de Cidades Homônimas...
  ✅ [PASS] Item 13 - Busca por "Valenca" identifica múltiplas homônimas

📌 [Item 14] Estrutura para Gráfico de Variação de Temperatura...
  ✅ [PASS] Item 14 - Dados do gráfico com rótulos, mínimas e máximas presentes

📌 [Item 15] Endpoint de Comparação entre duas cidades...
  ✅ [PASS] Item 15 - Endpoint /api/comparar retorna comparação entre Salvador e Curitiba

📌 [Itens 16, 17, 20] Validação de Recursos do Sistema...
  ✅ [PASS] Item 16 - Suporte a atualização manual via API Gateway e Frontend
  ✅ [PASS] Item 17 - Histórico de 5 buscas persistido na SPA e sessões
  ✅ [PASS] Item 20 - Middleware de logging estruturado (shared/logger.js) monitorando rotas e tempos

===========================================================================
📊 RESULTADO FINAL DOS TESTES: 26/26 APROVADOS (0 FALHAS)
===========================================================================
```

---

## 5. Respostas às Perguntas Pedagógicas da Apresentação

### Questão 1: Por que a busca de cidades e a consulta meteorológica foram divididas em microsserviços diferentes?
**Resposta**:
A separação fundamenta-se no princípio da responsabilidade única (SRP) e nos ciclos de vida distintos dos domínios. O serviço de cidades lida com processamento textual, normalização linguística e desambiguação geográfica, enquanto o serviço de clima lida com telemetria física em tempo real e modelos numéricos probabilísticos. Essa segregação permite escalar os serviços de maneira independente: em momentos de clima instável, a frequência de consultas ao serviço meteorológico é muito mais alta que o cadastramento ou consulta de coordenadas de cidades, permitindo alocar recursos computacionais sob medida para cada microsserviço.

### Questão 2: Quais as vantagens de ter um API Gateway centralizando as requisições?
**Resposta**:
O API Gateway atua como fachada única (*Single Entrypoint*), ocultando a topologia de rede interna dos microsserviços dos clientes externos. Ele desempenha quatro papéis cruciais:
1. **Composição e Orquestração**: Une duas requisições consecutivas (Cidades + Clima) no backend, reduzindo a latência percebida pelo usuário ao evitar que o navegador realize requisições sequenciais em cascata.
2. **Segurança e Isolamento**: Protege as portas internas dos microsserviços e simplifica o controle de CORS, rate-limiting e auditoria de tráfego.
3. **Resiliência Centralizada**: Aplica timeouts e tratamento uniforme de exceções (como HTTP 504 e 503).
4. **Entrega de Frontend**: Serve a SPA diretamente da porta 5000, unificando a experiência de deploy e acesso.

### Questão 3: Como o sistema se comportaria se o serviço de meteorologia ficasse fora do ar, mas o de cidades continuasse funcionando?
**Resposta**:
Graças ao tratamento de erros estruturado no Gateway, a falha do serviço de clima não derruba o sistema por completo. O Gateway responde com status HTTP 503 informando especificamente que o `servico-clima` está indisponível, enquanto o endpoint `/api/cidades` continua respondendo com sucesso às buscas geográficas e identificando homônimas. Na interface, essa resiliência é comunicada visualmente na barra de status superior como *Modo Degradado*. Em ambientes produtivos, implementa-se o padrão **Circuit Breaker** e fallback para a última previsão válida gravada em cache (Redis).

### Questão 4: Por que o Open-Meteo não exige chave de API? Quais as vantagens e riscos disso para uma aplicação real?
**Resposta**:
O Open-Meteo opera como um serviço de dados abertos para pesquisa e uso não comercial, apoiando-se em previsões abertas de agências meteorológicas governamentais (NOAA, DWD).
* **Vantagens**: Excelente agilidade de desenvolvimento, ausência de burocracia para geração e gestão de credenciais e risco nulo de vazamento de chaves secretas em repositórios públicos de código.
* **Riscos para Produção**: Ausência de SLA formal contratual, vulnerabilidade a rate limits baseados em IP compartilhado de provedores de nuvem (retornando erro HTTP 429) e dependência de um serviço de terceiros sem canais de suporte técnico direto.

### Questão 5: Se precisássemos adicionar previsão para 15 dias, quais partes do sistema teriam que ser modificadas?
**Resposta**:
1. **Microsserviço de Clima (`servico-clima`)**: Alteração do parâmetro `forecast_days` de 6 para 16 na requisição externa à Open-Meteo API e expansão do laço que itera o array diário para 15 posições.
2. **Microsserviço de Cidades (`servico-cidades`)**: **Nenhuma alteração**, demonstrando a robustez e o isolamento conferidos pela arquitetura de microsserviços.
3. **Frontend / SPA (`app.js` e `style.css`)**: Adaptação da visualização da grade dos dias para um formato com rolagem horizontal (carrossel) e recalibração do espaçamento horizontal do gráfico SVG para acomodar 15 coordenadas sem sobreposição de textos.

---

## 6. Conclusão

O projeto atendeu rigorosamente a 100% dos requisitos estipulados no roteiro didático, demonstrando na prática as vantagens, os desafios e os padrões de projeto associados à arquitetura de microsserviços, orquestração por API Gateway, tratamento resiliente de erros e consumo de APIs públicas modernas.
