const entrada = document.getElementById("entrada");
const gerarBtn = document.getElementById("gerarBtn");
const limparBtn = document.getElementById("limparBtn");
const contador = document.getElementById("contador");
const original = document.getElementById("original");
const hash = document.getElementById("hash");

// Converte texto para bytes, calcula digest e devolve hexadecimal legível.
async function gerarHash(texto) {
  const dados = new TextEncoder().encode(texto);
  const buffer = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(buffer), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

entrada.addEventListener("input", () => {
  contador.textContent = `${entrada.value.length} caracteres`;
});

gerarBtn.addEventListener("click", async () => {
  const texto = entrada.value; // .value lê exatamente o que foi digitado.
  if (texto.length === 0) {
    hash.textContent = "Digite uma informação antes de gerar o hash.";
    return;
  }
  try {
    original.textContent = texto;
    hash.textContent = await gerarHash(texto);
  } catch (erro) {
    // Operações criptográficas podem falhar e precisam ser tratadas.
    hash.textContent = "Não foi possível gerar o hash.";
  }
});

limparBtn.addEventListener("click", () => {
  entrada.value = "";
  contador.textContent = "0 caracteres";
  original.textContent = "";
  hash.textContent = "";
});

document.getElementById("copiarBtn").addEventListener("click", async () => {
  if (!hash.textContent || !navigator.clipboard) return;
  try { await navigator.clipboard.writeText(hash.textContent); }
  catch (erro) { /* informe o erro na interface em uma versão completa */ }
});

document.getElementById("compararBtn").addEventListener("click", async () => {
  const um = document.getElementById("dado1").value;
  const dois = document.getElementById("dado2").value;
  if (!um || !dois) return;
  try {
    const iguais = (await gerarHash(um)) === (await gerarHash(dois));
    document.getElementById("comparacao").textContent =
      iguais ? "HASHES IGUAIS" : "HASHES DIFERENTES";
  } catch (erro) {
    document.getElementById("comparacao").textContent = "Erro na comparação.";
  }
});
