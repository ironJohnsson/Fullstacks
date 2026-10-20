export const conteudo = {
  pt: {
    nav: [
      { id: "inicio", label: "Início" },
      { id: "sobre", label: "Sobre" },
      { id: "projetos", label: "Projetos" },
      { id: "habilidades", label: "Habilidades" },
      { id: "experiencia", label: "Experiência" },
      { id: "certificacoes", label: "Certificações" },
      { id: "hobbies", label: "Hobbies" },
      { id: "contato", label: "Contato" }
    ],
    hero: {
      frases: [
        "Engenharia da Computação - SENAI CIMATEC",
        "Bacharelado em Computação - UFBA",
        "Desenvolvedor XR & Games (Unreal & Unity)",
        "Pesquisador em Computação Quântica",
        "Bolsista QUIIN - HIIVE LAB"
      ]
    },
    marquee: [
      "Bem-vindo ao meu portfólio!",
      "Programação",
      "Computação Quântica",
      "Realidade Virtual (VR)",
      "Impressão 3D",
      "Unreal Engine 5"
    ],
    sobre: {
      titulo: "Sobre Mim",
      paragrafos: [
        {
          prefix: "Sou estudante de ",
          strong1: "Engenharia de Computação no SENAI CIMATEC",
          middle: " e de ",
          strong2: "Computação na Universidade Federal da Bahia (UFBA)",
          suffix: ", com foco em desenvolvimento de software, ambientes imersivos em realidade virtual e pesquisa aplicada."
        },
        {
          prefix: "Atualmente atuo como ",
          strong1: "Bolsista do QUIIN no Hiive Lab (SENAI CIMATEC)",
          middle: "",
          strong2: "",
          suffix: ", desenvolvendo soluções tecnológicas voltadas para inovação no ensino e buscando conectar a pesquisa acadêmica a aplicações práticas de alto impacto."
        }
      ]
    },
    projetos: {
      titulo: "Meus Projetos",
      placeholderBusca: " Buscar projetos ou tecnologias...",
      verMais: "Ver Detalhes ▼",
      recolher: "Recolher Detalhes ▲",
      detalhesTitulo: "Detalhes do Projeto",
      semResultados: (busca) => `Nenhum projeto encontrado para a busca "${busca}".`,
      categorias: [
        { id: "todos", label: "Todos" },
        { id: "vr_ar", label: "VR / AR" },
        { id: "3d", label: "3D & Impressão" },
        { id: "simulacao", label: "Simulação" }
      ],
      lista: [
        {
          id: 1,
          categoriaId: "vr_ar",
          categoria: "VR / AR",
          titulo: "Quiin VR",
          tags: ["Unreal Engine", "VR", "Computação Quântica", "BB84"],
          descricao:
            "O projeto QUIIN VR propõe o desenvolvimento de um ambiente imersivo de realidade virtual para o ensino de conceitos de computação e criptografia quântica.",
          detalhes:
            "Utilizando a Unreal Engine e dispositivos de realidade virtual, a experiência permitirá aos usuários explorar conceitos abstratos de forma interativa, com destaque para o protocolo BB84, contribuindo para a democratização do ensino de tecnologias quânticas e tornando o aprendizado mais visual, acessível e envolvente."
        },
        {
          id: 2,
          categoriaId: "vr_ar",
          categoria: "VR / AR",
          titulo: "WINE",
          tags: ["Unreal Engine", "Vídeo 360°", "Enoturismo"],
          descricao:
            "O projeto WINE tinha como proposta um tour virtual imersivo por uma vinícola de Morro do Chapéu, Bahia, utilizando a Unreal Engine, imagens e vídeos em 360°.",
          detalhes:
            "A experiência permitirá explorar a vinícola, conhecer sua produção, terroir e aspectos culturais, ampliando o acesso ao enoturismo e valorizando a vitivinicultura regional."
        },
        {
          id: 3,
          categoriaId: "3d",
          categoria: "3D & Impressão",
          titulo: "Exposição didática de invertebrados fósseis",
          tags: ["Modelagem 3D", "Impressão 3D", "Divulgação Científica"],
          descricao:
            "O projeto propõe a criação de modelos 3D de fósseis de invertebrados, visando democratizar o acesso ao conhecimento paleontológico.",
          detalhes:
            "As peças, acompanhadas de informações científicas, serão utilizadas em atividades de ensino, divulgação científica e formação acadêmica, contribuindo para aproximar estudantes e sociedade da paleontologia."
        },
        {
          id: 4,
          categoriaId: "simulacao",
          categoria: "Simulação",
          titulo: "Presence Training",
          tags: ["Unity", "VR", "Segurança do Trabalho", "Simulação"],
          descricao:
            "O projeto Presence Training propõe uma experiência imersiva de treinamento para atividades em altura, como limpeza de vidros e fachadas de edifícios, utilizando a Unity e óculos de realidade virtual.",
          detalhes:
            "A experiência simula situações de trabalho e apresenta procedimentos, métodos de segurança e boas práticas, permitindo que os usuários aprendam e praticuem em um ambiente controlado e seguro, contribuindo para a prevenção de acidentes."
        }
      ]
    },
    habilidades: {
      titulo: "Habilidades",
      placeholderBusca: " Filtrar habilidades...",
      lista: [
        { nome: "Computação Quântica", tipo: "Avançado" },
        { nome: "C++", tipo: "Linguagem" },
        { nome: "C", tipo: "Linguagem" },
        { nome: "C#", tipo: "Linguagem" },
        { nome: "Java", tipo: "Linguagem" },
        { nome: "Python", tipo: "Linguagem" },
        { nome: "Unreal Engine 5", tipo: "Engine" },
        { nome: "Unity", tipo: "Engine" },
        { nome: "GameMaker", tipo: "Engine" },
        { nome: "Realidade Virtual (VR)", tipo: "Tecnologia" },
        { nome: "Impressão 3D (Filamento & Resina)", tipo: "Hardware" },
        { nome: "Modelagem 3D", tipo: "Design" },
        { nome: "Git / GitHub", tipo: "Ferramenta" },
        { nome: "Pesquisa e Desenvolvimento", tipo: "Metodologia" },
        { nome: "English Certificate C2", tipo: "Idioma" },
        { nome: "Google Cloud Computing", tipo: "Cloud" },
        { nome: "Design de Games", tipo: "Design" }
      ]
    },
    experiencia: {
      titulo: "Experiência",
      lista: [
        {
          empresa: "QUIIN - Hiive Lab",
          cargo: "Bolsista de Pesquisa e Desenvolvimento",
          periodo: "Maio de 2026 - Presente",
          descricao:
            "Desenvolvimento de simulações e ambientes imersivos VR voltados para o ensino de computação quântica."
        },
        {
          empresa: "Universidade Senai Cimatec",
          cargo: "Voluntário",
          periodo: "Junho de 2025 - Junho de 2026",
          descricao: "Atuação em projetos acadêmicos e extensão tecnológica."
        },
        {
          empresa: "Universidade Federal da Bahia",
          cargo: "Voluntário",
          periodo: "Junho de 2025 - Junho de 2026",
          descricao: "Apoio a pesquisas e desenvolvimento de modelos didáticos 3D."
        },
        {
          empresa: "IEEE",
          cargo: "Trainee",
          periodo: "Agosto de 2024 - Agosto de 2025",
          descricao:
            "Participação em grupos de estudo, organização de eventos e capacitação técnica."
        }
      ]
    },
    certificacoes: {
      titulo: "Certificações & Cursos",
      lista: [
        "Curso de curta duração - Unreal Engine 5 Blueprints",
        "Curso de curta duração - Modelagem & Impressão 3D",
        "Curso de curta duração - Java + Programação Orientada a Objetos",
        "Curso de curta duração - Impressão 3D em Resina",
        "Curso de curta duração - Desenvolvimento de Jogos com Unity",
        "Curso de curta duração - Curso GameMaker",
        "Curso de curta duração - Captação de imagens com câmera 360° para Realidade Virtual",
        "Curso de curta duração - Google Cloud Computing Foundations",
        "Curso de curta duração - Hardware de Computadores"
      ]
    },
    hobbies: {
      titulo: "Hobbies & Interesses",
      subtitulo:
        "Conheça um pouco das minhas paixões fora do ambiente acadêmico e profissional.",
      lista: [
        {
          titulo: "Jogos",
          imagem: "/img/hobbies/games.png",
          descricao:
            "Gosto de jogar tanto jogos online quanto de tabletop e explorar diferentes gêneros, além de me interessar por game design e desenvolvimento."
        },
        {
          titulo: "Impressão 3D",
          imagem: "/img/hobbies/impressao3d.png",
          descricao:
            "Tenho interesse em modelagem e impressão 3D, explorando tanto o uso de filamento quanto resina."
        },
        {
          titulo: "Viajar",
          imagem: "/img/hobbies/travel.png",
          descricao:
            "Gosto de viajar pelo país, normalmente atravessando a Bahia até chegar no interior de Minas na vila de Maringá/Mauá."
        },
        {
          titulo: "Cozinhar",
          imagem: "/img/hobbies/Cozinhar.png",
          descricao:
            "Tenho o costume de cozinhar normalmente massas, biscoitos e bolos. Também estou produzindo diferentes sabores de cachaça quando viajo."
        },
        {
          titulo: "Basquete",
          imagem: "/img/hobbies/Basquete.png",
          descricao:
            "Pratico basquete por 12 anos, tendo participação em times na época de colégio por 4 anos, e uma rápida participação na atlética durante a faculdade."
        },
        {
          titulo: "Música",
          imagem: "/img/hobbies/musica.jpg",
          descricao:
            "Tenho interesse em ouvir música, explorando diferentes estilos e artistas de diferentes locais do mundo de diferentes épocas e diferentes gêneros."
        },
        {
          titulo: "Leitura",
          imagem: "/img/hobbies/livro.png",
          descricao:
            "Gosto de ler livros e quadrinhos, tendo mantido coleções de quadrinhos e explorado diversos livros tanto didáticos quanto por lazer."
        }
      ]
    },
    contato: {
      titulo: "Contato",
      subtitulo: "Sinta-se à vontade para se conectar comigo:"
    },
    footer: {
      direitos: "© 2026 Matheus Luiz Neves Johnsson. Todos os direitos reservados."
    },
    voltarTopo: "Voltar ao topo",
    btnIdiomaTitle: "Switch to English / Mudar para Inglês"
  },
  en: {
    nav: [
      { id: "inicio", label: "Home" },
      { id: "sobre", label: "About" },
      { id: "projetos", label: "Projects" },
      { id: "habilidades", label: "Skills" },
      { id: "experiencia", label: "Experience" },
      { id: "certificacoes", label: "Certifications" },
      { id: "hobbies", label: "Hobbies" },
      { id: "contato", label: "Contact" }
    ],
    hero: {
      frases: [
        "Computer Engineering - SENAI CIMATEC",
        "B.S. in Computer Science - UFBA",
        "XR & Games Developer (Unreal & Unity)",
        "Quantum Computing Researcher",
        "QUIIN Research Fellow - HIIVE LAB"
      ]
    },
    marquee: [
      "Welcome to my portfolio!",
      "Programming",
      "Quantum Computing",
      "Virtual Reality (VR)",
      "3D Printing",
      "Unreal Engine 5"
    ],
    sobre: {
      titulo: "About Me",
      paragrafos: [
        {
          prefix: "I am an undergraduate student in ",
          strong1: "Computer Engineering at SENAI CIMATEC",
          middle: " and ",
          strong2: "Computer Science at the Federal University of Bahia (UFBA)",
          suffix: ", with a strong focus on software development, immersive virtual reality environments, and applied research."
        },
        {
          prefix: "Currently, I work as a ",
          strong1: "Research Fellow for QUIIN at Hiive Lab (SENAI CIMATEC)",
          middle: "",
          strong2: "",
          suffix: ", developing innovative educational technologies and connecting academic scientific research with high-impact practical solutions."
        }
      ]
    },
    projetos: {
      titulo: "My Projects",
      placeholderBusca: " Search projects or technologies...",
      verMais: "View Details ▼",
      recolher: "Collapse Details ▲",
      detalhesTitulo: "Project Details",
      semResultados: (busca) => `No projects found for "${busca}".`,
      categorias: [
        { id: "todos", label: "All" },
        { id: "vr_ar", label: "VR / AR" },
        { id: "3d", label: "3D & Printing" },
        { id: "simulacao", label: "Simulation" }
      ],
      lista: [
        {
          id: 1,
          categoriaId: "vr_ar",
          categoria: "VR / AR",
          titulo: "Quiin VR",
          tags: ["Unreal Engine", "VR", "Quantum Computing", "BB84"],
          descricao:
            "The QUIIN VR project proposes developing an immersive virtual reality environment for teaching quantum computing and cryptography concepts.",
          detalhes:
            "Utilizing Unreal Engine and virtual reality headsets, the experience allows users to explore abstract concepts interactively, with special emphasis on the BB84 protocol, contributing to the democratization of quantum technology education and making learning visual, accessible, and engaging."
        },
        {
          id: 2,
          categoriaId: "vr_ar",
          categoria: "VR / AR",
          titulo: "WINE",
          tags: ["Unreal Engine", "360° Video", "Wine Tourism"],
          descricao:
            "The WINE project designed an immersive virtual tour through a winery in Morro do Chapéu, Bahia, utilizing Unreal Engine, 360° images, and videos.",
          detalhes:
            "The experience allows visitors to explore the winery, learn about its production, terroir, and cultural heritage, expanding access to wine tourism and promoting regional viticulture."
        },
        {
          id: 3,
          categoriaId: "3d",
          categoria: "3D & Printing",
          titulo: "Didactic Exhibition of Invertebrate Fossils",
          tags: ["3D Modeling", "3D Printing", "Science Communication"],
          descricao:
            "This project develops 3D models of invertebrate fossils, aiming to democratize access to paleontological knowledge.",
          detalhes:
            "The pieces, accompanied by scientific information, are used in educational activities, science outreach, and academic training, bringing students and the general public closer to paleontology."
        },
        {
          id: 4,
          categoriaId: "simulacao",
          categoria: "Simulation",
          titulo: "Presence Training",
          tags: ["Unity", "VR", "Workplace Safety", "Simulation"],
          descricao:
            "The Presence Training project offers an immersive VR training experience for working at heights, such as exterior window and building facade cleaning, using Unity.",
          detalhes:
            "The simulation replicates workplace scenarios and demonstrates safety protocols, methods, and best practices, enabling users to learn and practice in a controlled, safe environment to prevent accidents."
        }
      ]
    },
    habilidades: {
      titulo: "Skills",
      placeholderBusca: " Filter skills...",
      lista: [
        { nome: "Quantum Computing", tipo: "Advanced" },
        { nome: "C++", tipo: "Language" },
        { nome: "C", tipo: "Language" },
        { nome: "C#", tipo: "Language" },
        { nome: "Java", tipo: "Language" },
        { nome: "Python", tipo: "Language" },
        { nome: "Unreal Engine 5", tipo: "Engine" },
        { nome: "Unity", tipo: "Engine" },
        { nome: "GameMaker", tipo: "Engine" },
        { nome: "Virtual Reality (VR)", tipo: "Technology" },
        { nome: "3D Printing (Filament & Resin)", tipo: "Hardware" },
        { nome: "3D Modeling", tipo: "Design" },
        { nome: "Git / GitHub", tipo: "Tool" },
        { nome: "Research & Development", tipo: "Methodology" },
        { nome: "English Certificate C2", tipo: "Language" },
        { nome: "Google Cloud Computing", tipo: "Cloud" },
        { nome: "Game Design", tipo: "Design" }
      ]
    },
    experiencia: {
      titulo: "Experience",
      lista: [
        {
          empresa: "QUIIN - Hiive Lab",
          cargo: "R&D Research Fellow",
          periodo: "May 2026 - Present",
          descricao:
            "Development of simulations and immersive VR environments focused on quantum computing education."
        },
        {
          empresa: "SENAI CIMATEC University",
          cargo: "Volunteer",
          periodo: "June 2025 - June 2026",
          descricao: "Engagement in academic projects and technological extension."
        },
        {
          empresa: "Federal University of Bahia",
          cargo: "Volunteer",
          periodo: "June 2025 - June 2026",
          descricao: "Research support and development of educational 3D models."
        },
        {
          empresa: "IEEE",
          cargo: "Trainee",
          periodo: "August 2024 - August 2025",
          descricao:
            "Participation in study groups, event planning, and technical skill development."
        }
      ]
    },
    certificacoes: {
      titulo: "Certifications & Courses",
      lista: [
        "Short Course - Unreal Engine 5 Blueprints",
        "Short Course - 3D Modeling & Printing",
        "Short Course - Java + Object-Oriented Programming",
        "Short Course - Resin 3D Printing",
        "Short Course - Game Development with Unity",
        "Short Course - GameMaker Course",
        "Short Course - 360° Camera Image Capture for Virtual Reality",
        "Short Course - Google Cloud Computing Foundations",
        "Short Course - Computer Hardware"
      ]
    },
    hobbies: {
      titulo: "Hobbies & Interests",
      subtitulo:
        "Discover some of my passions outside the academic and professional sphere.",
      lista: [
        {
          titulo: "Gaming",
          imagem: "/img/hobbies/games.png",
          descricao:
            "I enjoy playing both online and tabletop games across various genres, along with a deep interest in game design and development."
        },
        {
          titulo: "3D Printing",
          imagem: "/img/hobbies/impressao3d.png",
          descricao:
            "I am passionate about 3D modeling and printing, working with both filament (FDM) and resin technologies."
        },
        {
          titulo: "Traveling",
          imagem: "/img/hobbies/travel.png",
          descricao:
            "I love road trips across Brazil, frequently traveling through Bahia to the mountain village of Maringá/Mauá in Minas Gerais."
        },
        {
          titulo: "Cooking",
          imagem: "/img/hobbies/Cozinhar.png",
          descricao:
            "I love cooking, especially pasta, cookies, and cakes. I also craft different flavored artisanal cachaças when traveling."
        },
        {
          titulo: "Basketball",
          imagem: "/img/hobbies/Basquete.png",
          descricao:
            "I have played basketball for 12 years, including 4 years in high school leagues and participating in the university athletic association."
        },
        {
          titulo: "Music",
          imagem: "/img/hobbies/musica.jpg",
          descricao:
            "I love listening to music, exploring eclectic genres, eras, and artists from across the globe."
        },
        {
          titulo: "Reading",
          imagem: "/img/hobbies/livro.png",
          descricao:
            "I enjoy reading books and comics, curating collections and exploring both academic literature and fiction."
        }
      ]
    },
    contato: {
      titulo: "Contact",
      subtitulo: "Feel free to connect with me:"
    },
    footer: {
      direitos: "© 2026 Matheus Luiz Neves Johnsson. All rights reserved."
    },
    voltarTopo: "Back to top",
    btnIdiomaTitle: "Mudar para Português / Switch to Portuguese"
  }
};
