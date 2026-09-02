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
import {
  projetos,
  categorias,
  habilidades,
  experiencias,
  certificacoes,
  hobbies
} from "./data/conteudo";

function App() {
  const [secaoAtiva, setSecaoAtiva] = useState("inicio");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [buscaProjeto, setBuscaProjeto] = useState("");
  const [buscaHabilidade, setBuscaHabilidade] = useState("");
  const [projetoExpandidoId, setProjetoExpandidoId] = useState(null);
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

  const habilidadesFiltradas = habilidades.filter((h) =>
    h.nome.toLowerCase().includes(buscaHabilidade.toLowerCase())
  );

  const navegarPara = (id) => {
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
      <Header secaoAtiva={secaoAtiva} onNavigate={navegarPara} />
      <Hero />
      <Marquee />
      <Sobre />
      <Projetos
        categorias={categorias}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        buscaProjeto={buscaProjeto}
        setBuscaProjeto={setBuscaProjeto}
        projetosFiltrados={projetosFiltrados}
        projetoExpandidoId={projetoExpandidoId}
        toggleExpandirProjeto={setProjetoExpandidoId}
      />
      <Habilidades
        buscaHabilidade={buscaHabilidade}
        setBuscaHabilidade={setBuscaHabilidade}
        habilidadesFiltradas={habilidadesFiltradas}
      />
      <Experiencia experiencias={experiencias} />
      <Certificacoes certificacoes={certificacoes} />
      <Hobbies hobbies={hobbies} />
      <Contato />
      <Footer />

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