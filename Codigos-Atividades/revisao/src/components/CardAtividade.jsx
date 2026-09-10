import { useEffect, useRef, useState } from 'react'
import StatusAtividade from './StatusAtividade.jsx'

function CardAtividade({ number, title, description, technology, status, link, evidence }) {
	const [isOpen, setIsOpen] = useState(false)
	const closeButtonRef = useRef(null)
	const triggerRef = useRef(null)

	const closeDetails = () => {
		setIsOpen(false)
		triggerRef.current?.focus()
	}

	useEffect(() => {
		if (!isOpen) return undefined

		const handleEscape = (event) => {
			if (event.key === 'Escape') closeDetails()
		}

		document.addEventListener('keydown', handleEscape)
		closeButtonRef.current?.focus()
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen])

	return (
		<article id={link.replace('#', '')} className="activity-card">
			<div className="activity-number" aria-hidden="true">
				{String(number).padStart(2, '0')}
			</div>
			<div className="activity-content">
				<p className="activity-technology">{technology}</p>
				<h3>{title}</h3>
				<p>{description}</p>
				{status && <StatusAtividade status={status} />}
			</div>
			<div className="activity-actions">
				<button
					className="activity-link"
					type="button"
					aria-expanded={isOpen}
					aria-haspopup="dialog"
					ref={triggerRef}
					onClick={() => setIsOpen(true)}
				>
					Ver atividade <span aria-hidden="true">→</span>
				</button>
				<a className="activity-anchor" href={link}>Link direto</a>
			</div>
			{isOpen && evidence && (
				<div className="activity-modal-backdrop" role="presentation" onMouseDown={closeDetails}>
					<div
						className="activity-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby={`evidencia-titulo-${number}`}
						onMouseDown={(event) => event.stopPropagation()}
					>
						<div className="activity-evidence">
							<div className="activity-modal-heading">
								<div>
									<p className="activity-technology">{technology}</p>
									<h4 id={`evidencia-titulo-${number}`} tabIndex="-1">{title}</h4>
									<p>{description}</p>
								</div>
								<button className="modal-close" type="button" ref={closeButtonRef} onClick={closeDetails}>
									Fechar
								</button>
							</div>
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
					{evidence.example && (
						<pre className="data-example">
							{JSON.stringify(evidence.example, null, 2)}
						</pre>
					)}
					{evidence.statuses && (
						<div className="status-demo" aria-label="Demonstração dos status das atividades">
							{evidence.statuses.map((statusName) => (
								<StatusAtividade key={statusName} status={statusName} />
							))}
						</div>
					)}
					<p className="ready-message">{evidence.message}</p>
						</div>
					</div>
				</div>
			)}
		</article>
	)
}

export default CardAtividade
