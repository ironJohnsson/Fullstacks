const plannedActivities = Array.from({ length: 29 }, (_, index) => ({
	id: index + 2,
	title:
		index === 0
			? 'Inicializar o repositório Git'
			: index === 1
				? 'Construir a estrutura semântica'
				: index === 11
					? 'Criar o componente CardAtividade'
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
							: index === 5
								? 'Cartões reutilizáveis apresentam número, título, descrição, tecnologia e ação com estados visuais acessíveis.'
				: index === 6
					? 'Flexbox organiza o cabeçalho, o menu e os contatos, distribuindo os itens com alinhamento e espaçamento consistentes.'
					: index === 7
						? 'A seção de atividades usa CSS Grid para distribuir os cartões em colunas adaptáveis sem criar rolagem horizontal.'
						: index === 8
							? 'A homepage foi ajustada para telas de 360px, 768px e 1440px com media queries e grade adaptável.'
							: index === 9
								? 'O cabeçalho foi extraído para um componente React reutilizável, mantendo a marcação e os estilos em um único lugar.'
								: index === 10
									? 'O rodapé foi separado em um componente com autor, ano calculado e link para retornar ao início.'
									: index === 11
										? 'Os cartões foram transformados em componentes reutilizáveis que recebem dados por props.'
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
							: index === 5
				? 'React · CSS · Acessibilidade'
				: index === 6
					? 'CSS · Flexbox · Layout responsivo'
					: index === 7
						? 'CSS Grid · Responsividade · Layout adaptável'
						: index === 8
							? 'CSS · Media queries · Design responsivo'
							: index === 9
								? 'React · Componentização · JSX'
								: index === 10
									? 'React · Responsabilidade única · JavaScript'
									: index === 11
										? 'React · Props · Componentes reutilizáveis'
				: 'A definir',
	href: '#',
	...(index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8
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
								: index === 4
								? [
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
								]
								: index === 5
								? [
									{
										name: 'Estado padrão',
										description:
											'O cartão exibe número, título, descrição, tecnologia e a ação Ver atividade sobre fundo claro.',
									},
									{
										name: 'Hover',
										description:
											'A borda e a sombra mudam suavemente ao passar o cursor, reforçando qual cartão está sendo explorado.',
									},
									{
										name: 'Focus',
										description:
											'O foco visível no botão permite identificar a posição da navegação pelo teclado.',
									},
									{
										name: 'Ação expandida',
										description:
											'Ver atividade abre a área de evidência sem esconder o título ou a descrição do cartão.',
									},
									{
										name: 'Contraste',
										description:
											'Texto escuro, verde de ação e fundo claro preservam a leitura e a distinção entre os elementos.',
									},
								]
								: index === 6
								? [
									{
										name: 'Cabeçalho',
										description:
											'display: flex e align-items: center alinham o avatar e o bloco de identidade.',
									},
									{
										name: 'Menu',
										description:
											'flex-wrap e gap distribuem os links e permitem que eles se reorganizem em telas menores.',
									},
									{
										name: 'Contatos',
										description:
											'flex-wrap e gap mantêm os botões sociais organizados sem sobreposição.',
									},
									{
										name: 'Problema resolvido',
										description:
											'A distribuição manual e o espaçamento irregular foram substituídos por alinhamento responsivo.',
									},
								]
								: index === 7
								? [
									{
										name: 'Grade responsiva',
										description:
											'activities-list usa repeat(auto-fit, minmax(280px, 1fr)) para criar colunas conforme o espaço disponível.',
									},
									{
										name: 'Adaptação',
										description:
											'auto-fit ajusta a quantidade de colunas sem precisar definir uma largura fixa para cada cartão.',
									},
									{
										name: 'Sem rolagem horizontal',
										description:
											'minmax limita o tamanho mínimo e permite que os cartões encolham dentro do contêiner.',
									},
								]
								: [
									{
										name: '360px',
										description:
											'O menu quebra linhas, o avatar reduz e os cartões ocupam uma coluna sem overflow.',
									},
									{
										name: '768px',
										description:
											'A grade passa a acomodar mais colunas e os espaçamentos ficam equilibrados para tablets.',
									},
									{
										name: '1440px',
										description:
											'O conteúdo permanece centralizado com largura máxima, evitando linhas excessivamente longas.',
									},
									{
										name: 'Problemas corrigidos',
										description:
											'Foram ajustados menu, tipografia, margens, imagem e grade para evitar cortes e rolagem horizontal.',
									},
								],
					demo:
						index === 6
							? {
									before: 'Itens sem distribuição',
									after: 'Itens com Flexbox',
								}
							: undefined,
					message:
						index === 0
							? 'O repositório registra cada alteração em commits, enquanto a branch main mantém a linha principal do projeto.'
							: index === 1
								? 'A estrutura semântica melhora a organização, a navegação e a compreensão do conteúdo por tecnologias assistivas.'
							: index === 2
								? 'A identidade combina informações pessoais, formação acadêmica, avatar alternativo e uma chamada clara para explorar o portfólio.'
								: index === 3
									? 'O teste manual confirmou que os quatro links levam às respectivas seções e permanecem navegáveis pelo teclado.'
									: index === 4
										? 'A base visual foi centralizada em variáveis reutilizáveis para facilitar manutenção e consistência entre seções.'
										: index === 5
											? 'O cartão foi testado no estado normal, com hover, foco pelo teclado e evidência expandida.'
											: index === 6
												? 'A demonstração compara itens agrupados sem distribuição com o alinhamento responsivo feito por Flexbox.'
												: index === 7
													? 'Os cartões foram distribuídos em uma grade que se adapta ao espaço disponível sem provocar rolagem horizontal.'
													: 'Os testes em 360px, 768px e 1440px confirmaram uma interface legível, sem cortes e sem rolagem horizontal.',
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
	...plannedActivities.map((activity) =>
		activity.id === 11
			? {
					...activity,
					evidence: {
						tools: [
							{
								name: 'Arquivo',
								description:
									'Cabecalho.jsx concentra a marcação do cabeçalho, avatar, identidade e menu.',
							},
							{
								name: 'Responsabilidade',
								description:
									'O componente apresenta a identidade do autor e oferece a navegação principal.',
							},
							{
								name: 'Local de uso',
								description:
									'App.jsx importa Cabecalho e o renderiza antes do conteúdo de Home.jsx.',
							},
						],
						message:
							'A extração evita duplicação e deixa o cabeçalho pronto para reutilização em outras páginas.',
					},
				}
		: activity.id === 12
			? {
					...activity,
					evidence: {
						tools: [
							{
								name: 'Arquivo',
								description:
									'Rodape.jsx concentra o conteúdo e o comportamento do rodapé.',
							},
							{
								name: 'Ano',
								description:
									'new Date().getFullYear() calcula o ano atual em um único local.',
							},
							{
								name: 'Retorno',
								description:
									'O link #inicio leva novamente ao topo da homepage por uma âncora interna.',
							},
						],
						message:
							'O rodapé tem responsabilidade única e pode ser reutilizado sem espalhar a lógica do ano pela aplicação.',
					},
				}
			: activity.id === 13
				? {
						...activity,
						evidence: {
							tools: [
								{
									name: 'number',
									description:
										'Recebe o número da atividade e o apresenta com dois dígitos.',
								},
								{
									name: 'title e description',
									description:
										'Recebem o título e o texto descritivo exibidos no conteúdo do cartão.',
								},
								{
									name: 'technology',
									description:
										'Identifica as tecnologias ou conceitos usados na atividade.',
								},
								{
									name: 'link',
									description:
										'Define a âncora para acessar diretamente o cartão correspondente.',
								},
							],
							message:
								'O mesmo CardAtividade é renderizado para todas as atividades usando dados diferentes por props.',
						},
					}
				: activity,
	),
]
