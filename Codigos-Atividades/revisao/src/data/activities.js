const plannedActivities = Array.from({ length: 28 }, (_, index) => ({
	id: index + 2,
	title: index === 0 ? 'Inicializar o repositório Git' : `Atividade ${String(index + 2).padStart(2, '0')}`,
	description:
		index === 0
			? 'O controle de versões foi criado desde o início, com histórico de commits e branch principal definida como main.'
			: 'Entrega em construção para o roteiro prático.',
	technology: index === 0 ? 'Git · GitHub · Controle de versão' : 'A definir',
	href: '#',
	...(index === 0
		? {
				href: '#atividade-02',
				evidence: {
					tools: [
						{
							name: 'Repositório',
							description:
								'É a pasta controlada pelo Git, onde ficam os arquivos e todo o histórico do projeto.',
						},
						{
							name: 'Commit',
							description:
								'Registra um conjunto de alterações no histórico, permitindo acompanhar e recuperar versões do projeto.',
						},
						{
							name: 'Branch principal',
							description:
								'É a linha principal de desenvolvimento. Neste projeto, ela foi definida como main.',
						},
					],
					message:
						'O repositório registra cada alteração em commits, enquanto a branch main mantém a linha principal do projeto.',
				},
			}
		: {}),
}))

export const activities = [
	{
		id: 1,
		title: 'Preparar o ambiente e criar o projeto',
		description:
			'Node.js, npm, Git e VS Code verificados. O projeto React com Vite está pronto para desenvolvimento local.',
		technology: 'Node.js · npm · Git · VS Code · Vite',
		href: '#atividade-01',
		evidence: {
			tools: [
					{ name: 'Node.js', version: 'v24.19.0' },
					{ name: 'npm', version: '11.17.0' },
					{ name: 'Git', version: '2.55.0.windows.5' },
				{ name: 'Editor', version: 'Visual Studio Code' },
			],
			message: 'O ambiente React com Vite está pronto para desenvolvimento local.',
		},
	},
	...plannedActivities,
]
