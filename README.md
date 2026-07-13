# Site Zilmer Transformadores

Site moderno e responsivo para a Zilmer Transformadores, desenvolvido com Next.js.

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Build para Produção

Para criar uma versão estática do site:

```bash
npm run build
```

Os arquivos estáticos estarão na pasta `out/`.

## 🌐 Deploy

### Deploy no Vercel (Recomendado)

Este projeto está configurado para deploy no **Vercel** com suporte a domínio personalizado e Cloudflare.

#### Guias Disponíveis:

1. **`CONECTAR_GITHUB.md`** - Como conectar o projeto ao GitHub
2. **`GUIA_MIGRACAO_VERCEL.md`** - Guia completo de migração AWS → Vercel com Cloudflare
3. **`verificar-deploy.md`** - Checklist de verificação pré-deploy

#### Passos Rápidos:

1. **Conectar ao GitHub** (veja `CONECTAR_GITHUB.md`):
   - Criar repositório no GitHub
   - Fazer push do código
   
2. **Deploy no Vercel**:
   - Acesse https://vercel.com
   - Conecte o repositório GitHub
   - O Vercel detectará automaticamente Next.js e fará o deploy

3. **Configurar Domínio** (veja `GUIA_MIGRACAO_VERCEL.md`):
   - Adicione `zilmer.com.br` no Vercel
   - Atualize DNS no Cloudflare
   - Mantenha proteção Cloudflare ativa

### Outras Plataformas

- **Netlify**: Conecte via Git para deploy automático
- **GitHub Pages**: Requer build estático (`output: 'export'` no `next.config.js`)

## 📁 Estrutura do Projeto

```
├── app/                    # Páginas e rotas (App Router do Next.js)
│   ├── sobre/             # Páginas sobre a empresa
│   ├── produtos/          # Páginas de produtos
│   └── contato/           # Página de contato
├── components/            # Componentes reutilizáveis
│   ├── Header.tsx         # Cabeçalho com navegação
│   └── Footer.tsx         # Rodapé
└── public/                # Arquivos estáticos (imagens, etc.)
```

## 🎨 Personalização

- **Cores**: Edite as variáveis CSS em `app/globals.css`
- **Conteúdo**: Edite os arquivos em `app/` para modificar o conteúdo das páginas
- **Logo**: Adicione sua logo em `public/logoaba4.png`

## 📝 Notas Importantes

- O site está configurado para exportação estática (`output: 'export'` no `next.config.js`)
- **LOGO**: Adicione o arquivo `logoaba4.png` na pasta `public/` para que o logo apareça no cabeçalho
- Todas as imagens devem ser otimizadas antes de adicionar ao projeto
- O site está totalmente em português brasileiro
- Design moderno e responsivo, inspirado em sites profissionais do setor

## 🔧 Tecnologias Utilizadas

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules
- Design responsivo e moderno

