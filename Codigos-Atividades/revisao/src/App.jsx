import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Cabecalho from './components/Cabecalho.jsx'
import Rodape from './components/Rodape.jsx'
import './styles/main.css'

const THEME_STORAGE_KEY = 'portfolio-theme'

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    } catch (error) {
      console.warn('Não foi possível ler a preferência de tema.', error)
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? 'dark' : 'light')
    } catch (error) {
      console.warn('Não foi possível salvar a preferência de tema.', error)
    }
  }, [isDarkTheme])

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
