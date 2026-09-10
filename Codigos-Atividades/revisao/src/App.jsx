import Home from './pages/Home.jsx'
import Cabecalho from './components/Cabecalho.jsx'
import Rodape from './components/Rodape.jsx'
import './styles/main.css'

function App() {
  return (
    <div className="home-page">
      <Cabecalho />
      <Home />
      <Rodape />
    </div>
  )
}

export default App
