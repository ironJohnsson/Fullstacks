import CardAtividade from '../components/CardAtividade.jsx'
import { activities } from '../data/activities.js'

function Home() {
  return (
    <div className="home-page">
      <header className="site-header">
        <div className="identity">
          <img
            className="avatar"
            src="/image.png"
            alt="Avatar ilustrado de Matheus Luiz Neves Johnsson"
          />
          <div>
            <p className="eyebrow">SENAI CIMATEC · Engenharia de Computação</p>
            <h1>Matheus Luiz Neves Johnsson</h1>
            <p className="intro">
              Portfólio das atividades práticas do meu percurso em desenvolvimento
              web, construído etapa por etapa com React, HTML, CSS e Git.
            </p>
          </div>
        </div>
        <nav aria-label="Navegação principal">
          <a className="activities-button" href="#activities-title">
            Ver atividades
          </a>
        </nav>
      </header>

      <main>
        <section className="activities-section" aria-labelledby="activities-title">
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
      </main>
      <footer className="site-footer">
        <p>Portfólio de atividades · Desenvolvimento web</p>
      </footer>
    </div>
  )
}

export default Home