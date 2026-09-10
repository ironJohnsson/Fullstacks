import { useState } from 'react'

function CardAtividade({ number, title, description, technology, link, evidence }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<article id={link.replace('#', '')} className="activity-card">
			<div className="activity-number" aria-hidden="true">
				{String(number).padStart(2, '0')}
			</div>
			<div className="activity-content">
				<p className="activity-technology">{technology}</p>
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
			<div className="activity-actions">
				<button
					className="activity-link"
					type="button"
					aria-expanded={isOpen}
					aria-controls={`evidencia-${number}`}
					onClick={() => setIsOpen((open) => !open)}
				>
					{isOpen ? 'Ocultar atividade' : 'Ver atividade'} <span aria-hidden="true">{isOpen ? '↑' : '→'}</span>
				</button>
				<a className="activity-anchor" href={link}>Link direto</a>
			</div>
			{isOpen && evidence && (
				<div className="activity-evidence" id={`evidencia-${number}`}>
					<h4>Evidência da atividade</h4>
					<ul>
						{evidence.tools.map((tool) => (
							<li key={tool.name}>
								<strong>{tool.name}:</strong> {tool.description ?? tool.version}
							</li>
						))}
					</ul>
					{evidence.demo && (
						<div className="flex-demo" aria-label="Demonstração comparativa de alinhamento">
							<div>
								<strong>{evidence.demo.before}</strong>
								<div className="demo-row demo-row-before">
									<span>01</span>
									<span>02</span>
									<span>03</span>
								</div>
							</div>
							<div>
								<strong>{evidence.demo.after}</strong>
								<div className="demo-row demo-row-after">
									<span>01</span>
									<span>02</span>
									<span>03</span>
								</div>
							</div>
						</div>
					)}
					<p className="ready-message">{evidence.message}</p>
				</div>
			)}
		</article>
	)
}

export default CardAtividade
