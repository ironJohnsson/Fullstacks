function Rodape() {
	const anoAtual = new Date().getFullYear()

	return (
		<footer className="site-footer">
			<p>Matheus Luiz Neves Johnsson · {anoAtual}</p>
			<a href="#inicio">Voltar ao início</a>
		</footer>
	)
}

export default Rodape
