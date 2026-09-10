const statusClasses = {
	Planejada: 'status-planejada',
	'Em andamento': 'status-andamento',
	Concluída: 'status-concluida',
}

function StatusAtividade({ status }) {
	const className = statusClasses[status] ?? statusClasses.Planejada

	return <span className={`activity-status ${className}`}>{status}</span>
}

export default StatusAtividade
