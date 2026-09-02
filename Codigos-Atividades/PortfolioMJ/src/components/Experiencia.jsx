function Experiencia({ experiencias }) {
  return (
    <section id="experiencia">
      <h2>Experiência</h2>

      <div className="timeline">
        {experiencias.map((experiencia, index) => (
          <div className="experiencia-card" key={index}>
            <div className="exp-header">
              <h3>{experiencia.empresa}</h3>
              <span className="exp-periodo">{experiencia.periodo}</span>
            </div>
            <h4 className="exp-cargo">{experiencia.cargo}</h4>
            <p>{experiencia.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experiencia;