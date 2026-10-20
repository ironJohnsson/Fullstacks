function Projetos({
  dados,
  categoriaFiltro,
  setCategoriaFiltro,
  buscaProjeto,
  setBuscaProjeto,
  projetosFiltrados,
  projetoExpandidoId,
  toggleExpandirProjeto
}) {
  return (
    <section id="projetos">
      <h2>{dados.titulo}</h2>

      <div className="projetos-controles">
        <div className="filtros-categoria">
          {dados.categorias.map((cat) => (
            <button
              key={cat.id}
              className={`btn-filtro ${categoriaFiltro === cat.id ? "ativo" : ""}`}
              onClick={() => setCategoriaFiltro(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="busca-wrapper">
          <input
            type="text"
            placeholder={dados.placeholderBusca}
            value={buscaProjeto}
            onChange={(e) => setBuscaProjeto(e.target.value)}
            className="input-busca"
          />
          {buscaProjeto && (
            <button className="btn-limpar" onClick={() => setBuscaProjeto("")}>✕</button>
          )}
        </div>
      </div>

      <div className="projetos-grid">
        {projetosFiltrados.length > 0 ? (
          projetosFiltrados.map((projeto) => {
            const isExpandido = projetoExpandidoId === projeto.id;
            return (
              <div
                className={`projeto-card ${isExpandido ? "expandido" : ""}`}
                key={projeto.id}
              >
                <div className="projeto-card-top">
                  <div className="projeto-header">
                    <h3>{projeto.titulo}</h3>
                    <span className="categoria-tag">{projeto.categoria}</span>
                  </div>

                  <p className="projeto-desc">{projeto.descricao}</p>

                  <div className="tags-container">
                    {projeto.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-ver-mais"
                  onClick={() => toggleExpandirProjeto(isExpandido ? null : projeto.id)}
                >
                  {isExpandido ? dados.recolher : dados.verMais}
                </button>

                {isExpandido && (
                  <div className="projeto-detalhes-box">
                    <div className="detalhes-header">
                      <h4>{dados.detalhesTitulo}</h4>
                    </div>
                    <p className="detalhes-texto">{projeto.detalhes}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="sem-resultados">
            {dados.semResultados(buscaProjeto)}
          </p>
        )}
      </div>
    </section>
  );
}

export default Projetos;
