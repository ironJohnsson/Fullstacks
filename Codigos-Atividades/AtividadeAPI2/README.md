# 🌤️ Monitoramento Meteorológico · Dados do Tempo em Tempo Real
> **Atividade Prática de APIs & Arquitetura de Microsserviços**  
> Desenvolvido com base no roteiro e especificações do SENAI CIMATEC ([Apresentação Canva](https://senaiba.my.canva.site/apimeteo)).

---

## 📋 Sumário
- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Tabela de Portas e Serviços](#-tabela-de-portas-e-serviços)
- [Checklist de Requisitos (20/20 Concluídos)](#-checklist-de-requisitos-2020-concluídos)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Testes Automatizados](#-testes-automatizados)
- [Contratos de Endpoints (API Gateway & Microsserviços)](#-contratos-de-endpoints)
- [Respostas às Questões de Discussão da Aula](#-respostas-às-questões-de-discussão-da-aula)

---

## 🎯 Visão Geral
Aplicação web fullstack distribuída para consulta meteorológica em tempo real e previsão de 5 dias para qualquer cidade do Brasil e do mundo, consumindo os serviços abertos do **Open-Meteo** (Geocoding API e Weather Forecast API).

O projeto é modularizado no modelo de **Arquitetura de Microsserviços**, contando com dois serviços especializados e independentes, mediados por um **API Gateway** com observabilidade, resiliência (timeouts) e Single Page Application (SPA) reativa integrada.

---

## 🏛️ Arquitetura do Sistema

```
                        [ Cliente / Navegador Web ]
                                     │
                             HTTP Port 5000
                                     ▼
                ┌─────────────────────────────────────────┐
                │               API GATEWAY               │
                │        (Porta 5000 / Express.js)        │
                │  - Serve a SPA Frontend (HTML/CSS/JS)   │
                │  - Orquestra Cidades + Meteorologia     │
                │  - Proxy reverso, timeout e logging     │
                │  - Comparações entre cidades            │
                └────────────────────┬────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
         HTTP Port 5001                              HTTP Port 5002
                     ▼                               ▼
    ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
    │     Microsserviço de Cidades    │   │     Microsserviço de Clima      │
    │        (servico-cidades)        │   │        (servico-clima)          │
    │          (Porta 5001)           │   │          (Porta 5002)           │
    │  - Busca e geocodificação       │   │  - Condições atuais e previsão  │
    │  - Detecção de homônimas        │   │  - Sensação, vento, índice UV   │
    │  - Extração de estado e país    │   │  - Tradução WMO + ícones        │
    └────────────────┬────────────────┘   └────────────────┬────────────────┘
                     │                                     │
                     ▼                                     ▼
      Open-Meteo Geocoding API               Open-Meteo Weather Forecast API
     (geocoding-api.open-meteo.com)               (api.open-meteo.com)
```

---

## 🔌 Tabela de Portas e Serviços

| Serviço | Porta | Descrição | Healthcheck / Rota Principal |
| :--- | :---: | :--- | :--- |
| **API Gateway & SPA** | `5000` | Orquestrador, servidor de arquivos estáticos da SPA e comparador | `GET http://localhost:5000/api/status` |
| **Microsserviço Cidades** | `5001` | Geocodificação, coordenadas, estado, país e homônimas | `GET http://localhost:5001/status` |
| **Microsserviço Clima** | `5002` | Clima em tempo real, UV, vento cardeal, previsão de 5 dias e WMO | `GET http://localhost:5002/status` |

---

## ✅ Checklist de Requisitos (20/20 Concluídos)

Todos os 20 critérios avaliativos da atividade foram implementados, testados e validados:

1. **Executar a aplicação e consultar Salvador**: Testado com sucesso, retornando coordenadas e clima atual de Salvador (BA).
2. **Consultar três cidades brasileiras diferentes**: Validadas Salvador (BA), Recife (PE), São Paulo (SP) e Curitiba (PR).
3. **Consultar cidade fora do Brasil**: Suporte global validado com Paris (França) e Tóquio (Japão).
4. **Exibir estado e país**: Informações de UF/Estado e País tratadas na camada de geocodificação e exibidas em badges.
5. **Exibir latitude e longitude**: Coordenadas decimais de alta precisão formatadas em cards e metadados.
6. **Data e horário da observação meteorológica**: Timestamp ISO convertido para horário local formatado (`DD/MM/AAAA às HH:mm`).
7. **Sensação térmica**: Cálculo e exibição da temperatura aparente (`apparent_temperature`) em °C.
8. **Velocidade e direção do vento**: Velocidade em km/h e conversão matemática do ângulo em graus para 16 pontos cardeais (N, NNE, NE, L, SE, S, SO, O, NO...) com bússola visual animada.
9. **Índice UV com classificação de risco**: Índice UV medido e categorizado com cores padrão OMS (Baixo, Moderado, Alto, Muito Alto, Extremo).
10. **Previsão de 5 dias (mínimas e máximas)**: Grid responsivo com cartões diários contendo mínimas, máximas, sensação e UV.
11. **Códigos meteorológicos WMO traduzidos com ícones**: Tabela completa da World Meteorological Organization traduzida para o português com emojis e categorias climáticas.
12. **Tratamento de cidades inexistentes e campos vazios**: Validação na API Gateway e Microsserviço retornando `400 Bad Request` para entradas vazias e `404 Not Found` para localidades não encontradas, com mensagens amigáveis na UI.
13. **Resolução de cidades homônimas**: Busca por cidades como *"Valença"* exibe seletor interativo para o usuário escolher entre Valença (Bahia, Brasil), Valença (Rio de Janeiro, Brasil) ou Valença (Portugal).
14. **Gráfico de variação de temperaturas por dia**: Componente visual interativo em SVG desenhado dinamicamente com curvas de máximas e mínimas.
15. **Comparação de previsão entre duas cidades**: Aba dedicada para comparar duas cidades simultaneamente, calculando a diferença térmica em °C e destacando a cidade mais quente e mais fria.
16. **Botão para atualizar dados**: Ação rápida no topo do formulário que refaz a consulta instantaneamente.
17. **Histórico das últimas 5 cidades consultadas**: Barra com badges clicáveis que preserva o histórico de navegação recente da sessão.
18. **Dois microsserviços desacoplados**: `servico-cidades` (5001) e `servico-clima` (5002) possuem código, dependências e responsabilidades totalmente separadas.
19. **API Gateway centralizando requisições**: Ponto único de entrada (`porta 5000`) implementando o padrão Gateway Aggregation e servindo o frontend estático.
20. **Documentação e testes automatizados**: README detalhado, relatório técnico, diagrama de arquitetura e suíte de testes automatizada `npm run testar` com 100% de aprovação (26/26 asserções).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada)
- Conexão com a internet (para consumir a API pública do Open-Meteo)

### Passo a Passo

1. **Acessar a pasta do projeto**:
   ```bash
   cd Codigos-Atividades/AtividadeAPI2
   ```

2. **Instalar as dependências**:
   ```bash
   npm install
   ```

3. **Iniciar todos os microsserviços e o Gateway simultaneamente**:
   ```bash
   npm start
   ```

4. **Acessar a aplicação no navegador**:
   Abra seu navegador e acesse:
   👉 **`http://localhost:5000`**

*(Opcional) Execução individual de cada microsserviço em terminais separados:*
```bash
npm run cidades   # Terminal 1: http://localhost:5001
npm run clima     # Terminal 2: http://localhost:5002
npm run gateway   # Terminal 3: http://localhost:5000
```

---

## 🧪 Testes Automatizados

O projeto inclui uma bateria completa de testes automatizados que verifica todas as regras de negócio, contratos de API, tratamentos de erro e conectividade com o Open-Meteo:

```bash
npm run testar
```

**Resultado esperado:**
```text
===========================================================================
🧪 INICIANDO TESTES DO SISTEMA DE MONITORAMENTO METEOROLÓGICO
===========================================================================
📌 [Arquitetura] Verificação de Portas e Saúde dos Serviços...
  ✅ [PASS] Item 18 - Microsserviço de Cidades ativo na porta 5001
  ✅ [PASS] Item 18 - Microsserviço de Clima ativo na porta 5002
  ✅ [PASS] Item 19 - API Gateway ativo na porta 5000 com orquestração
...
===========================================================================
📊 RESULTADO FINAL DOS TESTES: 26/26 APROVADOS (0 FALHAS)
===========================================================================
```

Além disso, a aba **"🧪 Testes Obrigatórios"** dentro da interface web permite executar e visualizar todos os testes diretamente pelo navegador com um clique.

---

## 📡 Contratos de Endpoints

### 1. API Gateway (`http://localhost:5000`)
- **`GET /api/status`**: Retorna a integridade e latência do Gateway e dos 2 microsserviços.
- **`GET /api/clima?cidade=Salvador`**: Orquestra a busca da localidade e coleta meteorológica completa.
- **`GET /api/clima?cidade=Valenca&id=3445831`**: Seleção de homônima específica por ID.
- **`GET /api/comparar?cidade1=Salvador&cidade2=Curitiba`**: Retorna dados meteorológicos de ambas as cidades e análise diferencial de temperatura.

### 2. Microsserviço de Cidades (`http://localhost:5001`)
- **`GET /status`**: Healthcheck do microsserviço de localização.
- **`GET /cidades?nome=Salvador`**: Pesquisa textual na API Open-Meteo Geocoding com detecção de homônimas.

### 3. Microsserviço de Clima (`http://localhost:5002`)
- **`GET /status`**: Healthcheck do microsserviço de meteorologia.
- **`GET /meteorologia?lat=-12.97&lon=-38.50`**: Condições atuais, UV, direção cardeal do vento e previsão diária de 5 dias via Open-Meteo Forecast.

---

## 💡 Respostas às Questões de Discussão da Aula

### 1. Por que a busca de cidades e a consulta meteorológica foram divididas em microsserviços diferentes?
* **Separação de Preocupações (Single Responsibility Principle)**: O domínio de localização/geocodificação lida com texto, topônimos, divisões administrativas (estados, países) e desambiguação de homônimos. Já o domínio meteorológico lida com telemetria física, dados numéricos temporais, previsões e sensores climáticos.
* **Escalabilidade Independente**: Em dias de eventos meteorológicos extremos ou em horários de pico matinais, a consulta meteorológica tem uma taxa de requisições e de atualização por cache muito maior do que a busca cadastral de cidades. Podemos escalar horizontalmente apenas o serviço de clima sem consumir recursos desnecessários de geocodificação.
* **Manutenibilidade e Evolução**: Se decidirmos trocar o provedor de geocodificação (ex: migrar de Open-Meteo para IBGE ou Nominatim OpenStreetMap), apenas o `servico-cidades` é modificado, mantendo o `servico-clima` 100% intocado.

### 2. Quais as vantagens de ter um API Gateway centralizando as requisições?
* **Ponto Único de Entrada (Single Entrypoint)**: O cliente (navegador/mobile) conversa com um único endereço (`porta 5000`), sem precisar conhecer a topologia interna de portas ou endereços IP da infraestrutura de backend.
* **Orquestração e Redução de Latência no Cliente**: O Gateway executa a composição (busca a cidade, extrai lat/lon e imediatamente requisita o clima), devolvendo um payload JSON unificado e pronto para consumo, poupando o cliente de fazer requisições encadeadas sequenciais.
* **Segurança e Controle Centralizado**: Facilita a aplicação de CORS, rate limiting, logging de auditoria, tratamento de timeouts (resiliência) e terminação de protocolos em um único ponto.
* **Serviço de Arquivos Estáticos**: O Gateway hospeda a Single Page Application (SPA), eliminando problemas de CORS na comunicação frontend-backend.

### 3. Como o sistema se comportaria se o serviço de meteorologia ficasse fora do ar, mas o de cidades continuasse funcionando?
* **Comportamento Atual no Gateway**: O Gateway detecta a indisponibilidade ou timeout do `servico-clima` e retorna status HTTP `503 Service Unavailable` ou `504 Gateway Timeout` com mensagem de erro detalhada indicando exatamente qual serviço falhou. O healthcheck `/api/status` sinaliza estado `"statusGeral": "degradado"`.
* **Degradação Graciosa (Graceful Degradation)**: Na interface, o usuário ainda consegue pesquisar e listar cidades homônimas com seus estados e coordenadas através do `servico-cidades`, recebendo um aviso visual claro de que os sensores meteorológicos estão temporariamente indisponíveis, em vez de um travamento silencioso de toda a aplicação.
* **Técnicas Adicionais para Produção**: Implementação de padrão **Circuit Breaker** (ex: Opossum) para não sobrecarregar o serviço de clima com tentativas contínuas enquanto ele se recupera, e fallback para dados em **Cache** (Redis) da última previsão válida registrada.

### 4. Por que o Open-Meteo não exige chave de API? Quais as vantagens e riscos disso para uma aplicação real?
* **Motivo da Ausência de Chave**: O Open-Meteo é uma iniciativa voltada a dados abertos e ciência meteorológica baseada em modelos numéricos governamentais abertos (como NOAA, DWD, ECMWF). Para uso não-comercial abaixo de certos limites volumétricos (até 10.000 requisições diárias), o serviço libera acesso direto sem autenticação.
* **Vantagens**:
  1. Facilidade e agilidade de prototipagem e desenvolvimento em sala de aula (sem necessidade de cadastros, cartões de crédito ou vazamento de chaves secretas no Git).
  2. Redução de fricção no onboarding de novos desenvolvedores.
* **Riscos para uma Aplicação Real em Produção**:
  1. **Falta de SLA (Service Level Agreement)**: Não há garantia formal de disponibilidade nem canal prioritário de suporte caso a API caia.
  2. **Rate Limiting por IP Compartilhado**: Em servidores na nuvem (AWS, GCP, DigitalOcean) onde o endereço IP pode ser compartilhado por várias instâncias, o IP do servidor pode sofrer bloqueio repentino com HTTP 429 Too Many Requests se outros utilizadores vizinhos abusarem da API.
  3. **Riscos de Segurança**: Não há controle de tokens individuais para revogação em caso de abuso.

### 5. Se precisássemos adicionar previsão para 15 dias, quais partes do sistema teriam que ser modificadas?
1. **Microsserviço de Clima (`servico-clima/server.js`)**:
   - Alterar o parâmetro da URL do Open-Meteo de `forecast_days=6` para `forecast_days=16` (para garantir o dia de hoje mais os 15 dias subsequentes).
   - Ajustar o laço que itera o array de datas diárias para extrair 15 posições em vez de 5, mantendo o cálculo das mínimas, máximas, WMO e índices UV.
   - Renomear/expandir a propriedade da resposta JSON de `previsao5Dias` para `previsao15Dias` (ou manter um array genérico `previsaoDias: [...]` para compatibilidade).
2. **Microsserviço de Cidades (`servico-cidades/server.js`)**:
   - **Nenhuma alteração necessária**, pois o serviço de cidades só lida com geocodificação e coordenadas geográficas, comprovando o benefício do desacoplamento da arquitetura de microsserviços.
3. **API Gateway (`gateway/server.js`)**:
   - O Gateway apenas encaminha o payload orquestrado. Apenas a rota comparativa e a documentação do endpoint precisariam refletir a nova extensão temporal.
4. **Interface Web / SPA (`gateway/public/app.js` e `style.css`)**:
   - Atualizar a função `renderizarPrevisao5Dias` para suportar 15 cards ou um carrossel horizontal deslizável com scrollbar para não poluir visualmente a tela em resoluções menores.
   - Atualizar a renderização do gráfico SVG para acomodar 15 pontos no eixo X (`dias`), ajustando o espaçamento horizontal entre as coordenadas para que as linhas e rótulos de temperatura continuem legíveis.
