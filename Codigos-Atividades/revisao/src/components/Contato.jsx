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
	const [formData, setFormData] = useState({ nome: '', email: '', assunto: '', mensagem: '' })
	const [submitted, setSubmitted] = useState(false)

	const handleChange = (event) => {
		setSubmitted(false)
		setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		setSubmitted(true)
		setFormData({ nome: '', email: '', assunto: '', mensagem: '' })
	}

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
			<form className="contact-form" onSubmit={handleSubmit}>
				<div className="form-field">
					<label htmlFor="nome">Nome</label>
					<input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
				</div>
				<div className="form-field">
					<label htmlFor="email">E-mail</label>
					<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
				</div>
				<div className="form-field">
					<label htmlFor="assunto">Assunto</label>
					<input id="assunto" name="assunto" value={formData.assunto} onChange={handleChange} required />
				</div>
				<div className="form-field">
					<label htmlFor="mensagem">Mensagem</label>
					<textarea id="mensagem" name="mensagem" rows="5" value={formData.mensagem} onChange={handleChange} required />
				</div>
				<button className="form-submit" type="submit">Enviar mensagem</button>
				{submitted && <p className="form-success" role="status">Mensagem enviada com sucesso (simulação).</p>}
			</form>
		</section>
	)
}

export default Contato
import { useState } from 'react'
