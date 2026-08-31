import CardServico from "./CardServico";
import { servicos } from "../data/conteudo";

function Servicos() {
  return (
    <section className="secao secao-clara" id="servicos">
      <div className="container">
        <p className="titulo-secao">Serviços</p>
        <h2>Possibilidades de cuidado</h2>
        <div className="grade-servicos">
          {servicos.map((servico) => (
            <CardServico
              key={servico.id}
              icone={servico.icone}
              titulo={servico.titulo}
              descricao={servico.descricao}
              modalidade={servico.modalidade}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Servicos;