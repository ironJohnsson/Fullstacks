const contatos = [
	{
		nome: 'E-mail',
		href: 'mailto:mattluiz.johnsson@gmail.com',
		icone: '/img/email.png',
	},
	{
		nome: 'GitHub',
		href: 'https://github.com/ironJohnsson',
		icone: '/img/github.png',
		externo: true,
	},
	{
		nome: 'LinkedIn',
		href: 'https://www.linkedin.com/in/matheus-luiz-johnsson-9981642b/',
		icone: '/img/linkedin.png',
		externo: true,
	},
	{
		nome: 'Lattes',
		href: 'http://lattes.cnpq.br/2290172202945405',
		icone: '/img/lattes.png',
		externo: true,
	},
]

function Contato() {
	return (
		<section className="contact-section" id="contato" aria-labelledby="contact-title">
			<p className="eyebrow">Contato</p>
			<h2 id="contact-title">Conecte-se comigo</h2>
			<p>Sinta-se à vontade para entrar em contato ou conhecer meu trabalho.</p>
			<div className="social-links">
				{contatos.map((contato) => (
					<a
						className="social-link"
						href={contato.href}
						key={contato.nome}
						target={contato.externo ? '_blank' : undefined}
						rel={contato.externo ? 'noopener noreferrer' : undefined}
						aria-label={contato.nome}
					>
						<img src={contato.icone} alt="" />
						<span>{contato.nome}</span>
					</a>
				))}
			</div>
		</section>
	)
}

export default Contato
