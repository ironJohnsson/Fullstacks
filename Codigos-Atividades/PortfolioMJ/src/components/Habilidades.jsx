function Habilidades({ buscaHabilidade, setBuscaHabilidade, habilidadesFiltradas }) {
  return (
    <section id="habilidades">
      <h2>Habilidades</h2>

      <div className="busca-wrapper busca-habilidade">
        <input
          type="text"
          placeholder=" Filtrar habilidades..."
          value={buscaHabilidade}
          onChange={(e) => setBuscaHabilidade(e.target.value)}
          className="input-busca"
        />
      </div>

      <ul className="lista-habilidades">
        {habilidadesFiltradas.map((habilidade, index) => (
          <li key={index} className="habilidade-item">
            <span className="habilidade-nome">{habilidade.nome}</span>
            <span className="habilidade-tipo">{habilidade.tipo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Habilidades;