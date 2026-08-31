function CardServico({ icone, titulo, descricao, modalidade }) {
  return (
    <article className="card-servico">
      <span className="icone-servico" aria-hidden="true">{icone}</span>
      <h3>{titulo}</h3>
      <p>{descricao}</p>
      <span className="modalidade">{modalidade}</span>
    </article>
  );
}

export default CardServico;