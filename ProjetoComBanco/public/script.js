const form = document.querySelector('#formulario');
const mensagem = document.querySelector('#mensagem');

async function carregarUsuarios() {
  const resposta = await fetch('/usuarios');
  const usuarios = await resposta.json();

  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    document.querySelector('#lista').innerHTML = '<li style="color: #94a3b8;">Nenhum usuário cadastrado ainda.</li>';
    return;
  }

  document.querySelector('#lista').innerHTML = usuarios
    .map(u => `<li><strong>${u.nome}</strong> — ${u.email}</li>`).join('');
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;

  const resposta = await fetch('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  });

  if (resposta.ok) {
    mensagem.textContent = 'Cadastro realizado!';
    mensagem.className = 'sucesso';
    form.reset();
    carregarUsuarios();
  } else {
    mensagem.textContent = 'Erro ao cadastrar.';
    mensagem.className = 'erro';
  }
});

carregarUsuarios();
