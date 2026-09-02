function Certificacoes({ certificacoes }) {
  return (
    <section id="certificacoes">
      <h2>Certificações & Cursos</h2>

      <div className="certificacoes-grid">
        {certificacoes.map((certificacao, index) => (
          <div key={index} className="certificacao-item">
            <span className="cert-icon"></span>
            <span>{certificacao}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Certificacoes;