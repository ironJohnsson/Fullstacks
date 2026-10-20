function Marquee({ itens }) {
  // Duplica os itens para criar o loop contínuo e suave no carrossel
  const listaExibicao = itens && itens.length > 0 ? [...itens, ...itens] : [];

  return (
    <div className="marquee-container">
      <div className="marquee">
        {listaExibicao.map((item, index) => (
          <span key={index} className="marquee-item">
            <span>{item}</span>
            <span className="marquee-sep">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
