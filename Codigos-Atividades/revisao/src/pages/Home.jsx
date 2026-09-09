import CardAtividade from '../components/CardAtividade.jsx'
import { activities } from '../data/activities.js'

function Home() {
  return (
    <div className="home-page">
      <header className="site-header">
        <p className="eyebrow">Universidade Senai Cimatec · 2026</p>
        <h1>Portfólio de atividades</h1>
        <p className="intro">
          Uma coleção organizada do meu percurso em desenvolvimento web,
          construída etapa por etapa com React, HTML, CSS e Git.
        </p>
        <nav aria-label="Navegação principal">
          <a href="#activities-title">Atividades</a>
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