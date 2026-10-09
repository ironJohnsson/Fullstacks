# Relatório Técnico — Criptografia, Funções Hash e Integridade de Dados
**Curso:** Engenharia da Computação  
**Disciplina:** Criptografia e Integridade de Dados  
**Professor:** Celso Barreto  
**Autor:** Laboratório Prático de Criptografia (Engenharia da Computação)  

---

## 1. Fundamentos: Criptografia vs. Função Hash

| Conceito | Criptografia (Simétrica / Assimétrica) | Função Hash Criptográfica |
| :--- | :--- | :--- |
| **Reversibilidade** | Reversível (com posse da chave adequada) | Estritamente Unidirecional (One-Way) |
| **Propósito Principal** | Confidencialidade (esconder o conteúdo) | Integridade (resumo de dados imutável) |
| **Chave Secreta** | Obrigatória (K) | Não utiliza chave (função matemática pura) |
| **Tamanho da Saída** | Proporcional ao tamanho do texto claro | Tamanho fixo (ex: 256 bits no SHA-256) |
| **Exemplos** | AES-GCM, RSA, ChaCha20 | SHA-256, SHA-512, SHA-3 |

---

## 2. Famílias SHA: Comparativo e Segurança

1. **SHA-1 (160 bits):**
   * **Status:** Inseguro para aplicações modernas.
   * **Motivo:** Em 2017, a equipe do CWI Amsterdam e Google demonstrou o ataque *SHAttered*, encontrando uma colisão prática (dois arquivos PDF com conteúdos distintos que geravam o mesmo SHA-1). Não deve ser usado em assinaturas ou certificados.
2. **SHA-2 (SHA-256, SHA-384, SHA-512):**
   * **Status:** Padrão ouro da indústria, seguro e amplamente empregado em TLS, HTTPS, Blockchain e assinaturas digitais.
   * **Tamanhos:** Produz resumos de 256 bits (64 caracteres hexadecimais) ou 512 bits (128 caracteres hexadecimais).
3. **SHA-3 (Keccak):**
   * **Status:** Família moderna padronizada pelo NIST.
   * **Arquitetura:** Baseada em construção por esponja (*sponge construction*), completamente diferente da estrutura Merkle–Damgård usada pelo SHA-2. Serve como alternativa de alta segurança caso o SHA-2 venha a sofrer qualquer fraqueza matemática futura.

---

## 3. Investigação Experimental

### 3.1. Efeito Avalanche
No teste prático realizado com as entradas:
* **Entrada A:** `SEGURANCA2026`
* **Entrada B:** `SEGURANCA2027`
A alteração de apenas **1 caractere** (que no código ASCII difere em apenas 1 bit entre '6' e '7') produziu uma modificação de **~50% dos 256 bits** do resumo SHA-256. Isso comprova a propriedade de difusão de Shannon, tornando impraticável inferir qualquer relação entre entradas correlatas a partir dos seus hashes.

### 3.2. Independência entre Tamanho da Entrada e Tamanho do Resumo
Tanto uma string vazia (`""`), uma palavra (`"Celso"`) ou um arquivo de múltiplos gigabytes produzirão rigorosamente **256 bits (64 caracteres hexadecimais)** no SHA-256. A função hash comprime blocos de tamanho fixo através de funções de compressão iterativas com preenchimento padronizado (*padding*).

---

## 4. Análise de Segurança das Práticas dos Slides

### 4.1. Prática 5 — Erros Comuns de Segurança com Senhas
**Código analisado:**
```javascript
const senha = document.querySelector("#senha").value;
const hash = await gerarHash(senha, "SHA-256");
localStorage.setItem("senha", hash);
console.log("Senha protegida com criptografia SHA-256");
```

**Falhas Identificadas:**
1. **Afirmação Incorreta:** Chamar SHA-256 de "criptografia" é um erro conceitual; o hash é um resumo unidirecional.
2. **Uso de SHA-256 Puro para Senhas:** SHA-256 foi projetado para ser extremamente rápido. Isso permite que atacantes executem bilhões de tentativas por segundo em GPUs através de Rainbow Tables ou ataques de dicionário.
3. **Ausência de Salt:** Sem um *salt* aleatório único por usuário, senhas iguais geram hashes idênticos, facilitando ataques em lote.
4. **Armazenamento no `localStorage`:** O `localStorage` é vulnerável a ataques XSS (Cross-Site Scripting).
5. **Arquitetura Correta:** As senhas devem ser processadas no servidor usando algoritmos de derivação de chave com fator de custo (*work factor*) ajustável, como **Argon2id**, **bcrypt** ou **PBKDF2**.

---

### 4.2. Prática 6 & Pergunta Final (Slide 28) — Hash Simples vs. HMAC
> **Pergunta:** *"Se um atacante consegue alterar o dado e também substituir o SHA-256 armazenado, o hash simples ainda garante autenticidade?"*

**Resposta e Análise:**
**NÃO.** O SHA-256 simples garante **apenas integridade**, mas **não garante autenticidade de origem nem prova autoria**.
Se o canal de comunicação não for seguro e o atacante puder interceptar o tráfego, ele poderá:
1. Alterar a mensagem (ex.: mudar o valor de R$ 1.500,00 para R$ 9.999,00).
2. Calcular o novo SHA-256 sobre a mensagem fraudada.
3. Enviar a mensagem adulterada com o novo hash para o receptor.

O receptor calculará o hash da mensagem recebida, comparará com o hash recebido e concluirá erroneamente que o conteúdo está íntegro.

**Soluções:**
* **HMAC-SHA256:** Incorpora uma **chave secreta compartilhada** (`tag = HMAC(K, mensagem)`). O atacante não conhece a chave e, portanto, não consegue calcular uma tag válida para a mensagem modificada.
* **Assinatura Digital (Chave Assimétrica):** O emissor assina com sua chave privada e o receptor (ou qualquer terceiro) valida com a chave pública do emissor, garantindo autenticidade e não repúdio.

---

### 4.3. Desafio ITA — Ambiguidade de Concatenação (Slide 39)
**Cenário:**
* **Registro A:** `campo1 = "12"`, `campo2 = "345"`
* **Registro B:** `campo1 = "123"`, `campo2 = "45"`

Ao realizar a concatenação ingênua `campo1 + campo2`, ambos resultam na string `"12345"`. Consequentemente, o hash SHA-256 de ambos será idêntico:
```
SHA-256("12345") = 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5
```
Isso **NÃO é uma colisão matemática do SHA-256**, mas sim uma **falha de serialização**. A representação abstrata perdeu os limites entre os campos.

**Solução Canônica:**
Utilizar formatos estruturados bem definidos:
* **JSON Canônico:** `{"c1":"12","c2":"345"}` vs `{"c1":"123","c2":"45"}`.
* **Codificação de Comprimento:** `2:12|3:345` vs `3:123|2:45`.
Ambas geram sequências de bytes completamente distintas e eliminam a ambiguidade.

---


### 4.4. Exercício — Decisão de Arquitetura Universitária (Slide 38)
**Cenário:** Uma universidade recebe trabalhos acadêmicos digitais e necessita detectar alterações e comprovar que a submissão veio de uma identidade autorizada, suportando verificação por terceiros.

#### Comparativo Técnico das Propostas:

| Critério | Equipe A: SHA-256(doc) | Equipe B: HMAC-SHA-256(doc, K) | Equipe C: Assinatura Digital (PKI) |
| :--- | :--- | :--- | :--- |
| **Integridade** | Detecta apenas corrupção acidental | Garantida por chave secreta | Garantida matematicamente |
| **Autenticidade** | **Nula** (qualquer pessoa gera) | Restrita aos possuidores de K | **Plena** (atrelada à identidade do aluno) |
| **Não-Repúdio** | Inexistente | Inexistente (a universidade possui K e poderia forjar o envio) | **Total** (apenas o aluno tem a chave privada) |
| **Gestão de Chaves** | Não há chaves | Crítica: distribuir/proteger segredo para milhares de alunos | Eficiente: chaves públicas distribuídas livremente |
| **Auditoria por Terceiros** | Impossível provar autoria | Impossível sem vazar o segredo compartilhado | **Perfeita** (banca avaliadora ou MEC validam com a chave pública) |

#### Modelo de Ameaças & Recomendação Técnica Justificada:
* **Modelo de Ameaça:** Alunos forjando submissões em nome de colegas, alegações falsas de envio ("não fui eu que enviei essa versão"), adulteração interna por operadores do sistema ou contestação de autoria perante comissões examinadoras.
* **Recomendação:** **Equipe C (Assinatura Digital assimétrica)**. O modelo simétrico (Equipe B) falha porque o compartilhamento de segredo permite que a própria instituição ou administradores adulterem o arquivo sem que seja possível distinguir a autoria (ausência de não-repúdio). Apenas a criptografia de chave pública (Equipe C), associada a carimbo de tempo (*timestamping* confiável), atende aos requisitos jurídicos e operacionais de uma universidade.

---

## 5. Conclusão
A integridade de sistemas modernos depende da combinação harmoniosa de:
1. Funções de hash resistentes a colisões (SHA-2 / SHA-3).
2. Protocolos de autenticação que envolvam segredos ou chaves assimétricas (HMAC e Assinaturas Digitais).
3. Serialização canônica rigorosa antes do cálculo criptográfico.
