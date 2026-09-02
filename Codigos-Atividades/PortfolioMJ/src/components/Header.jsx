import { useState } from "react";

const itensNavegacao = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "experiencia", label: "Experiência" },
  { id: "certificacoes", label: "Certificações" },
  { id: "hobbies", label: "Hobbies" },
  { id: "contato", label: "Contato" }
];

function Header({ secaoAtiva, onNavigate }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const navegar = (id) => {
    setMenuAberto(false);
    onNavigate(id);
  };

  return (
    <nav className="navbar">
      <button
        className="menu-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Alternar Menu"
      >
        {menuAberto ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${menuAberto ? "aberto" : ""}`}>
        {itensNavegacao.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={secaoAtiva === item.id ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navegar(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Header;