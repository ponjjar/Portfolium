# Portfolio Builder — Guia Completo do Wizard

Este documento documenta todas as 5 etapas da experiência guiada (Wizard) do **Portfolio Builder**.

---

## Rota Raiz: Welcome (`/`)
- **Objetivo:** Ponto de entrada do usuário. Apresenta o conceito "Um perfil. Três formas de se apresentar."
- **Funcionalidades:**
  - Botão "Começar agora" que inicializa ou retoma a sessão no passo 1 (`/profile`).
  - Botão e área de Dropzone para importar arquivos `.json` de sessões anteriores.
  - Informações de conformidade com privacidade (processamento 100% local no navegador/dispositivo).

---

## Etapa 1: Profile (`/(wizard)/profile`)
- **Objetivo:** Coleta dos dados biográficos fundamentais.
- **Campos:**
  - **Nome Completo**
  - **Título Profissional / Headline:** Ex: *Senior Full Stack Engineer*.
  - **Sobre Você / Bio:** Resumo da carreira e foco de atuação.
  - **Foto / Avatar:** Suporta URL remota direta ou upload local com modal de crop interativo (quadrado/redondo).
  - **Links Sociais:** GitHub, LinkedIn, Site pessoal, Twitter/X, etc.

---

## Etapa 2: Projects (`/(wizard)/projects`)
- **Objetivo:** Curadoria dos projetos e repositórios a serem exibidos.
- **Funcionalidades:**
  - **Importação Automática do GitHub:** Modal com busca de usuário, filtros por tipo (originais, forks, arquivados) e seleção múltipla.
  - **Varredura Inteligente:**
    - Manifests de dependências (`package.json`, `pom.xml`, `requirements.txt`) para detecção automática da stack.
    - Captura automática de imagens/screenshots presentes no `README.md` do repositório para usar como thumbnail.
  - **Adição Manual:** Formulário para projetos privados ou que não estejam no GitHub.
  - **Ordenação e Destaque:** Marcação de projetos como `featured` (destaque no topo do portfólio).

---

## Etapa 3: Skills (`/(wizard)/skills`)
- **Objetivo:** Consolidação e organização visual das competências técnicas.
- **Funcionalidades:**
  - Consolidação automática de todas as tecnologias extraídas dos projetos selecionados.
  - Agrupamento em categorias (ex: Frontend, Backend, Mobile, DevOps, Cloud).
  - Capacidade de adicionar tecnologias personalizadas ou remover tags detectadas.

---

## Etapa 4: AI Review (`/(wizard)/ai`)
- **Objetivo:** Otimização textual e refinamento da proposta de valor.
- **Funcionalidades:**
  - Etapa opcional com 3 opções claras:
    1. **IA Externa (Recomendado):** Gera um prompt pronto e estruturado contendo o perfil e os repositórios sanitizados para o usuário colar no ChatGPT/Claude e importar a resposta.
    2. **IA Gratuita Integrada:** Usa o modelo conectado da plataforma.
    3. **Continuar sem IA:** Avança diretamente sem modificações textuais.

---

## Etapa 5: Editor & Live Preview (`/(wizard)/editor`)
- **Objetivo:** Customização visual fina e exportação final.
- **Funcionalidades:**
  - **Live Preview:** Renderização em tempo real do template selecionado dentro de container isolado.
  - **Customização de Tema:** Escolha de presets (`cosmic-glow`, `minimal`, `amoled`, `lava`, etc.), cor de destaque e efeitos de fundo.
  - **Ordenação de Seções:** Reorganização por drag-and-drop da ordem de exibição (Hero, Projetos, Habilidades, Contato).
  - **Exportação Multiformato:**
    - `index.html` ou `.zip` completo pronto para hospedagem.
    - Markdown formatado para o `README.md` do perfil do GitHub.
    - Currículo em PDF gerado a partir dos mesmos dados.
