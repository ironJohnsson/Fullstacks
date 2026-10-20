import { useState } from "react";

function Header({
  secaoAtiva,
  onNavigate,
  itensNavegacao,
  idioma,
  onToggleIdioma,
  btnIdiomaTitle
}) {
  const [menuAberto, setMenuAberto] = useState(false);

  const navegar = (id) => {
    setMenuAberto(false);
    onNavigate(id);
  };

  return (
    <nav className="navbar">
      <div className="navbar-topo-mobile">
        <button
          className="menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar Menu" : "Abrir Menu"}
        >
          {menuAberto ? "✕" : "☰"}
        </button>

        <button
          type="button"
          className="btn-idioma btn-idioma-mobile"
          onClick={onToggleIdioma}
          title={btnIdiomaTitle}
          aria-label={btnIdiomaTitle}
        >
          <span className={`idioma-sigla ${idioma === "pt" ? "ativo" : ""}`}>PT</span>
          <span className="idioma-barra">|</span>
          <span className={`idioma-sigla ${idioma === "en" ? "ativo" : ""}`}>EN</span>
        </button>
      </div>

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

        <button
          type="button"
          className="btn-idioma btn-idioma-desktop"
          onClick={onToggleIdioma}
          title={btnIdiomaTitle}
          aria-label={btnIdiomaTitle}
        >
          <span className={`idioma-sigla ${idioma === "pt" ? "ativo" : ""}`}>PT</span>
          <span className="idioma-barra">|</span>
          <span className={`idioma-sigla ${idioma === "en" ? "ativo" : ""}`}>EN</span>
        </button>
      </div>
    </nav>
  );
}

export default Header;
