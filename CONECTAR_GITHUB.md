# Guia: Conectar Projeto ao GitHub e Fazer Push

Este guia explica como conectar seu projeto local ao GitHub e fazer o push para que o Vercel possa fazer o deploy.

## 📋 Pré-requisitos

- Conta no GitHub (já tem, pois fez login no Vercel com GitHub)
- Git instalado (já está instalado)
- Projeto já commitado localmente ✅ (já feito!)

## 🚀 Passo 1: Criar Repositório no GitHub

### Opção A: Via Interface Web (Recomendado)

1. Acesse https://github.com e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Preencha:
   - **Repository name**: `zilmer-site` (ou outro nome de sua preferência)
   - **Description**: "Site Zilmer Transformadores - Next.js"
   - **Visibility**: 
     - ✅ **Public** (gratuito, visível para todos)
     - ⚠️ **Private** (requer plano pago ou GitHub Pro)
   - **NÃO marque** "Add a README file" (já temos arquivos)
   - **NÃO marque** "Add .gitignore" (já temos)
   - **NÃO marque** "Choose a license"
4. Clique em **"Create repository"**

### Opção B: Via GitHub CLI (se tiver instalado)

```bash
gh repo create zilmer-site --public --source=. --remote=origin --push
```

## 🔗 Passo 2: Conectar Repositório Local ao GitHub

Após criar o repositório no GitHub, você verá uma página com instruções. Use uma das opções abaixo:

### Opção A: Repositório no GitHub = `zilmer-site1` (pasta local = zilmer-site)

**Jeito mais fácil:** dê dois cliques no arquivo **`push-github.bat`** na raiz do projeto. Ele vai pedir seu usuário do GitHub e enviar tudo.

**Ou no CMD** (abra o CMD, vá na pasta do projeto e rode):

```cmd
cd c:\Users\rocco.digiulio\Desktop\zilmer-site

git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/zilmer-site1.git

git push -u origin main
```

Substitua **SEU_USUARIO** pelo seu usuário do GitHub (ex: `rocco.digiulio`).

---

### Opção B: Se o repositório no GitHub tiver outro nome (ex: zilmer-site)

Execute estes comandos no terminal (na pasta do projeto):

```bash
# Adicionar o remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/zilmer-site.git

# Verificar se foi adicionado corretamente
git remote -v

# Fazer push do código
git branch -M main
git push -u origin main
```

### Opção B: Se já tem arquivos no GitHub (não é o caso, mas caso precise)

```bash
git remote add origin https://github.com/SEU_USUARIO/zilmer-site.git
git branch -M main
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 🔐 Passo 3: Autenticação

Ao fazer o push, você pode precisar autenticar:

### Opção A: Personal Access Token (Recomendado)

1. No GitHub, vá em **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **"Generate new token (classic)"**
3. Dê um nome (ex: "Vercel Deploy")
4. Selecione escopos: **repo** (acesso completo a repositórios)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você não verá novamente!)
7. Ao fazer push, quando pedir senha, use o token em vez da senha

### Opção B: GitHub CLI

```bash
gh auth login
```

### Opção C: SSH (Mais seguro, mas requer configuração)

1. Gere uma chave SSH: `ssh-keygen -t ed25519 -C "seu-email@exemplo.com"`
2. Adicione ao GitHub: **Settings** → **SSH and GPG keys** → **New SSH key**
3. Use URL SSH: `git remote add origin git@github.com:SEU_USUARIO/zilmer-site.git`

## ✅ Passo 4: Verificar Push

Após o push bem-sucedido:

1. Acesse seu repositório no GitHub: `https://github.com/SEU_USUARIO/zilmer-site`
2. Verifique se todos os arquivos estão lá
3. Você deve ver os commits: "Initial commit" e "Preparação para deploy no Vercel..."

## 🎯 Passo 5: Conectar ao Vercel

Agora que o código está no GitHub:

1. Acesse https://vercel.com
2. Clique em **"Add New Project"**
3. Selecione o repositório **zilmer-site**
4. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install`
5. Clique em **"Deploy"**

O Vercel irá:
- Clonar o repositório
- Instalar dependências
- Fazer o build
- Fazer o deploy

## 🔄 Próximos Passos

Após o deploy inicial:

1. Configure o domínio `zilmer.com.br` no Vercel
2. Atualize DNS no Cloudflare (veja `GUIA_MIGRACAO_VERCEL.md`)
3. Teste o site

## 🆘 Troubleshooting

### Erro: "remote origin already exists"

```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU_USUARIO/zilmer-site.git
```

### Erro: "authentication failed"

- Use Personal Access Token em vez de senha
- Ou configure SSH

### Erro: "failed to push some refs"

```bash
# Fazer pull primeiro (se houver conflitos)
git pull origin main --allow-unrelated-histories

# Resolver conflitos se houver
# Depois fazer push novamente
git push -u origin main
```

### Verificar status do Git

```bash
git status
git remote -v
git log --oneline -5
```

## 📝 Comandos Úteis

```bash
# Ver remotes configurados
git remote -v

# Ver branches
git branch -a

# Ver histórico de commits
git log --oneline

# Ver status atual
git status

# Fazer push de mudanças futuras
git add .
git commit -m "Descrição das mudanças"
git push
```

---

**Próximo passo**: Após fazer o push, vá para o Vercel e conecte o repositório!

