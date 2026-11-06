# Gabarito Oficial Comentado — Quiz de Microsserviços e APIs REST (40 Questões)

**Curso:** Desenvolvimento de Sistemas · Básico ao Intermediário  
**Laboratório:** LAB / MICROSSERVIÇOS — Construindo sistemas que conversam  
**Total de Questões:** 40  
**Aproveitamento Esperado:** 100%  

---

### Questão 1

**Enunciado:** Uma escola precisa disponibilizar cadastros de alunos e consultas de notas em serviços independentes. Qual característica identifica a arquitetura de microsserviços?

A) Todos os módulos usam obrigatoriamente o mesmo processo 
B) Cada serviço representa uma capacidade de negócio e pode ser implantado independentemente ✓ **(Correta)**
C) Cada tela precisa ter um banco de dados 
D) O sistema dispensa comunicação em rede 
E) Todos os serviços devem usar linguagens diferentes 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** Microsserviços organizam capacidades de negócio em unidades implantáveis de forma independente.

---

### Questão 2

**Enunciado:** Uma empresa desenvolveu um único sistema com estoque, vendas e financeiro. Uma alteração no estoque exige publicar toda a aplicação. Qual arquitetura melhor descreve essa situação?

A) Orientada a eventos 
B) Serverless 
C) Microsserviços independentes 
D) Monolítica ✓ **(Correta)**
E) Peer-to-peer 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** Em um monólito, os módulos são publicados como uma única aplicação.

---

### Questão 3

**Enunciado:** Um aplicativo solicita dados de produtos a um servidor Express. Qual método HTTP é normalmente utilizado para consultar recursos sem modificá-los?

A) POST 
B) DELETE 
C) PATCH 
D) PUT 
E) GET ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** GET é o método usual para leitura de recursos.

---

### Questão 4

**Enunciado:** Um serviço de cadastro recebe dados de um novo cliente. Qual método HTTP é mais apropriado para criar esse recurso em uma coleção?

A) GET 
B) POST ✓ **(Correta)**
C) DELETE 
D) HEAD 
E) OPTIONS 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** POST é normalmente usado para criar um recurso em uma coleção.

---

### Questão 5

**Enunciado:** Uma API responde com HTTP 404 quando um usuário consulta um produto. O que essa resposta normalmente significa?

A) O produto foi criado 
B) O servidor está em manutenção 
C) O recurso solicitado não foi encontrado ✓ **(Correta)**
D) O usuário foi autenticado 
E) A consulta foi processada com sucesso 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** 404 indica que o recurso solicitado não foi encontrado.

---

### Questão 6

**Enunciado:** Uma API envia dados estruturados para um frontend React. Qual formato é mais utilizado nesse contexto?

A) CSV 
B) PDF 
C) HTML 
D) JSON ✓ **(Correta)**
E) DOCX 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** JSON é amplamente utilizado para trocar dados estruturados em APIs.

---

### Questão 7

**Enunciado:** Uma aplicação precisa consultar o endereço associado a um CEP brasileiro. Qual API pública é adequada para essa finalidade?

A) ViaCEP ✓ **(Correta)**
B) PokéAPI 
C) JSONPlaceholder 
D) Open-Meteo 
E) GitHub API 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** A ViaCEP disponibiliza consultas de endereço por CEP.

---

### Questão 8

**Enunciado:** Um estudante quer testar requisições REST sem construir um banco de dados real. Qual serviço oferece usuários, publicações e tarefas simuladas?

A) Open-Meteo 
B) ViaCEP 
C) PokéAPI 
D) Google Maps 
E) JSONPlaceholder ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** A JSONPlaceholder fornece esses recursos de teste.

---

### Questão 9

**Enunciado:** Uma aplicação Express utiliza app.listen(4001). O que representa o número 4001?

A) Código HTTP 
B) Porta de escuta do servidor ✓ **(Correta)**
C) Quantidade máxima de usuários 
D) Identificador do banco 
E) Tempo de resposta 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** O número informa a porta TCP em que o servidor recebe conexões.

---

### Questão 10

**Enunciado:** Um aluno implementou GET /produtos/:id. Na rota /produtos/15, qual é o papel de 15?

A) Nome do servidor 
B) Código de autenticação 
C) Número da porta 
D) Parâmetro de rota ✓ **(Correta)**
E) Versão do protocolo 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** 15 é o valor do parâmetro de rota :id.

---

### Questão 11

**Enunciado:** Um endpoint recebe POST /produtos com JSON no corpo. Qual configuração permite que o Express interprete esse corpo?

A) app.listen() 
B) express.static() 
C) express.json() ✓ **(Correta)**
D) res.sendStatus() 
E) req.query 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** express.json() interpreta corpos JSON e preenche req.body.

---

### Questão 12

**Enunciado:** Uma loja envia um produto sem preço ao serviço de cadastro. Qual resposta representa melhor uma entrada inválida?

A) 200 OK 
B) 201 Created 
C) 301 Moved Permanently 
D) 400 Bad Request ✓ **(Correta)**
E) 503 Service Unavailable 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** 400 informa que a requisição recebida não atende aos requisitos de entrada.

---

### Questão 13

**Enunciado:** Uma rota cria um novo pedido com sucesso. Qual status é o mais apropriado?

A) 201 Created ✓ **(Correta)**
B) 400 Bad Request 
C) 404 Not Found 
D) 502 Bad Gateway 
E) 304 Not Modified 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** 201 informa que um recurso foi criado.

---

### Questão 14

**Enunciado:** Um serviço deve filtrar tarefas por usuário na URL /tarefas?usuario=7. Onde o Express encontra esse valor?

A) req.body 
B) req.query ✓ **(Correta)**
C) req.params 
D) res.locals 
E) app.listen 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** Parâmetros após ? são acessados por req.query.

---

### Questão 15

**Enunciado:** Um aluno consulta a ViaCEP e recebe o campo erro igual a true. O que seu serviço local deve fazer?

A) Tratar o CEP como encontrado 
B) Devolver o HTML recebido 
C) Repetir infinitamente a consulta 
D) Cadastrar o CEP automaticamente 
E) Informar que o CEP não foi encontrado ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** O indicador erro da ViaCEP sinaliza CEP inexistente.

---

### Questão 16

**Enunciado:** Um serviço precisa consultar uma API externa usando Node.js 18+. Qual recurso pode executar a requisição HTTP?

A) JSON.stringify() 
B) app.listen() 
C) fetch() ✓ **(Correta)**
D) console.table() 
E) express.json() 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** Node.js 18+ disponibiliza fetch para requisições HTTP.

---

### Questão 17

**Enunciado:** Após chamar fetch(), o serviço precisa interpretar uma resposta JSON. Qual operação é adequada?

A) resposta.json() ✓ **(Correta)**
B) resposta.listen() 
C) resposta.route() 
D) resposta.send() 
E) resposta.mount() 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** O método json() interpreta o corpo da resposta.

---

### Questão 18

**Enunciado:** Um endpoint /clima recebe latitude e longitude. Qual API pública é apropriada para obter temperatura atual?

A) ViaCEP 
B) JSONPlaceholder 
C) PokéAPI 
D) Open-Meteo ✓ **(Correta)**
E) npm 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** A Open-Meteo oferece dados meteorológicos por coordenadas.

---

### Questão 19

**Enunciado:** Um serviço consulta a PokéAPI para reunir nome e tipos de um personagem. Qual prática melhora a interface do serviço local?

A) Expor apenas dados necessários em uma resposta própria ✓ **(Correta)**
B) Copiar todos os cabeçalhos recebidos sem análise 
C) Ignorar erros da API externa 
D) Usar a mesma rota para qualquer recurso 
E) Retornar sempre status 200 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** Uma resposta local simplificada reduz o acoplamento com a API externa.

---

### Questão 20

**Enunciado:** Um estudante envia POST para a JSONPlaceholder e recebe uma resposta de criação. O que deve considerar?

A) A gravação é permanente 
B) A API simula a gravação, sem persistir o novo registro ✓ **(Correta)**
C) O Express local salva automaticamente 
D) O dado fica disponível em todos os serviços 
E) A resposta prova que um banco local foi atualizado 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** A JSONPlaceholder simula operações de escrita sem persistir os dados enviados.

---

### Questão 21

**Enunciado:** Dois serviços Express precisam iniciar simultaneamente no mesmo computador. Qual configuração evita conflito de escuta?

A) Usar sempre a porta 80 
B) Usar a mesma porta e o mesmo processo 
C) Atribuir portas diferentes a cada processo ✓ **(Correta)**
D) Remover as rotas GET 
E) Desativar o protocolo HTTP 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** Processos independentes precisam escutar em portas distintas no mesmo endereço.

---

### Questão 22

**Enunciado:** Uma equipe quer alterar o cadastro de produtos sem republicar pedidos. Qual decisão favorece esse objetivo?

A) Acoplar ambos ao mesmo executável 
B) Eliminar a comunicação HTTP 
C) Compartilhar todas as variáveis globais 
D) Implantar os serviços separadamente ✓ **(Correta)**
E) Usar uma única rota para todo o sistema 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** A implantação independente reduz a necessidade de republicar outros serviços.

---

### Questão 23

**Enunciado:** Um produto de ID 52 não existe no catálogo local. Qual resposta é adequada para GET /produtos/52?

A) 201 com objeto vazio 
B) 204 com erro no corpo 
C) 302 para a página inicial 
D) 500 para qualquer consulta 
E) 404 com mensagem clara ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** 404 distingue recurso ausente de uma falha interna do servidor.

---

### Questão 24

**Enunciado:** Uma equipe implementa PUT /produtos/3 para substituir dados de um produto. Qual cuidado é essencial?

A) Validar os dados recebidos e verificar se o produto existe ✓ **(Correta)**
B) Criar sempre um produto com novo ID 
C) Ignorar o corpo da requisição 
D) Responder 201 mesmo quando a atualização falhar 
E) Atualizar todos os produtos 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** Atualizações devem validar a entrada e identificar recursos inexistentes.

---

### Questão 25

**Enunciado:** Um cliente envia DELETE /produtos/8 e o serviço remove o recurso sem devolver conteúdo. Qual status é apropriado?

A) 100 Continue 
B) 204 No Content ✓ **(Correta)**
C) 301 Moved Permanently 
D) 400 Bad Request 
E) 502 Bad Gateway 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** 204 representa sucesso sem corpo na resposta.

---

### Questão 26

**Enunciado:** Um gateway recebe chamadas para /api/pedidos e as encaminha ao serviço correto. Qual é sua função principal nesse caso?

A) Criar novos protocolos de rede 
B) Substituir todos os serviços de negócio 
C) Centralizar o ponto de entrada e o roteamento ✓ **(Correta)**
D) Eliminar a necessidade de validação 
E) Garantir que nenhuma falha ocorrerá 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** O gateway oferece uma entrada comum e direciona chamadas aos serviços.

---

### Questão 27

**Enunciado:** O serviço de pedidos chama o serviço de produtos, que não responde. Qual medida evita espera indefinida?

A) Aumentar infinitamente o tempo de espera 
B) Remover o tratamento de erros 
C) Retornar um pedido sem produtos 
D) Definir timeout para a chamada externa ✓ **(Correta)**
E) Reiniciar o navegador do usuário 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** Um timeout limita a duração de dependências externas.

---

### Questão 28

**Enunciado:** Uma chamada a outro serviço falha por indisponibilidade. Qual resposta local comunica melhor uma falha da dependência?

A) 200 OK 
B) 201 Created 
C) 301 Moved Permanently 
D) 404 Not Found 
E) 502 Bad Gateway ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** 502 pode sinalizar falha ao obter uma resposta válida de um serviço consultado.

---

### Questão 29

**Enunciado:** Um pedido contém duas unidades de um produto de R$ 15 e uma unidade de outro de R$ 20. Qual deve ser o total?

A) R$ 50 ✓ **(Correta)**
B) R$ 35 
C) R$ 45 
D) R$ 55 
E) R$ 70 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** 2 × 15 + 1 × 20 = 50.

---

### Questão 30

**Enunciado:** Antes de registrar um pedido, o serviço consulta o catálogo. Por quê?

A) Para trocar a porta do servidor 
B) Para verificar produtos e obter preços confiáveis ✓ **(Correta)**
C) Para dispensar validação de quantidades 
D) Para transformar GET em DELETE 
E) Para impedir respostas JSON 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** A consulta verifica a existência dos produtos e fornece preços para o cálculo.

---

### Questão 31

**Enunciado:** Um projeto armazena pedidos apenas em uma variável JavaScript. O que ocorre ao reiniciar o processo?

A) Os pedidos são transferidos ao gateway 
B) Os pedidos passam a existir na ViaCEP 
C) Os pedidos em memória são perdidos ✓ **(Correta)**
D) Os pedidos são salvos no navegador 
E) Os pedidos se tornam públicos automaticamente 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** Dados mantidos só na memória desaparecem com o encerramento do processo.

---

### Questão 32

**Enunciado:** Uma equipe quer conservar pedidos após reiniciar o serviço. Qual solução atende a essa necessidade?

A) Guardar somente em uma constante 
B) Retornar sempre um exemplo fixo 
C) Aumentar o número da porta 
D) Salvar em arquivo ou banco de dados ✓ **(Correta)**
E) Apagar os pedidos a cada requisição 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** Armazenamento em arquivo ou banco conserva registros entre execuções.

---

### Questão 33

**Enunciado:** Uma URL de serviço varia entre desenvolvimento e produção. Onde é melhor configurá-la?

A) Dentro de cada resposta JSON 
B) No nome do arquivo README 
C) Em um texto fixo da interface 
D) No ID de cada produto 
E) Em uma variável de ambiente ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** Variáveis de ambiente separam configuração do código.

---

### Questão 34

**Enunciado:** Um repositório será compartilhado com outras equipes. Qual item facilita executar cada serviço corretamente?

A) README com dependências, portas, comandos e rotas ✓ **(Correta)**
B) Apenas capturas de tela sem instruções 
C) Somente nomes das pastas 
D) Uma lista de senhas no código 
E) A remoção de todos os exemplos de requisição 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** Documentação operacional permite reproduzir a execução e os testes.

---

### Questão 35

**Enunciado:** Um teste envia um CEP com apenas sete dígitos. O que deve verificar?

A) Que a ViaCEP é consultada normalmente 
B) Que o serviço responde 400 sem consultar a API externa ✓ **(Correta)**
C) Que a rota cria um endereço 
D) Que o servidor muda de porta 
E) Que uma página HTML substitui o JSON 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** A validação deve rejeitar o formato antes da chamada externa.

---

### Questão 36

**Enunciado:** Uma equipe testa a integração de pedidos com o serviço de produtos fora do ar. Qual resultado demonstra tratamento adequado?

A) A requisição fica pendente indefinidamente 
B) O pedido é registrado com total zero 
C) Uma resposta de erro é retornada sem registrar pedido inválido ✓ **(Correta)**
D) Todas as rotas retornam 201 
E) O servidor ignora a falha 

* **Resposta Correta:** **C**
* **Justificativa Técnica:** A falha da dependência deve ser comunicada, sem gravar um pedido incorreto.

---

### Questão 37

**Enunciado:** Uma aplicação recebe várias chamadas. Qual informação torna os logs mais úteis para acompanhar uma requisição entre serviços?

A) Cor de fundo da interface 
B) Nome do navegador apenas 
C) Quantidade de arquivos CSS 
D) Identificador de requisição junto com horário, rota e status ✓ **(Correta)**
E) Tamanho da tela do usuário 

* **Resposta Correta:** **D**
* **Justificativa Técnica:** Um identificador permite correlacionar registros produzidos por serviços diferentes.

---

### Questão 38

**Enunciado:** Um microsserviço recebe nome de produto enviado pelo cliente. Qual medida reduz problemas de entrada malformada?

A) Confiar em qualquer corpo recebido 
B) Pular a validação no backend 
C) Retornar sempre o mesmo produto 
D) Desativar express.json() 
E) Validar tipo, tamanho e campos obrigatórios ✓ **(Correta)**

* **Resposta Correta:** **E**
* **Justificativa Técnica:** A validação no servidor evita processar dados inesperados.

---

### Questão 39

**Enunciado:** Em uma demonstração, o gateway retorna 200, mas o serviço de pedidos não calcula totais corretamente. Qual conclusão é válida?

A) A resposta 200 do gateway não substitui testes da regra de negócio ✓ **(Correta)**
B) O sistema está completo porque a porta responde 
C) Todos os produtos foram validados automaticamente 
D) Não é necessário verificar valores retornados 
E) A API externa persiste os pedidos 

* **Resposta Correta:** **A**
* **Justificativa Técnica:** Disponibilidade da rota não comprova a correção da lógica do pedido.

---

### Questão 40

**Enunciado:** Uma equipe concluiu o projeto integrador. Qual apresentação melhor evidencia o funcionamento distribuído?

A) Mostrar só a estrutura de pastas 
B) Executar serviços, demonstrar requisições e explicar comunicação e erros ✓ **(Correta)**
C) Exibir apenas um desenho sem testes 
D) Apresentar somente o código de um botão 
E) Ocultar as respostas HTTP 

* **Resposta Correta:** **B**
* **Justificativa Técnica:** A demonstração deve comprovar execução, integração, comportamento e documentação.

---

