const entrada = document.getElementById("entrada");
const original = document.getElementById("original");
const hash = document.getElementById("hash");
const contador = document.getElementById("contador");
const status = document.getElementById("status");

function bufferParaHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function textoParaHash(texto) {
  const encoder = new TextEncoder();
  const dados = encoder.encode(texto);
  const resultado = await crypto.subtle.digest("SHA-256", dados);
  return bufferParaHex(resultado);
}

function atualizarContador() {
  contador.textContent = `${entrada.value.length} caracteres`;
}

function mostrarStatus(mensagem, tipo = "") {
  status.textContent = mensagem;
  status.className = tipo;
}

async function gerarHash() {
  const texto = entrada.value;
  if (!texto.trim()) {
    mostrarStatus("Digite uma informação antes de gerar o hash.", "erro");
    return;
  }
  try {
    const resultado = await textoParaHash(texto);
    original.textContent = texto;
    hash.textContent = resultado;
    mostrarStatus("Hash gerado com sucesso.", "sucesso");
  } catch (erro) {
    mostrarStatus("Não foi possível gerar o hash neste navegador.", "erro");
  }
}

function limparLaboratorio() {
  entrada.value = "";
  original.textContent = "—";
  hash.textContent = "—";
  atualizarContador();
  mostrarStatus("");
  entrada.focus();
}

async function copiarHash() {
  if (hash.textContent === "—") {
    mostrarStatus("Gere um hash antes de copiar.", "erro");
    return;
  }
  try {
    await navigator.clipboard.writeText(hash.textContent);
    mostrarStatus("Hash copiado.", "sucesso");
  } catch {
    mostrarStatus("Selecione o hash manualmente para copiar.", "erro");
  }
}

async function compararDados() {
  const um = document.getElementById("dado1").value;
  const dois = document.getElementById("dado2").value;
  const saida = document.getElementById("resultado-comparacao");

  if (!um || !dois) {
    saida.textContent = "Preencha os dois campos.";
    return;
  }
  try {
    const hashUm = await textoParaHash(um);
    const hashDois = await textoParaHash(dois);
    saida.textContent = hashUm === hashDois
      ? "HASHES IGUAIS"
      : "HASHES DIFERENTES";
  } catch {
    saida.textContent = "Erro ao comparar.";
  }
}

entrada.addEventListener("input", atualizarContador);
document.getElementById("gerar").addEventListener("click", gerarHash);
document.getElementById("limpar").addEventListener("click", limparLaboratorio);
document.getElementById("copiar").addEventListener("click", copiarHash);
document.getElementById("comparar").addEventListener("click", compararDados);

// Preenche a tabela de experimento com o hash de "Celso"
const celsoEl = document.getElementById("hash-celso");
if (celsoEl) {
  textoParaHash("Celso").then(h => {
    celsoEl.textContent = h;
  }).catch(() => {});
}
