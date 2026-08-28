import { useState } from 'react';
import './App.css';

function App() {
  const [participantes, setParticipantes] = useState([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState(false);

  const handleAdicionar = (e) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setErro(true);
      return;
    }

    const novoParticipante = {
      id: Date.now(),
      nome: nome.trim()
    };

    setParticipantes([novoParticipante, ...participantes]);
    setNome('');
    setErro(false);
  };

  const handleRemover = (id) => {
    setParticipantes(participantes.filter((p) => p.id !== id));
  };

  return (
    <div className="card">
      <h1>Lista de Participantes</h1>
      <p className="subtitulo">Mostra de Tecnologia</p>

      {/* Contador de inscritos */}
      <div className="contador">
        Total de visitantes: <strong>{participantes.length}</strong>
      </div>

      {/* Formulário de cadastro */}
      <form onSubmit={handleAdicionar}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Digite o nome completo..."
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (erro) setErro(false);
            }}
            className={erro ? 'erro' : ''}
          />
          <button type="submit">Cadastrar</button>
        </div>
        {erro && <span className="mensagem-erro">Por favor, preencha o nome do visitante.</span>}
      </form>

      {/* Lista de cadastrados */}
      <ul className="lista">
        {participantes.length === 0 ? (
          <li className="vazio">Nenhum participante registrado ainda.</li>
        ) : (
          participantes.map((p) => (
            <li key={p.id}>
              <span>{p.nome}</span>
              <button onClick={() => handleRemover(p.id)} className="btn-excluir">
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;