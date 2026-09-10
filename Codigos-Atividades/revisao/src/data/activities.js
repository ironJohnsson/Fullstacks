const plannedActivities = Array.from({ length: 29 }, (_, index) => ({
	id: index + 2,
	numero: String(index + 2).padStart(2, '0'),
	titulo:
		index === 0
			? 'Inicializar o repositório Git'
			: index === 1
				? 'Construir a estrutura semântica'
				: index === 11
					? 'Criar o componente CardAtividade'
					: index === 14
						? 'Mostrar status condicional'
						: index === 15
							? 'Criar filtro por tecnologia'
							: index === 16
								? 'Criar busca por texto'
								: index === 17
									? 'Criar contador de progresso'
									: index === 18
										? 'Criar barra de progresso'
										: index === 19
											? 'Criar modal de detalhes'
											: index === 20
												? 'Criar formulário de contato'
												: index === 21
													? 'Implementar alternância de tema'
													: index === 22
														? 'Persistir preferência local'
														: index === 23
															? 'Adicionar seção Sobre'
				: `Atividade ${String(index + 2).padStart(2, '0')}`,
	descricao:
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
											: index === 12
												? 'A lista de 30 atividades é gerada dinamicamente com map e cada item recebe uma key estável baseada no id.'
															: index === 14
																? 'Cada atividade apresenta um status visual, com classes específicas para Planejada, Em andamento ou Concluída.'
																					: index === 15
																						? 'Um filtro por tecnologia usa useState para exibir apenas os cartões compatíveis, sem modificar o array original.'
																						: index === 16
																							? 'A busca controlada combina o texto digitado com o filtro de tecnologia e informa quando nenhum cartão corresponde.'
																							: index === 17
																								? 'O progresso é calculado a partir dos status das atividades e exibido automaticamente como concluídas de 30.'
																								: index === 18
																									? 'Uma barra acessível representa o percentual calculado a partir das atividades concluídas.'
																									: index === 19
																										? 'Os detalhes da atividade são exibidos em um modal que pode ser fechado por botão, Escape ou área externa.'
																										: index === 20
																											? 'O formulário reúne nome, e-mail, assunto e mensagem com validação nativa e confirmação simulada.'
																											: index === 21
																												? 'Um botão alterna entre tema claro e escuro usando estado React e uma classe na raiz da aplicação.'
																												: index === 22
																													? 'A preferência de tema é salva no localStorage e restaurada ao iniciar a aplicação, com tema claro como padrão.'
																													: index === 23
																														? 'A seção Sobre apresenta autoria, tecnologias em prática e links profissionais apropriados para publicação.'
				: 'Entrega em construção para o roteiro prático.',
	tecnologia:
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
										: index === 12
											? 'JavaScript · map · Renderização de listas'
											: index === 14
												? 'React · Renderização condicional · CSS'
											: index === 15
												? 'React · useState · Filtros'
											: index === 16
												? 'React · Eventos · Busca · filter'
											: index === 17
												? 'React · Array.filter · Estado derivado'
											: index === 18
												? 'React · Progressbar · Acessibilidade'
											: index === 19
												? 'React · Modal · Eventos de teclado'
											: index === 20
												? 'React · Formulários · Validação'
											: index === 21
												? 'React · useState · CSS · Acessibilidade'
											: index === 22
												? 'React · localStorage · useEffect'
											: index === 23
												? 'React · Componente · Conteúdo autoral'
				: 'A definir',
	status: index < 24 ? 'Concluída' : index === 24 ? 'Em andamento' : 'Planejada',
	link: `#atividade-${String(index + 2).padStart(2, '0')}`,
	...(index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8
		? {
				link: `#atividade-${String(index + 2).padStart(2, '0')}`,
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
		numero: '01',
		title: 'Preparar o ambiente e criar o projeto',
		titulo: 'Preparar o ambiente e criar o projeto',
		description:
			'Node.js, npm, Git e VS Code verificados. O projeto React com Vite está pronto para desenvolvimento local.',
		descricao:
			'Node.js, npm, Git e VS Code verificados. O projeto React com Vite está pronto para desenvolvimento local.',
		technology: 'Node.js · npm · Git · VS Code · Vite',
		tecnologia: 'Node.js · npm · Git · VS Code · Vite',
		status: 'Concluída',
		link: '#atividade-01',
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
	...plannedActivities.map((activity) => ({
		...activity,
		titulo:
			activity.titulo ??
			(activity.id === 2
				? 'Inicializar o repositório Git'
				: activity.id === 3
					? 'Construir a estrutura semântica'
					: activity.id === 15
						? 'Renderizar a lista com map'
					: activity.id === 14
						? 'Modelar os dados das atividades'
					: `Atividade ${String(activity.id).padStart(2, '0')}`),
		descricao:
			activity.descricao ??
			(activity.id === 14
				? 'Separação dos dados e da apresentação para facilitar a manutenção das atividades.'
				: activity.id === 15
					? 'A lista de atividades é gerada dinamicamente com map, usando uma key estável para cada cartão.'
				: activity.description),
		tecnologia:
			activity.tecnologia ??
			(activity.id === 14
				? 'JavaScript · Objetos · Dados'
				: activity.id === 15
					? 'JavaScript · map · Renderização de listas'
					: activity.technology),
		link: activity.link ?? `#atividade-${String(activity.id).padStart(2, '0')}`,
	}))
		.map((activity) =>
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
				: activity.id === 14
					? {
							...activity,
							evidence: {
								tools: [
									{
										name: 'Arquivo',
										description:
											'activities.js concentra o array de objetos separado da apresentação.',
									},
									{
										name: 'Objeto de exemplo',
										description:
											'Cada atividade possui id, numero, titulo, descricao, tecnologia, status e link.',
									},
								],
								example: {
									id: 14,
									numero: '14',
									titulo: 'Modelar os dados das atividades',
									descricao: 'Conteúdo separado da interface.',
									tecnologia: 'JavaScript · Objetos',
									status: 'Concluída',
									link: '#atividade-14',
								},
								message:
									'O componente recebe os dados prontos e permanece responsável apenas pela apresentação.',
							},
						}
					: activity.id === 15
						? {
								...activity,
								evidence: {
									tools: [
										{
											name: 'Array',
											description:
												'activities é a coleção ordenada com os dados das 30 atividades.',
										},
										{
											name: 'map',
											description:
												'O método percorre cada objeto e transforma cada item em um CardAtividade.',
										},
										{
											name: 'key',
											description:
												'activity.id fornece uma chave estável e exclusiva para cada item renderizado.',
										},
										{
											name: 'Numeração',
											description:
												'A lista contém os IDs de 1 a 30, confirmados pela quantidade total de 30 etapas.',
										},
									],
									message:
										'A renderização mantém o conteúdo separado dos componentes e evita chaves duplicadas.',
								},
							}
						: activity.id === 16
							? {
									...activity,
									evidence: {
										tools: [
											{
												name: 'Status',
												description:
													'Cada cartão recebe Planejada, Em andamento ou Concluída a partir dos dados.',
											},
											{
												name: 'Classes visuais',
												description:
													'StatusAtividade associa cada texto a uma classe CSS específica sem condições longas no JSX.',
											},
											{
												name: 'Demonstração',
												description:
													'Os três estados aparecem juntos abaixo para facilitar a comparação visual.',
											},
										],
										statuses: ['Planejada', 'Em andamento', 'Concluída'],
										message:
											'O status é renderizado de forma condicional e mantém significado visual e textual.',
									},
								}
							: activity.id === 17
								? {
										...activity,
										tecnologia: 'React · useState · Filtros · Vercel',
										evidence: {
											tools: [
												{
													name: 'Botões',
													description: 'Todos, HTML, CSS, React, Git e Vercel controlam o filtro selecionado.',
												},
												{
													name: 'useState',
													description: 'technologyFilter guarda a tecnologia ativa sem alterar o array activities.',
												},
												{
													name: 'filter',
													description: 'A lista exibida é derivada com filter e permanece compatível com a fonte original.',
												},
											],
											message:
												'Selecione uma tecnologia acima para conferir o filtro funcionando sobre a lista completa.',
										},
									}
							: activity.id === 18
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Campo controlado',
													description: 'O valor digitado é armazenado em searchTerm com useState.',
												},
												{
													name: 'Busca sem distinção de caixa',
													description: 'Título e descrição são comparados em letras minúsculas.',
												},
												{
													name: 'Estado sem resultados',
													description: 'Uma mensagem é exibida quando a combinação de busca e tecnologia não encontra cartões.',
												},
											],
											message:
												'Digite um termo inexistente, como “xyz”, para conferir a mensagem de nenhum resultado.',
										},
									}
							: activity.id === 19
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Cálculo derivado',
													description:
														'completedActivities conta os itens cujo status é Concluída usando filter.',
												},
												{
													name: 'Formato',
													description:
														'O indicador apresenta a quantidade concluída em relação ao total de 30 atividades.',
												},
												{
													name: 'Atualização automática',
													description:
														'O valor acompanha os dados sem criar um useState separado para o contador.',
												},
											],
											message:
												'O contador exibido acima é calculado diretamente do array de atividades.',
										},
									}
							: activity.id === 20
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Percentual',
													description:
														'completionPercentage divide as atividades concluídas pelo total e arredonda o resultado.',
												},
												{
													name: 'Barra acessível',
													description:
														'O elemento progressbar informa aria-valuemin, aria-valuemax, aria-valuenow e aria-valuetext.',
												},
												{
													name: 'Sincronização',
													description:
														'A largura visual e o texto usam o mesmo percentual derivado do contador.',
												},
											],
											message:
												'A barra acompanha o contador e também representa corretamente os limites de 0% e 100%.',
										},
									}
							: activity.id === 21
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Abertura',
													description: 'Ver atividade abre os detalhes em um diálogo sobreposto.',
												},
												{
													name: 'Fechamento',
													description: 'O modal fecha pelo botão Fechar, pela tecla Escape e pelo clique na área externa.',
												},
												{
													name: 'Foco acessível',
													description: 'O foco vai para o controle Fechar e retorna ao botão que abriu o modal.',
												},
											],
											message:
												'Abra este cartão e use o teclado para testar a interação do modal.',
										},
									}
							: activity.id === 22
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Campos controlados',
													description: 'Nome, e-mail, assunto e mensagem são mantidos em um único estado React.',
												},
												{
													name: 'Validação',
													description: 'Labels associados, required e type=email ajudam o navegador a validar os dados.',
												},
												{
													name: 'Envio simulado',
													description: 'onSubmit impede o recarregamento e exibe uma confirmação sem backend.',
												},
											],
											message:
												'Use o formulário na seção Contato para testar o preenchimento e a confirmação.',
										},
									}
							: activity.id === 23
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Estado',
													description: 'isDarkTheme controla a preferência visual com useState.',
												},
												{
													name: 'Classe raiz',
													description: 'theme-dark é aplicada ao elemento principal para trocar as variáveis e superfícies.',
												},
												{
													name: 'Acessibilidade',
													description: 'O botão usa aria-pressed e mantém foco visível nos dois temas.',
												},
											],
											message:
												'Use o botão de tema no topo da página para alternar entre claro e escuro.',
										},
									}
							: activity.id === 24
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Chave',
													description: 'A preferência usa a chave portfolio-theme no localStorage.',
												},
												{
													name: 'Restauração',
													description: 'A preferência salva é lida durante a inicialização do componente App.',
												},
												{
													name: 'Padrão seguro',
													description: 'Sem valor salvo ou sem acesso ao armazenamento, o tema claro é utilizado.',
												},
											],
											message:
												'Recarregue a página após trocar o tema para confirmar que a preferência foi restaurada.',
										},
									}
							: activity.id === 25
								? {
										...activity,
										evidence: {
											tools: [
												{
													name: 'Componente Sobre',
													description: 'Sobre.jsx concentra a apresentação autoral e é usado na homepage.',
												},
												{
													name: 'Tecnologias',
													description: 'A lista informa tecnologias praticadas sem afirmar domínio absoluto.',
												},
												{
													name: 'Links profissionais',
													description: 'GitHub, LinkedIn e Lattes são apresentados como referências públicas.',
												},
											],
											message:
												'A seção Sobre pode ser acessada pelo menu e apresenta autoria, competências em prática e objetivo profissional.',
										},
									}
							: activity,
	),
]
