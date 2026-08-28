import { useState, useEffect } from "react";
import "./App.css";

function Typewriter() {
  const frases = [
    "Engenharia da Computação - SENAI CIMATEC",
    "Bacharelado em Computação - UFBA",
    "Desenvolvedor XR & Games (Unreal & Unity)",
    "Pesquisador em Computação Quântica",
    "Bolsista QUIIN - HIIVE LAB"
  ];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    if (subIndex === frases[index].length + 1 && !deletando) {
      const timeout = setTimeout(() => setDeletando(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && deletando) {
      setDeletando(false);
      setIndex((prev) => (prev + 1) % frases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deletando ? -1 : 1));
    }, deletando ? 30 : 70);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deletando, frases]);

  return (
    <div className="typewriter-container">
      <span className="typewriter-text">{frases[index].substring(0, subIndex)}</span>
      <span className="cursor">|</span>
    </div>
  );
}

function App() {
  const [secaoAtiva, setSecaoAtiva] = useState("inicio");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [buscaProjeto, setBuscaProjeto] = useState("");
  const [buscaHabilidade, setBuscaHabilidade] = useState("");
  const [projetoExpandidoId, setProjetoExpandidoId] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarVoltarTopo, setMostrarVoltarTopo] = useState(false);

  // ScrollSpy e Botão Voltar ao Topo
  useEffect(() => {
    const handleScroll = () => {
      setMostrarVoltarTopo(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSecaoAtiva(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const secoes = document.querySelectorAll("section");
    secoes.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      secoes.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  const projetos = [
    {
      id: 1,
      titulo: "Quiin VR",
      categoria: "VR / AR",
      tags: ["Unreal Engine", "VR", "Computação Quântica", "BB84"],
      descricao:
        "O projeto QUIIN VR propõe o desenvolvimento de um ambiente imersivo de realidade virtual para o ensino de conceitos de computação e criptografia quântica.",
      detalhes:
        "Utilizando a Unreal Engine e dispositivos de realidade virtual, a experiência permitirá aos usuários explorar conceitos abstratos de forma interativa, com destaque para o protocolo BB84, contribuindo para a democratização do ensino de tecnologias quânticas e tornando o aprendizado mais visual, acessível e envolvente."
    },
    {
      id: 2,
      titulo: "WINE",
      categoria: "VR / AR",
      tags: ["Unreal Engine", "Vídeo 360°", "Enoturismo"],
      descricao:
        "O projeto WINE tinha como proposta um tour virtual imersivo por uma vinícola de Morro do Chapéu, Bahia, utilizando a Unreal Engine, imagens e vídeos em 360°.",
      detalhes:
        "A experiência permitirá explorar a vinícola, conhecer sua produção, terroir e aspectos culturais, ampliando o acesso ao enoturismo e valorizando a vitivinicultura regional."
    },
    {
      id: 3,
      titulo: "Exposição didática de invertebrados fósseis",
      categoria: "3D & Impressão",
      tags: ["Modelagem 3D", "Impressão 3D", "Divulgação Científica"],
      descricao:
        "O projeto propõe a criação de modelos 3D de fósseis de invertebrados, visando democratizar o acesso ao conhecimento paleontológico.",
      detalhes:
        "As peças, acompanhadas de informações científicas, serão utilizadas em atividades de ensino, divulgação científica e formação acadêmica, contribuindo para aproximar estudantes e sociedade da paleontologia."
    },
    {
      id: 4,
      titulo: "Presence Training",
      categoria: "Simulação",
      tags: ["Unity", "VR", "Segurança do Trabalho", "Simulação"],
      descricao:
        "O projeto Presence Training propõe uma experiência imersiva de treinamento para atividades em altura, como limpeza de vidros e fachadas de edifícios, utilizando a Unity e óculos de realidade virtual.",
      detalhes:
        "A experiência simula situações de trabalho e apresenta procedimentos, métodos de segurança e boas práticas, permitindo que os usuários aprendam e praticuem em um ambiente controlado e seguro, contribuindo para a prevenção de acidentes."
    }
  ];

  const categorias = ["Todos", "VR / AR", "3D & Impressão", "Simulação"];

  const projetosFiltrados = projetos.filter((projeto) => {
    const atendeCategoria =
      categoriaFiltro === "Todos" || projeto.categoria === categoriaFiltro;
    const atendeBusca =
      projeto.titulo.toLowerCase().includes(buscaProjeto.toLowerCase()) ||
      projeto.descricao.toLowerCase().includes(buscaProjeto.toLowerCase()) ||
      projeto.tags.some((tag) =>
        tag.toLowerCase().includes(buscaProjeto.toLowerCase())
      );
    return atendeCategoria && atendeBusca;
  });

  const habilidades = [
    { nome: "Computação Quântica", tipo: "Avançado" },
    { nome: "C++", tipo: "Linguagem" },
    { nome: "C", tipo: "Linguagem" },
    { nome: "C#", tipo: "Linguagem" },
    { nome: "Java", tipo: "Linguagem" },
    { nome: "Python", tipo: "Linguagem" },
    { nome: "Unreal Engine 5", tipo: "Engine" },
    { nome: "Unity", tipo: "Engine" },
    { nome: "GameMaker", tipo: "Engine" },
    { nome: "Realidade Virtual (VR)", tipo: "Tecnologia" },
    { nome: "Impressão 3D (Filamento & Resina)", tipo: "Hardware" },
    { nome: "Modelagem 3D", tipo: "Design" },
    { nome: "Git / GitHub", tipo: "Ferramenta" },
    { nome: "Pesquisa e Desenvolvimento", tipo: "Metodologia" },
    { nome: "English Certificate C2", tipo: "Idioma" },
    { nome: "Google Cloud Computing", tipo: "Cloud" },
    { nome: "Design de Games", tipo: "Design" }
  ];

  const habilidadesFiltradas = habilidades.filter((h) =>
    h.nome.toLowerCase().includes(buscaHabilidade.toLowerCase())
  );

  const experiencias = [
    {
      empresa: "QUIIN - Hiive Lab",
      cargo: "Bolsista de Pesquisa e Desenvolvimento",
      periodo: "Maio de 2026 - Presente",
      descricao: "Desenvolvimento de simulações e ambientes imersivos VR voltados para o ensino de computação quântica."
    },
    {
      empresa: "Universidade Senai Cimatec",
      cargo: "Voluntário",
      periodo: "Junho de 2025 - Junho de 2026",
      descricao: "Atuação em projetos acadêmicos e extensão tecnológica."
    },
    {
      empresa: "Universidade Federal da Bahia",
      cargo: "Voluntário",
      periodo: "Junho de 2025 - Junho de 2026",
      descricao: "Apoio a pesquisas e desenvolvimento de modelos didáticos 3D."
    },
    {
      empresa: "IEEE",
      cargo: "Trainee",
      periodo: "Agosto de 2024 - Agosto de 2025",
      descricao: "Participação em grupos de estudo, organização de eventos e capacitação técnica."
    }
  ];

  const certificacoes = [
    "Curso de curta duração - Unreal Engine 5 Blueprints",
    "Curso de curta duração - Modelagem & Impressão 3D",
    "Curso de curta duração - Java + Programação Orientada a Objetos",
    "Curso de curta duração - Impressão 3D em Resina",
    "Curso de curta duração - Desenvolvimento de Jogos com Unity",
    "Curso de curta duração - Curso GameMaker",
    "Curso de curta duração - Captação de imagens com câmera 360° para Realidade Virtual",
    "Curso de curta duração - Google Cloud Computing Foundations",
    "Curso de curta duração - Hardware de Computadores"
  ];

  const hobbies = [
    {
      titulo: "Jogos",
      imagem: "/img/hobbies/games.png",
      descricao:
        "Gosto de jogar tanto jogos online quanto de tabletop e explorar diferentes gêneros, além de me interessar por game design e desenvolvimento."
    },
    {
      titulo: "Impressão 3D",
      imagem: "/img/hobbies/impressao3d.png",
      descricao:
        "Tenho interesse em modelagem e impressão 3D, explorando tanto o uso de filamento quanto resina."
    },
    {
      titulo: "Viajar",
      imagem: "/img/hobbies/travel.png",
      descricao:
        "Gosto de viajar pelo país, normalmente atravessando a Bahia até chegar no interior de Minas na vila de Maringá/Mauá."
    },
    {
      titulo: "Cozinhar",
      imagem: "/img/hobbies/Cozinhar.png",
      descricao:
        "Tenho o costume de cozinhar normalmente massas, biscoitos e bolos. Também estou produzindo diferentes sabores de cachaça quando viajo."
    },
    {
      titulo: "Basquete",
      imagem: "/img/hobbies/Basquete.png",
      descricao:
        "Pratico basquete por 12 anos, tendo participação em times na época de colégio por 4 anos, e uma rápida participação na atlética durante a faculdade."
    },
    {
      titulo: "Música",
      imagem: "/img/hobbies/musica.jpg",
      descricao:
        "Tenho interesse em ouvir música, explorando diferentes estilos e artistas de diferentes locais do mundo de diferentes épocas e diferentes gêneros."
    },
    {
      titulo: "Leitura",
      imagem: "/img/hobbies/livro.png",
      descricao:
        "Gosto de ler livros e quadrinhos, tendo mantido coleções de quadrinhos e explorado diversos livros tanto didáticos quanto por lazer."
    }

  ];

  const navegarPara = (id) => {
    setMenuAberto(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpandirProjeto = (id) => {
    setProjetoExpandidoId((prevId) => (prevId === id ? null : id));
  };

  return (
    <main className="container">
      {/* NAVBAR */}
      <nav className="navbar">
        <button
          className="menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Alternar Menu"
        >
          {menuAberto ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuAberto ? "aberto" : ""}`}>
          {[
            { id: "inicio", label: "Início" },
            { id: "sobre", label: "Sobre" },
            { id: "projetos", label: "Projetos" },
            { id: "habilidades", label: "Habilidades" },
            { id: "experiencia", label: "Experiência" },
            { id: "certificacoes", label: "Certificações" },
            { id: "hobbies", label: "Hobbies" },
            { id: "contato", label: "Contato" }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={secaoAtiva === item.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                navegarPara(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO / INÍCIO */}
      <section id="inicio" className="hero-section">
        <div className="foto-wrapper">
          <img
            src="/img/foto.jpg"
            alt="Matheus Luiz Neves Johnsson"
            className="foto-perfil"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <h1>Matheus Luiz Neves Johnsson</h1>

        <Typewriter />

        <div className="hero-tags">
          <span className="badge">SENAI CIMATEC</span>
          <span className="badge">UFBA</span>
          <span className="badge">HIIVE LAB</span>
        </div>
      </section>

      {/* MARQUEE ANIMADO */}
      <div className="marquee-container">
        <div className="marquee">
          <span> Bem-vindo ao meu portfólio!</span>
          <span>•</span>
          <span>Programação</span>
          <span>•</span>
          <span>Computação Quântica</span>
          <span>•</span>
          <span>Realidade Virtual (VR)</span>
          <span>•</span>
          <span>Impressão 3D</span>
          <span>•</span>
          <span>Unreal Engine 5</span>
        </div>
      </div>

      {/* SOBRE MIM */}
      <section id="sobre">
        <h2>Sobre Mim</h2>
        <div className="sobre-card">
          <p>
            Sou estudante de <strong>Engenharia de Computação no SENAI CIMATEC</strong> e
            de <strong>Computação na Universidade Federal da Bahia (UFBA)</strong>, com
            foco em desenvolvimento de software, ambientes imersivos em realidade
            virtual e pesquisa aplicada.
          </p>
          <p>
            Atualmente atuo como <strong>Bolsista do programa QUIIN no Hiive Lab (SENAI CIMATEC)</strong>,
            desenvolvendo soluções tecnológicas voltadas para inovação no ensino
            e buscando conectar a pesquisa acadêmica a aplicações práticas de alto impacto.
          </p>
        </div>
      </section>

      {/* PROJETOS */}
      <section id="projetos">
        <h2>Meus Projetos</h2>

        <div className="projetos-controles">
          <div className="filtros-categoria">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`btn-filtro ${categoriaFiltro === cat ? "ativo" : ""}`}
                onClick={() => setCategoriaFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="busca-wrapper">
            <input
              type="text"
              placeholder=" Buscar projetos ou tecnologias..."
              value={buscaProjeto}
              onChange={(e) => setBuscaProjeto(e.target.value)}
              className="input-busca"
            />
            {buscaProjeto && (
              <button className="btn-limpar" onClick={() => setBuscaProjeto("")}>
                ✕
              </button>
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
                    onClick={() => toggleExpandirProjeto(projeto.id)}
                  >
                    {isExpandido ? "Recolher Detalhes ▲" : "Ver Detalhes ▼"}
                  </button>

                  {isExpandido && (
                    <div className="projeto-detalhes-box">
                      <div className="detalhes-header">
                        <h4>Detalhes do Projeto</h4>
                      </div>
                      <p className="detalhes-texto">{projeto.detalhes}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="sem-resultados">
              Nenhum projeto encontrado para a busca "{buscaProjeto}".
            </p>
          )}
        </div>
      </section>

      {/* HABILIDADES */}
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

      {/* EXPERIÊNCIA */}
      <section id="experiencia">
        <h2>Experiência</h2>

        <div className="timeline">
          {experiencias.map((experiencia, index) => (
            <div className="experiencia-card" key={index}>
              <div className="exp-header">
                <h3>{experiencia.empresa}</h3>
                <span className="exp-periodo">{experiencia.periodo}</span>
              </div>
              <h4 className="exp-cargo">{experiencia.cargo}</h4>
              <p>{experiencia.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICAÇÕES */}
      <section id="certificacoes">
        <h2>Certificações & Cursos</h2>

        <div className="certificacoes-grid">
          {certificacoes.map((certificacao, index) => (
            <div key={index} className="certificacao-item">
              <span className="cert-icon"></span>
              <span>{certificacao}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOBBIES */}
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

      {/* CONTATO */}
      <section id="contato">
        <h2>Contato</h2>

        <p>Sinta-se à vontade para se conectar comigo:</p>

        <div className="redes-sociais">
          <a
            href="mailto:mattluiz.johnsson@gmail.com"
            aria-label="E-mail"
            className="social-btn"
          >
            <img src="/img/email.png" alt="E-mail" onError={(e) => (e.target.style.display = "none")} />
            <span>E-mail</span>
          </a>

          <a
            href="https://github.com/ironJohnsson"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-btn"
          >
            <img src="/img/github.png" alt="GitHub" onError={(e) => (e.target.style.display = "none")} />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/matheus-luiz-johnsson-9981642b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-btn"
          >
            <img src="/img/linkedin.png" alt="LinkedIn" onError={(e) => (e.target.style.display = "none")} />
            <span>LinkedIn</span>
          </a>

          <a
            href="http://lattes.cnpq.br/2290172202945405"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lattes"
            className="social-btn"
          >
            <img src="/img/lattes.png" alt="Lattes" onError={(e) => (e.target.style.display = "none")} />
            <span>Lattes</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>&copy; 2026 Matheus Luiz Neves Johnsson. Todos os direitos reservados.</p>
      </footer>

      {/* BOTÃO VOLTAR AO TOPO */}
      {mostrarVoltarTopo && (
        <button className="btn-topo" onClick={voltarAoTopo} title="Voltar ao topo">
          ↑
        </button>
      )}
    </main>
  );
}

export default App;