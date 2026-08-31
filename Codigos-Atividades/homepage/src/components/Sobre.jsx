function Sobre() {
  return (
    <section className="secao" id="sobre">
      <div className="container sobre-grid">
        <div>
          <p className="titulo-secao">Sobre</p>
          <h2>Psicóloga Jarsia Melo</h2>
          <p>A proposta desta homepage é apresentar um espaço de escuta, acolhimento e reflexão, respeitando a singularidade de cada pessoa.</p>
          <p><strong>CRP: [confirmar número profissional]</strong></p>
        </div>
        <aside className="quadro-compromissos">
          <h3>Compromissos do atendimento</h3>
          <ul>
            <li>Escuta profissional</li>
            <li>Respeito</li>
            <li>Sigilo</li>
            <li>Atendimento agendado</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default Sobre;