function Cabecalho() {
	return (
		<header className="site-header">
			<div className="identity">
				<img
					className="avatar"
					src="/image.png"
					alt="Avatar ilustrado de Matheus Luiz Neves Johnsson"
				/>
				<div>
					<p className="eyebrow">SENAI CIMATEC · Engenharia de Computação</p>
					<h1>Matheus Luiz Neves Johnsson</h1>
					<p className="intro">
						Portfólio das atividades práticas do meu percurso em desenvolvimento
						web, construído etapa por etapa com React, HTML, CSS e Git.
					</p>
				</div>
			</div>
			<nav aria-label="Navegação principal">
				<a href="#inicio">Início</a>
				<a href="#sobre">Sobre</a>
				<a href="#atividades">Atividades</a>
				<a href="#contato">Contato</a>
			</nav>
		</header>
	)
}

export default Cabecalho
