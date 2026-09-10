import CardAtividade from '../components/CardAtividade.jsx'
import Contato from '../components/Contato.jsx'
import { activities } from '../data/activities.js'

function Home() {
  return (
    <>
      <main>
        <section className="intro-section" id="inicio" aria-labelledby="intro-title">
          <h2 id="intro-title">Bem-vindo ao meu portfólio</h2>
          <p>Use o menu para conhecer o projeto e acessar rapidamente as atividades.</p>
          <a className="activities-button" href="#atividades">Ver atividades</a>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-title">
          <p className="eyebrow">Sobre</p>
          <h2 id="about-title">Aprendizado em desenvolvimento web</h2>
          <p>
            Este portfólio reúne as etapas práticas do curso e registra a evolução
            do projeto com tecnologias web e controle de versão.
          </p>
        </section>

        <section className="activities-section" id="atividades" aria-labelledby="activities-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Percurso prático</p>
              <h2 id="activities-title">Atividades do roteiro</h2>
            </div>
            <p className="progress-label">{activities.length} etapas planejadas</p>
          </div>

          <ol className="activities-list">
            {activities.map((activity) => (
              <li key={activity.id}>
                <CardAtividade activity={activity} />
              </li>
            ))}
          </ol>
        </section>

        <Contato />
      </main>
    </>
  )
}

export default Home