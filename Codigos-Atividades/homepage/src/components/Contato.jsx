import { useState } from "react";

function Contato() {
  const [mensagemEnviada, setMensagemEnviada] = useState(false);

  function enviarFormulario(evento) {
    evento.preventDefault();
    setMensagemEnviada(true);
    evento.target.reset();
  }

  return (
    <section className="secao" id="contato">
      <div className="container contato-grid">
        <div>
          <p className="titulo-secao">Contato</p>
          <h2>Vamos conversar?</h2>
          <p>Preencha os campos para testar a experiência do formulário.</p>
          <p><strong>Telefone e e-mail: [confirmar contatos profissionais]</strong></p>
        </div>

        <form className="formulario" onSubmit={enviarFormulario}>
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" type="text" required />

          <label htmlFor="contato">Telefone ou e-mail</label>
          <input id="contato" name="contato" type="text" required />

          <label htmlFor="mensagem">Mensagem inicial</label>
          <textarea id="mensagem" name="mensagem" rows="5" required></textarea>

          <button className="botao" type="submit">Enviar solicitação</button>
          {mensagemEnviada && (
            <p className="mensagem-sucesso">
              Solicitação demonstrativa registrada na interface.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contato;