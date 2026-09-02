function Contato() {
  return (
    <section id="contato">
      <h2>Contato</h2>

      <p>Sinta-se à vontade para se conectar comigo:</p>

      <div className="redes-sociais">
        <a
          href="mailto:mattluiz.johnsson@gmail.com"
          aria-label="E-mail"
          className="social-btn"
        >
          <img src="/img/email.png" alt="E-mail" onError={(e) => (e.target.style.display = "none")} />
          <span>E-mail</span>
        </a>

        <a
          href="https://github.com/ironJohnsson"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="social-btn"
        >
          <img src="/img/github.png" alt="GitHub" onError={(e) => (e.target.style.display = "none")} />
          <span>GitHub</span>
        </a>

        <a
          href="https://www.linkedin.com/in/matheus-luiz-johnsson-9981642b/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="social-btn"
        >
          <img src="/img/linkedin.png" alt="LinkedIn" onError={(e) => (e.target.style.display = "none")} />
          <span>LinkedIn</span>
        </a>

        <a
          href="http://lattes.cnpq.br/2290172202945405"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lattes"
          className="social-btn"
        >
          <img src="/img/lattes.png" alt="Lattes" onError={(e) => (e.target.style.display = "none")} />
          <span>Lattes</span>
        </a>
      </div>
    </section>
  );
}

export default Contato;