function Sobre({ dados }) {
  return (
    <section id="sobre">
      <h2>{dados.titulo}</h2>
      <div className="sobre-card">
        {dados.paragrafos.map((p, idx) => (
          <p key={idx}>
            {p.prefix}
            {p.strong1 && <strong>{p.strong1}</strong>}
            {p.middle}
            {p.strong2 && <strong>{p.strong2}</strong>}
            {p.suffix}
          </p>
        ))}
      </div>
    </section>
  );
}

export default Sobre;
