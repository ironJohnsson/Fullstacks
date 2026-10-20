function Certificacoes({ dados }) {
  return (
    <section id="certificacoes">
      <h2>{dados.titulo}</h2>

      <div className="certificacoes-grid">
        {dados.lista.map((certificacao, index) => (
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
