import { useEffect, useState } from "react";

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

function Hero() {
  return (
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
  );
}

export default Hero;