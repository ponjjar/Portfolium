# Portfolio Builder

## Visão do Produto
Portfolio Builder será um aplicativo para criação automática de portfólios profissionais. O aplicativo é Universal (Web + Android).

O usuário deverá conseguir iniciar uma sessão, preencher informações pessoais e profissionais, adicionar projetos manuais ou via GitHub, destacar suas habilidades e personalizar o tema para gerar e exportar um portfólio em HTML ou salvar a sessão para continuar depois.

## Princípio Central da Arquitetura
Toda a aplicação deve trabalhar em cima de um único domínio: `PortfolioSession`.

Formulários, importações e lógicas de IA modificam e alimentam a `PortfolioSession`, que é a fonte de verdade da aplicação. A exportação HTML lê dessa sessão utilizando um `TemplateRenderer`.

## Organização de Pastas
A estrutura segue:
- `app/`: Rotas do Expo Router.
- `src/domain/`: Regras de negócios, schemas Zod, tipos da sessão.
- `src/features/`: Componentes e lógicas específicas de negócio (profile, projects, github).
- `src/store/`: Gerenciamento de estado global com Zustand.
- `src/storage/`: Abstração de persistência.
- `src/templates/`: Motores de renderização de preview e exportação.
- `src/theme/`: Tokens e design system.
