import { useState } from 'react'
import CardAtividade from '../components/CardAtividade.jsx'
import Contato from '../components/Contato.jsx'
import { activities } from '../data/activities.js'

function Home() {
  const [technologyFilter, setTechnologyFilter] = useState('Todos')
  const technologies = ['Todos', 'HTML', 'CSS', 'React', 'Git', 'Vercel']
  const filteredActivities =
    technologyFilter === 'Todos'
      ? activities
      : activities.filter((activity) => activity.tecnologia.toLowerCase().includes(technologyFilter.toLowerCase()))

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
            <p className="progress-label">{filteredActivities.length} de {activities.length} atividades exibidas</p>
          </div>

          <div className="technology-filters" aria-label="Filtrar atividades por tecnologia">
            {technologies.map((technology) => (
              <button
                className={technologyFilter === technology ? 'filter-button filter-button-active' : 'filter-button'}
                key={technology}
                type="button"
                aria-pressed={technologyFilter === technology}
                onClick={() => setTechnologyFilter(technology)}
              >
                {technology}
              </button>
            ))}
          </div>

          <ol className="activities-list">
            {filteredActivities.map((activity) => (
              <li key={activity.id}>
                <CardAtividade
                  number={activity.id}
                  title={activity.titulo}
                  description={activity.descricao}
                  technology={activity.tecnologia}
                  status={activity.status}
                  link={activity.link}
                  evidence={activity.evidence}
                />
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