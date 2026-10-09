// Funções Criptográficas Fundamentais (Web Crypto API Nativa)
async function calcularHash(dado, algoritmo = 'SHA-256') {
  const bytes = typeof dado === 'string' ? new TextEncoder().encode(dado) : new Uint8Array(dado);
  const buffer = await crypto.subtle.digest(algoritmo, bytes);
  const arr = new Uint8Array(buffer);
  const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  return {
    hex,
    bytes: arr,
    byteLength: bytes.length,
    bits: arr.length * 8
  };
}

// Converte Array de Bytes para String de Bits (0s e 1s)
function bytesParaBits(bytes) {
  let bits = '';
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, '0');
  }
  return bits;
}

// HMAC-SHA256 usando Web Crypto API
async function calcularHMAC(mensagem, segredo) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(segredo),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  const assinatura = await crypto.subtle.sign('HMAC', key, enc.encode(mensagem));
  return Array.from(new Uint8Array(assinatura)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// -------------------------------------------------------------
// Gerenciador de Abas
// -------------------------------------------------------------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Helper de cópia
function configurarCopia(btnId, outputId, statusId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const texto = document.getElementById(outputId).textContent;
    if (!texto || texto === '—') return;
    try {
      await navigator.clipboard.writeText(texto);
      if (statusId) {
        const s = document.getElementById(statusId);
        s.textContent = 'Hash copiado!';
        s.className = 'status-msg sucesso';
        setTimeout(() => { s.textContent = ''; }, 2500);
      }
    } catch {
      if (statusId) {
        const s = document.getElementById(statusId);
        s.textContent = 'Erro ao copiar.';
        s.className = 'status-msg erro';
      }
    }
  });
}

configurarCopia('m1-btn-copiar', 'm1-hash', 'm1-status');
configurarCopia('m3-btn-copiar-arq', 'm3-arq-hash', null);

// -------------------------------------------------------------
// MÓDULO 1: SHA-256 e SHA-512
// -------------------------------------------------------------
const m1Entrada = document.getElementById('m1-entrada');

async function processarM1(algoritmo) {
  const texto = m1Entrada.value;
  const res = await calcularHash(texto, algoritmo);

  document.getElementById('m1-bytes').textContent = `${res.byteLength} bytes`;
  document.getElementById('m1-chars').textContent = `${texto.length} caracteres`;
  document.getElementById('m1-algoritmo').textContent = algoritmo;
  document.getElementById('m1-bits').textContent = `${res.bits} bits`;
  document.getElementById('m1-hex-length').textContent = `${res.hex.length} caracteres hex`;
  document.getElementById('m1-hash').textContent = res.hex;
}

document.getElementById('m1-btn-sha256').addEventListener('click', () => processarM1('SHA-256'));
document.getElementById('m1-btn-sha512').addEventListener('click', () => processarM1('SHA-512'));

document.getElementById('m1-btn-limpar').addEventListener('click', () => {
  m1Entrada.value = '';
  document.getElementById('m1-bytes').textContent = '0 bytes';
  document.getElementById('m1-chars').textContent = '0 caracteres';
  document.getElementById('m1-algoritmo').textContent = '—';
  document.getElementById('m1-bits').textContent = '—';
  document.getElementById('m1-hex-length').textContent = '—';
  document.getElementById('m1-hash').textContent = '—';
});

// Testes rápidos da tabela do Slide 31
window.testarEntradaM1 = async function(texto, algoritmo) {
  m1Entrada.value = texto;
  await processarM1(algoritmo);
};

// Pré-computa a tabela de experimentos do Slide 31
async function popularTabelaExperimentos() {
  const testes = [
    { id: 1, texto: 'Professor Celso', alg: 'SHA-256' },
    { id: 2, texto: 'professor Celso', alg: 'SHA-256' },
    { id: 3, texto: 'Professor Celso!', alg: 'SHA-256' },
    { id: 4, texto: '', alg: 'SHA-256' }
  ];

  for (const t of testes) {
    const res = await calcularHash(t.texto, t.alg);
    document.getElementById(`t-bits-${t.id}`).textContent = `${res.bits} bits`;
    document.getElementById(`t-len-${t.id}`).textContent = `${res.hex.length}`;
    document.getElementById(`t-hash-${t.id}`).textContent = res.hex;
  }
}
popularTabelaExperimentos();

// -------------------------------------------------------------
// MÓDULO 2: EFEITO AVALANCHE (Prática 2)
// -------------------------------------------------------------
async function compararAvalanche() {
  const a = document.getElementById('m2-entrada-a').value;
  const b = document.getElementById('m2-entrada-b').value;

  const resA = await calcularHash(a, 'SHA-256');
  const resB = await calcularHash(b, 'SHA-256');

  document.getElementById('m2-hash-a').textContent = resA.hex;
  document.getElementById('m2-hash-b').textContent = resB.hex;

  // Comparação em caracteres hex
  let charsDiff = 0;
  for (let i = 0; i < 64; i++) {
    if (resA.hex[i] !== resB.hex[i]) charsDiff++;
  }
  document.getElementById('m2-chars-diff').textContent = `${charsDiff}`;

  // Comparação em Bits
  const bitsA = bytesParaBits(resA.bytes);
  const bitsB = bytesParaBits(resB.bytes);

  let bitsDiff = 0;
  let visualHtml = '';

  for (let i = 0; i < 256; i++) {
    if (bitsA[i] !== bitsB[i]) {
      bitsDiff++;
      visualHtml += '<span class="bit-box bit-diff" title="Bit ' + i + ': diferente"></span>';
    } else {
      visualHtml += '<span class="bit-box bit-equal" title="Bit ' + i + ': igual"></span>';
    }
  }

  const pct = ((bitsDiff / 256) * 100).toFixed(2);
  document.getElementById('m2-bits-diff').textContent = `${bitsDiff}`;
  document.getElementById('m2-pct-diff').textContent = `${pct}%`;
  document.getElementById('m2-visualizacao-bits').innerHTML = visualHtml;
}

document.getElementById('m2-btn-comparar').addEventListener('click', compararAvalanche);
document.getElementById('m2-btn-limpar').addEventListener('click', () => {
  document.getElementById('m2-entrada-a').value = '';
  document.getElementById('m2-entrada-b').value = '';
  document.getElementById('m2-hash-a').textContent = '—';
  document.getElementById('m2-hash-b').textContent = '—';
  document.getElementById('m2-bits-diff').textContent = '—';
  document.getElementById('m2-pct-diff').textContent = '—';
  document.getElementById('m2-chars-diff').textContent = '—';
  document.getElementById('m2-visualizacao-bits').innerHTML = '—';
});

// Executa inicialmente para preencher os valores padrão
compararAvalanche();

// -------------------------------------------------------------
// MÓDULO 3: VERIFICADOR DE INTEGRIDADE (Práticas 3 e 4)
// -------------------------------------------------------------
const m3Original = document.getElementById('m3-original');
const m3Recebido = document.getElementById('m3-recebido');

function atualizarBytesTexto() {
  const bOrig = new TextEncoder().encode(m3Original.value).length;
  const bRec = new TextEncoder().encode(m3Recebido.value).length;
  document.getElementById('m3-bytes-original').textContent = `${bOrig} bytes`;
  document.getElementById('m3-bytes-recebido').textContent = `${bRec} bytes`;
}

m3Original.addEventListener('input', atualizarBytesTexto);
m3Recebido.addEventListener('input', atualizarBytesTexto);

document.getElementById('m3-btn-verificar').addEventListener('click', async () => {
  const orig = m3Original.value;
  const rec = m3Recebido.value;

  const hOrig = await calcularHash(orig, 'SHA-256');
  const hRec = await calcularHash(rec, 'SHA-256');

  const badge = document.getElementById('m3-resultado-badge');
  if (hOrig.hex === hRec.hex) {
    badge.className = 'badge-status confirmada';
    badge.textContent = '✓ INTEGRIDADE CONFIRMADA (Hashes idênticos)';
  } else {
    badge.className = 'badge-status alterada';
    badge.textContent = '✗ CONTEÚDO ALTERADO (Hashes divergentes)';
  }
});

// Leitura de Arquivo (Prática 4)
document.getElementById('m3-arquivo-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('m3-arq-nome').textContent = file.name;
  document.getElementById('m3-arq-bytes').textContent = `${file.size.toLocaleString()} bytes`;
  document.getElementById('m3-arq-tamanho').textContent = formatarTamanho(file.size);

  const buffer = await file.arrayBuffer();
  const res = await calcularHash(buffer, 'SHA-256');

  document.getElementById('m3-arq-hash').textContent = res.hex;
  document.getElementById('m3-arquivo-info').style.display = 'block';
});

function formatarTamanho(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// -------------------------------------------------------------
// MÓDULO 4: HASH SIMPLES X HMAC (Prática 6)
// -------------------------------------------------------------
async function processarModulo4() {
  const msg = document.getElementById('m4-mensagem').value;
  const chave = document.getElementById('m4-chave').value;

  const sha = await calcularHash(msg, 'SHA-256');
  const hmac = await calcularHMAC(msg, chave);

  document.getElementById('m4-res-sha').textContent = sha.hex;
  document.getElementById('m4-res-hmac').textContent = hmac;

  const badge = document.getElementById('m4-status-autenticidade');
  badge.className = 'badge-status confirmada';
  badge.textContent = '✓ Tag HMAC Válida: Integridade e Autenticidade Garantidas pela Chave Secreta';
}

document.getElementById('m4-btn-gerar').addEventListener('click', processarModulo4);

document.getElementById('m4-btn-tamper').addEventListener('click', async () => {
  const msgInput = document.getElementById('m4-mensagem');
  msgInput.value = msgInput.value.replace('1500.00', '9999.00');

  // Recalcula apenas o SHA-256 simulando que o atacante gerou um novo hash
  const novaMsg = msgInput.value;
  const novoSha = await calcularHash(novaMsg, 'SHA-256');
  document.getElementById('m4-res-sha').textContent = novoSha.hex;

  // A tag HMAC original não confere com a nova mensagem!
  const badge = document.getElementById('m4-status-autenticidade');
  badge.className = 'badge-status alterada';
  badge.textContent = '✗ ALERTA DE SEGURANÇA: Mensagem adulterada! O HMAC anterior foi invalidado e o atacante não pôde gerar nova tag sem a chave secreta.';
});

processarModulo4();

// -------------------------------------------------------------
// MÓDULO 5: DESAFIO ITA (Slide 39)
// -------------------------------------------------------------
async function executarDesafioITA() {
  const a1 = document.getElementById('m5-a1').value;
  const a2 = document.getElementById('m5-a2').value;
  const b1 = document.getElementById('m5-b1').value;
  const b2 = document.getElementById('m5-b2').value;

  // Serialização ingênua (concatenação pura)
  const naiveA = a1 + a2;
  const naiveB = b1 + b2;
  const hashNaiveA = await calcularHash(naiveA, 'SHA-256');
  const hashNaiveB = await calcularHash(naiveB, 'SHA-256');

  document.getElementById('m5-in-a-naive').textContent = `"${naiveA}"`;
  document.getElementById('m5-in-b-naive').textContent = `"${naiveB}"`;
  document.getElementById('m5-hash-a-naive').textContent = hashNaiveA.hex;
  document.getElementById('m5-hash-b-naive').textContent = hashNaiveB.hex;

  // Serialização canônica (JSON estrito não ambíguo)
  const jsonA = JSON.stringify({ c1: a1, c2: a2 });
  const jsonB = JSON.stringify({ c1: b1, c2: b2 });
  const hashJsonA = await calcularHash(jsonA, 'SHA-256');
  const hashJsonB = await calcularHash(jsonB, 'SHA-256');

  document.getElementById('m5-in-a-json').textContent = jsonA;
  document.getElementById('m5-in-b-json').textContent = jsonB;
  document.getElementById('m5-hash-a-json').textContent = hashJsonA.hex;
  document.getElementById('m5-hash-b-json').textContent = hashJsonB.hex;
}

document.getElementById('m5-btn-demonstrar').addEventListener('click', executarDesafioITA);
executarDesafioITA();
