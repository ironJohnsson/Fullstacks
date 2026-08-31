function Beneficios() {
  const beneficios = [
    "Atendimento centrado na pessoa",
    "Ambiente respeitoso e acolhedor",
    "Privacidade e sigilo profissional",
    "Comunicação clara sobre o processo"
  ];

  return (
    <section className="secao" id="beneficios">
      <div className="container">
        <p className="titulo-secao">Benefícios</p>
        <h2>Uma experiência planejada com cuidado</h2>
        <div className="grade-beneficios">
          {beneficios.map((beneficio, indice) => (
            <article className="beneficio" key={beneficio}>
              <span>{String(indice + 1).padStart(2, "0")}</span>
              <p>{beneficio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Beneficios;