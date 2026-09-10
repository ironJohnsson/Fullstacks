import { useState } from 'react'
import Home from './pages/Home.jsx'
import Cabecalho from './components/Cabecalho.jsx'
import Rodape from './components/Rodape.jsx'
import './styles/main.css'

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  return (
    <div className={isDarkTheme ? 'home-page theme-dark' : 'home-page'}>
      <Cabecalho />
      <button
        className="theme-toggle"
        type="button"
        aria-pressed={isDarkTheme}
        onClick={() => setIsDarkTheme((current) => !current)}
      >
        {isDarkTheme ? 'Usar tema claro' : 'Usar tema escuro'}
      </button>
      <Home />
      <Rodape />
    </div>
  )
}

export default App
