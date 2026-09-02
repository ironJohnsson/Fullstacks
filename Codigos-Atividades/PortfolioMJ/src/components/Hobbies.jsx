function Hobbies({ hobbies }) {
  return (
    <section id="hobbies">
      <h2>Hobbies & Interesses</h2>

      <p className="subtitulo-secao">
        Conheça um pouco das minhas paixões fora do ambiente acadêmico e profissional.
      </p>

      <div className="hobbies-scroll">
        {hobbies.map((hobby, index) => (
          <div className="hobby-card" key={index}>
            <div className="hobby-img-wrapper">
              <img
                src={hobby.imagem}
                alt={hobby.titulo}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/280x170?text=" + hobby.titulo;
                }}
              />
            </div>

            <div className="hobby-content">
              <h3>{hobby.titulo}</h3>
              <p>{hobby.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hobbies;