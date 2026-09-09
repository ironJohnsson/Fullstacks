import CardAtividade from '../components/CardAtividade.jsx'
import Contato from '../components/Contato.jsx'
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
          <a href="#inicio">Início</a>
          <a href="#sobre">Sobre</a>
          <a href="#atividades">Atividades</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

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
      <footer className="site-footer">
        <p>Portfólio de atividades · Desenvolvimento web</p>
      </footer>
    </div>
  )
}

export default Home