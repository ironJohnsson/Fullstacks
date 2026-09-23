const form = document.querySelector('#formulario');
const mensagem = document.querySelector('#mensagem');

async function carregarUsuarios() {
  try {
    const resposta = await fetch('/usuarios');
    if (!resposta.ok) {
      console.warn('Servidor retornou status:', resposta.status);
      return;
    }
    const usuarios = await resposta.json();
    if (Array.isArray(usuarios)) {
      document.querySelector('#lista').innerHTML = usuarios
        .map(u => `<li>${u.nome} — ${u.email}</li>`).join('');
    }
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;

  mensagem.textContent = 'Enviando...';

  try {
    const resposta = await fetch('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    });

    if (resposta.ok) {
      mensagem.textContent = 'Cadastro realizado!';
      mensagem.style.color = 'green';
      form.reset();
      carregarUsuarios();
    } else {
      const dados = await resposta.json().catch(() => ({}));
      mensagem.textContent = dados.erro || 'Erro ao cadastrar.';
      mensagem.style.color = 'red';
    }
  } catch (err) {
    mensagem.textContent = 'Erro de conexão com o servidor.';
    mensagem.style.color = 'red';
  }
});

carregarUsuarios();
