import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Sobre from "./components/Sobre";
import Projetos from "./components/Projetos";
import Habilidades from "./components/Habilidades";
import Experiencia from "./components/Experiencia";
import Certificacoes from "./components/Certificacoes";
import Hobbies from "./components/Hobbies";
import Contato from "./components/Contato";
import Footer from "./components/Footer";
import { conteudo } from "./data/conteudo";

function App() {
  const [idioma, setIdioma] = useState(() => {
    try {
      return localStorage.getItem("portfolio_idioma") || "pt";
    } catch {
      return "pt";
    }
  });
  const [secaoAtiva, setSecaoAtiva] = useState("inicio");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [buscaProjeto, setBuscaProjeto] = useState("");
  const [buscaHabilidade, setBuscaHabilidade] = useState("");
  const [projetoExpandidoId, setProjetoExpandidoId] = useState(null);
  const [mostrarVoltarTopo, setMostrarVoltarTopo] = useState(false);

  const t = conteudo[idioma] || conteudo.pt;

  const alternarIdioma = () => {
    const novoIdioma = idioma === "pt" ? "en" : "pt";
    setIdioma(novoIdioma);
    try {
      localStorage.setItem("portfolio_idioma", novoIdioma);
    } catch {
      // Ignora restrições locais de storage
    }
  };

  useEffect(() => {
    document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";
  }, [idioma]);

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

  const projetosFiltrados = t.projetos.lista.filter((projeto) => {
    const atendeCategoria =
      categoriaFiltro === "todos" || projeto.categoriaId === categoriaFiltro;
    const termo = buscaProjeto.toLowerCase().trim();
    const atendeBusca =
      !termo ||
      projeto.titulo.toLowerCase().includes(termo) ||
      projeto.descricao.toLowerCase().includes(termo) ||
      projeto.tags.some((tag) => tag.toLowerCase().includes(termo));
    return atendeCategoria && atendeBusca;
  });

  const habilidadesFiltradas = t.habilidades.lista.filter((h) => {
    const termo = buscaHabilidade.toLowerCase().trim();
    return (
      !termo ||
      h.nome.toLowerCase().includes(termo) ||
      h.tipo.toLowerCase().includes(termo)
    );
  });

  const navegarPara = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container">
      <Header
        secaoAtiva={secaoAtiva}
        onNavigate={navegarPara}
        itensNavegacao={t.nav}
        idioma={idioma}
        onToggleIdioma={alternarIdioma}
        btnIdiomaTitle={t.btnIdiomaTitle}
      />
      <Hero frases={t.hero.frases} />
      <Marquee itens={t.marquee} />
      <Sobre dados={t.sobre} />
      <Projetos
        dados={t.projetos}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        buscaProjeto={buscaProjeto}
        setBuscaProjeto={setBuscaProjeto}
        projetosFiltrados={projetosFiltrados}
        projetoExpandidoId={projetoExpandidoId}
        toggleExpandirProjeto={setProjetoExpandidoId}
      />
      <Habilidades
        dados={t.habilidades}
        buscaHabilidade={buscaHabilidade}
        setBuscaHabilidade={setBuscaHabilidade}
        habilidadesFiltradas={habilidadesFiltradas}
      />
      <Experiencia dados={t.experiencia} />
      <Certificacoes dados={t.certificacoes} />
      <Hobbies dados={t.hobbies} />
      <Contato dados={t.contato} />
      <Footer dados={t.footer} />

      {/* BOTÃO VOLTAR AO TOPO */}
      {mostrarVoltarTopo && (
        <button className="btn-topo" onClick={voltarAoTopo} title={t.voltarTopo}>
          ↑
        </button>
      )}
    </main>
  );
}

export default App;
