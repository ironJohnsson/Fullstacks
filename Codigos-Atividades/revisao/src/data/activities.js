const plannedActivities = Array.from({ length: 29 }, (_, index) => ({
	id: index + 2,
	title:
		index === 0
			? 'Inicializar o repositório Git'
			: index === 1
				? 'Construir a estrutura semântica'
				: `Atividade ${String(index + 2).padStart(2, '0')}`,
	description:
		index === 0
			? 'O controle de versões foi criado desde o início, com histórico de commits e branch principal definida como main.'
			: index === 1
				? 'A homepage foi organizada com elementos HTML semânticos e uma área reservada para as 30 atividades.'
				: index === 2
					? 'O cabeçalho apresenta o autor, sua formação, o propósito do portfólio e um acesso direto às atividades.'
					: index === 3
						? 'O menu permite acessar Início, Sobre, Atividades e Contato por âncoras internas com rolagem suave.'
						: index === 4
							? 'A interface usa variáveis CSS para manter cores, tipografia, espaçamentos, raios e sombras consistentes.'
				: 'Entrega em construção para o roteiro prático.',
	technology:
		index === 0
			? 'Git · GitHub · Controle de versão'
			: index === 1
				? 'HTML semântico · JSX · Acessibilidade'
				: index === 2
					? 'Identidade visual · Acessibilidade · Navegação'
					: index === 3
						? 'Navegação interna · Âncoras · UX'
						: index === 4
							? 'CSS · Design system · Responsividade'
				: 'A definir',
	href: '#',
	...(index === 0 || index === 1 || index === 2 || index === 3 || index === 4
		? {
				href: `#atividade-${String(index + 2).padStart(2, '0')}`,
				evidence: {
					tools:
						index === 0
							? [
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
								]
							: index === 1
								? [
									{
										name: 'header',
										description:
											'Agrupa o título e a introdução da homepage.',
									},
									{
										name: 'nav',
										description:
											'Identifica a navegação para as seções de apresentação e atividades.',
									},
									{
										name: 'main e section',
										description:
											'Organizam o conteúdo principal e a área reservada para a lista das atividades.',
									},
									{
										name: 'footer',
										description:
											'Reúne as informações finais da página.',
									},
									{
										name: 'h1, h2 e h3',
										description:
											'Mantêm a hierarquia dos títulos com apenas um h1 principal.',
									},
								]
								: index === 2
								? [
									{
										name: 'Identidade',
										description:
											'O nome Matheus Luiz Neves Johnsson identifica o autor do portfólio.',
									},
									{
										name: 'Curso e turma',
										description:
											'Engenharia de Computação no SENAI CIMATEC situa a formação acadêmica do autor.',
									},
									{
										name: 'Descrição objetiva',
										description:
											'Apresenta o portfólio como uma coleção do percurso em desenvolvimento web.',
									},
									{
										name: 'Avatar acessível',
										description:
											'Imagem com texto alternativo identifica visualmente o autor sem depender apenas do desenho.',
									},
									{
										name: 'Botão de atividades',
										description:
											'Link de destaque leva diretamente à seção que contém a lista das atividades.',
									},
								]
								: index === 3
								? [
									{
										name: 'Links internos',
										description:
											'O menu oferece acesso direto às áreas Início, Sobre, Atividades e Contato.',
									},
									{
										name: 'Âncoras',
										description:
											'Cada link aponta para uma seção pelo seu identificador, sem abrir outra página.',
									},
									{
										name: 'Rolagem suave',
										description:
											'O CSS com scroll-behavior suaviza a transição até a seção escolhida.',
									},
									{
										name: 'Foco visível',
										description:
											'Os links exibem um indicador visual quando recebem foco pelo teclado.',
									},
								]
								: [
									{
										name: 'Paleta',
										description:
											'Verde escuro para ações e textos, branco para superfícies e laranja para o foco.',
									},
									{
										name: 'Tipografia',
										description:
											'Georgia aparece nos textos e títulos; Courier New identifica etiquetas e informações técnicas.',
									},
									{
										name: 'Espaçamentos',
										description:
											'Variáveis de 8, 12, 18, 24, 40 e 56px organizam os intervalos da interface.',
									},
									{
										name: 'Raios e sombras',
										description:
											'Raios de 4, 8 e 30px, com sombra suave para destacar elementos interativos.',
									},
									{
										name: 'Base',
										description:
											'box-sizing: border-box, margem corporal zerada e rolagem suave formam a normalização básica.',
									},
								],
					message:
						index === 0
							? 'O repositório registra cada alteração em commits, enquanto a branch main mantém a linha principal do projeto.'
							: index === 1
								? 'A estrutura semântica melhora a organização, a navegação e a compreensão do conteúdo por tecnologias assistivas.'
							: index === 2
								? 'A identidade combina informações pessoais, formação acadêmica, avatar alternativo e uma chamada clara para explorar o portfólio.'
								: index === 3
									? 'O teste manual confirmou que os quatro links levam às respectivas seções e permanecem navegáveis pelo teclado.'
									: 'A base visual foi centralizada em variáveis reutilizáveis para facilitar manutenção e consistência entre seções.',
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
