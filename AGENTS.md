# Portfolio Builder - Diretrizes de Arquitetura e Regras de Engenharia

Este documento consolida a arquitetura, padrões e diretrizes de desenvolvimento para o projeto **Portfolio Builder**.

---

## 1. Visão Geral da Arquitetura

O projeto adota uma **Arquitetura Universal** (Write Once, Run Anywhere) com Expo e React Native, compartilhando um único código-base para Web, Android, iOS e Desktop.

```text
portfolio-builder/
├── api/                     # Serverless endpoints (Vercel Functions / Proxy para APIs externas)
├── assets/                  # Imagens, fontes e estáticos do app
├── src/
│   ├── app/                 # Apresentação e Rotas (Expo Router - File-based routing)
│   │   ├── (wizard)/        # Fluxo guiado (profile, projects, skills, ai, editor)
│   │   └── _layout.tsx      # Root layout, providers e inicializações
│   ├── components/          # Componentes visuais desacoplados
│   │   ├── ui/              # Componentes base (Button, FormField, AmbientBackground, Modals)
│   │   ├── layout/          # Estruturas de layout e containers
│   │   ├── modals/          # Diálogos contextuais e fluxos secundários
│   │   └── github/          # Componentes de importação e seleção de repositórios
│   ├── domain/              # Núcleo de Domínio e Regras de Negócio
│   │   └── portfolio/       # Schemas Zod, tipos estáticos TypeScript e validadores
│   ├── features/            # Módulos funcionais coesos (ex: features/export com JSZip e ExportModal)
│   ├── services/            # Serviços externos isolados (GitHub Client, parser de README/manifests)
│   ├── storage/             # Adaptador de persistência local abstrato (AsyncStorage)
│   ├── store/               # Estado global centralizado (Zustand com autosave debounced de 500ms)
│   ├── templates/           # Motores de renderização de portfólio (ex: minimal) e ViewModels
│   ├── theme/ & i18n/       # Tokens de tema e internacionalização (i18next)
│   └── utils/               # Helpers genéricos e formatadores
└── tests/                   # Bateria de testes automatizados (Jest + React Native Testing Library)
```

---

## 2. Stack Tecnológica

- **Framework**: Expo (SDK 57) / React Native 0.86 / React 19
- **Roteamento**: Expo Router v57 (File-based routing)
- **Estilização**: NativeWind v4 + Tailwind CSS universal
- **Gerenciamento de Estado**: Zustand v5 (Persistência assíncrona local)
- **Validação de Schemas**: Zod v4 (Contratos de runtime e inferência de tipos estáticos)
- **Internacionalização (i18n)**: i18next & `expo-localization`
- **Testes**: Jest + `jest-expo` + `@testing-library/react-native`
- **Path Aliases**: `@/*` apontando para `./src/*`

---

## 3. Os 7 Padrões Obrigatórios de Desenvolvimento

1. **Validação e Tipagem Centralizadas no Domínio**:
   - Qualquer nova propriedade de dados da sessão deve nascer no schema Zod em `src/domain/portfolio/schema.ts` e ser inferida em `src/domain/portfolio/types.ts`.
   - Nunca crie interfaces soltas que possam divergir do schema de validação.

2. **Imutabilidade e Autosave no Store**:
   - Modificações de estado devem passar obrigatoriamente por actions no Zustand store (`src/store/index.ts`), respeitando imutabilidade e atualizando `metadata.updatedAt`.

3. **Isolamento de Plataforma (Universal First)**:
   - Componentes ou hooks com dependências específicas de plataforma (Web/DOM vs Mobile Nativo) devem utilizar extensões dedicadas (`.web.tsx` / `.native.tsx` ou `.ts`) ou hooks de abstração, mantendo paridade funcional e evitando quebras de build multiplataforma.

4. **Desacoplamento dos Motores de Template**:
   - Os templates de exportação devem operar exclusivamente a partir de dados sanitizados providos pelo `ViewModel` (`src/templates/viewModel.ts`), gerando HTML/CSS estático limpo e autocontido, sem dependências dinâmicas do bundle cliente.

5. **Tratamento de Serviços Externos via Adapters**:
   - Chamadas a APIs externas (GitHub, LinkedIn, Notion, IA, etc.) devem ser encapsuladas na camada `services/`, normalizando erros, respostas e limites de taxa antes de qualquer interação com o estado global.

6. **Internacionalização Rigorosa (Zero Strings Hardcoded)**:
   - **É terminantemente proibido** inserir textos fixos/literais na interface (títulos, botões, modais, placeholders, mensagens de erro, tooltips, tags, etc.).
   - Todo e qualquer texto visível deve utilizar o hook `useTranslation()` (`const { t } = useTranslation()`).
   - Toda nova chave criada deve ser adicionada **obrigatoriamente e em paridade** em ambos os arquivos de dicionário: `src/i18n/locales/pt.json` e `src/i18n/locales/en.json`.
   - Ao refatorar ou tocar em telas antigas, substitua qualquer texto em português ou inglês fixo pelas chaves i18n correspondentes.

7. **Consistência de Temas e Tokens Semânticos (Zero Cores Hardcoded)**:
   - **É proibido** o uso de cores hexadecimais fixas ou classes Tailwind literais (`bg-white`, `bg-black`, `text-white`, `text-black`, `#000`, `#FFF`) em componentes visuais.
   - Sempre utilize os tokens semânticos universais definidos no sistema de temas (`src/global.css`):
     - Backgrounds: `bg-background`, `bg-surface`, `bg-surface-elevated`
     - Textos: `text-text`, `text-text-secondary`, `text-text-muted`
     - Bordas: `border-border`, `border-border-strong`
     - Ações/Destaques: `bg-primary`, `text-primary-foreground`
   - Todo componente, modal ou elemento animado (`Reanimated`) deve ser compatível e testado contra os 4 temas disponíveis: `light`, `dark`, `lava` e `amoled`.
   - Elementos sobrepostos (Modais, Toasts, Dropdowns) devem garantir herança correta de tema (`theme-${theme}`) ou backdrop filters translúcidos com legibilidade de alto contraste.

---

## 4. Comandos e Validações Úteis

- **Verificação Completa**: `npm run check` (Lint + Typecheck + Testes)
- **Testes**: `npm test`
- **Typecheck**: `npm run typecheck`
- **Linter**: `npm run lint`
