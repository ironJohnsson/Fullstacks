import { useState } from 'react'

function CardAtividade({ activity }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<article id={`atividade-${String(activity.id).padStart(2, '0')}`} className="activity-card">
			<div className="activity-number" aria-hidden="true">
				{String(activity.id).padStart(2, '0')}
			</div>
			<div className="activity-content">
				<p className="activity-technology">{activity.technology}</p>
				<h3>{activity.title}</h3>
				<p>{activity.description}</p>
			</div>
			<button
				className="activity-link"
				type="button"
				aria-expanded={isOpen}
				aria-controls={`evidencia-${activity.id}`}
				onClick={() => setIsOpen((open) => !open)}
			>
				{isOpen ? 'Ocultar atividade' : 'Ver atividade'} <span aria-hidden="true">{isOpen ? '↑' : '→'}</span>
			</button>
			{isOpen && activity.evidence && (
				<div className="activity-evidence" id={`evidencia-${activity.id}`}>
					<h4>Evidência da atividade</h4>
					<ul>
						{activity.evidence.tools.map((tool) => (
							<li key={tool.name}>
								<strong>{tool.name}:</strong> {tool.version}
							</li>
						))}
					</ul>
					<p className="ready-message">{activity.evidence.message}</p>
				</div>
			)}
		</article>
	)
}

export default CardAtividade
