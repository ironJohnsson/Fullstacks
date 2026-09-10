const technologies = ['HTML e acessibilidade', 'CSS e responsividade', 'React e JSX', 'Git e GitHub', 'Vite e npm']

function Sobre() {
	return (
		<section className="about-section" id="sobre" aria-labelledby="about-title">
			<p className="eyebrow">Sobre</p>
			<h2 id="about-title">Aprendendo, construindo e compartilhando</h2>
			<p>
				Sou Matheus Luiz Neves Johnsson, estudante de Engenharia de Computação no SENAI CIMATEC.
				Este portfólio registra meu percurso prático em desenvolvimento web e transforma cada
				atividade em uma oportunidade de aprender com clareza e consistência.
			</p>
			<p>
				Estou praticando as tecnologias abaixo e evoluindo gradualmente, sem tratar o estudo como
				um domínio absoluto:
			</p>
			<ul className="technology-list">
				{technologies.map((technology) => <li key={technology}>{technology}</li>)}
			</ul>
			<div className="professional-links">
				<a href="https://github.com/ironJohnsson" target="_blank" rel="noopener noreferrer">GitHub</a>
				<a href="https://www.linkedin.com/in/matheus-luiz-johnsson-9981642b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a href="http://lattes.cnpq.br/2290172202945405" target="_blank" rel="noopener noreferrer">Currículo Lattes</a>
			</div>
		</section>
	)
}

export default Sobre
