function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div>
          <span className="etiqueta">Psicologia e acolhimento</span>
          <h1>Um espaço seguro para cuidar de você</h1>
          <p>Um espaço de escuta, acolhimento e reflexão para momentos importantes da sua trajetória.</p>
          <div className="grupo-botoes">
            <a className="botao" href="#contato">Solicitar atendimento</a>
            <a className="botao botao-secundario" href="#sobre">Conhecer a profissional</a>
          </div>
          <small>Atendimento sujeito à disponibilidade.</small>
        </div>
        <div className="foto-placeholder" aria-label="Espaço reservado para fotografia autorizada">
          <span>JM</span>
          <p>Fotografia profissional autorizada</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;