import { useEffect, useState } from "react";

function Typewriter({ frases }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    if (!frases || frases.length === 0) return;

    const fraseAtual = frases[index] || "";

    if (subIndex === fraseAtual.length + 1 && !deletando) {
      const timeout = setTimeout(() => setDeletando(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && deletando) {
      const timeout = setTimeout(() => {
        setDeletando(false);
        setIndex((prev) => (prev + 1) % frases.length);
      }, 300);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deletando ? -1 : 1));
    }, deletando ? 30 : 70);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deletando, frases]);

  const textoExibido = (frases && frases[index]) ? frases[index].substring(0, subIndex) : "";

  return (
    <div className="typewriter-container">
      <span className="typewriter-text">{textoExibido}</span>
      <span className="cursor">|</span>
    </div>
  );
}

function Hero({ frases }) {
  // A chave garante recriação limpa do typewriter ao trocar idioma
  const chaveIdioma = frases && frases.length > 0 ? frases[0] : "hero";

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

      <Typewriter key={chaveIdioma} frases={frases} />

      <div className="hero-tags">
        <span className="badge">SENAI CIMATEC</span>
        <span className="badge">UFBA</span>
        <span className="badge">HIIVE LAB</span>
        <span className="badge">QUIIN</span>
      </div>
    </section>
  );
}

export default Hero;
