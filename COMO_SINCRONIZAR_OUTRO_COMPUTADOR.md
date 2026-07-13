# 🔄 Como Sincronizar o Projeto em Outro Computador

## ✅ Git Configurado

O Git já foi inicializado neste projeto. Agora você precisa conectar ao GitHub para sincronizar.

---

## 📋 Passo a Passo Completo

### **No Computador Atual (este):**

#### 1. Criar Repositório no GitHub

1. Acesse: https://github.com
2. Faça login na sua conta
3. Clique em **"New repository"** (ou **"+"** > **"New repository"**)
4. Configure:
   - **Nome**: `zilmer-site` (ou outro nome)
   - **Visibilidade**: Private (recomendado) ou Public
   - **NÃO marque** "Initialize with README" (já temos arquivos)
5. Clique em **"Create repository"**

#### 2. Conectar o Projeto ao GitHub

Após criar o repositório, o GitHub mostrará comandos. Execute estes comandos no terminal do Cursor:

```bash
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/zilmer-site.git

# Enviar o código para o GitHub
git branch -M main
git push -u origin main
```

**Exemplo:**
Se seu usuário for `rocco-digiulio`, o comando seria:
```bash
git remote add origin https://github.com/rocco-digiulio/zilmer-site.git
git branch -M main
git push -u origin main
```

---

### **No Outro Computador:**

#### 1. Instalar Dependências

Certifique-se de ter instalado:
- ✅ Node.js 18 ou superior
- ✅ Git
- ✅ Cursor (ou VS Code)

#### 2. Clonar o Repositório

1. Abra o Cursor no outro computador
2. Abra o terminal (Ctrl + `)
3. Navegue até onde quer clonar (ex: Desktop)
4. Execute:

```bash
# Clonar o repositório (substitua SEU_USUARIO pelo seu usuário do GitHub)
git clone https://github.com/SEU_USUARIO/zilmer-site.git

# Entrar na pasta
cd zilmer-site

# Instalar dependências
npm install

# Iniciar o servidor
npm run dev
```

#### 3. Trabalhar no Projeto

Agora você pode trabalhar normalmente! Quando fizer alterações:

```bash
# Ver o que mudou
git status

# Adicionar as mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push
```

#### 4. Sincronizar Mudanças

**Para puxar mudanças do outro computador:**
```bash
git pull
```

**Para enviar suas mudanças:**
```bash
git add .
git commit -m "Sua mensagem"
git push
```

---

## 🔄 Fluxo de Trabalho

### Trabalhando em Casa (Computador 1):
1. Fazer alterações
2. `git add .`
3. `git commit -m "Mudanças feitas"`
4. `git push`

### Trabalhando no Trabalho (Computador 2):
1. `git pull` (para pegar as mudanças do computador 1)
2. Fazer alterações
3. `git add .`
4. `git commit -m "Mudanças feitas"`
5. `git push`

---

## ⚠️ Importante

### Arquivos que NÃO são sincronizados:
- `node_modules/` (instale com `npm install` em cada computador)
- `.next/` (cache do Next.js - gerado automaticamente)
- Arquivos grandes de imagens (se configurado no .gitignore)

### Antes de trabalhar em outro computador:
1. Sempre execute `git pull` primeiro
2. Se houver conflitos, resolva antes de continuar
3. Execute `npm install` se adicionar novas dependências

---

## 🆘 Problemas Comuns

### "Repository not found"
- Verifique se o repositório existe no GitHub
- Verifique se você tem acesso (se for privado)

### "Permission denied"
- Configure suas credenciais Git:
  ```bash
  git config --global user.name "Seu Nome"
  git config --global user.email "seu@email.com"
  ```

### Conflitos de merge
- Se duas pessoas/editarem o mesmo arquivo:
  ```bash
  git pull
  # Resolver conflitos manualmente
  git add .
  git commit -m "Resolvido conflito"
  git push
  ```

---

## 📝 Comandos Úteis

```bash
# Ver status
git status

# Ver histórico
git log

# Ver diferenças
git diff

# Desfazer mudanças não commitadas
git checkout -- arquivo.tsx

# Ver branches
git branch
```

---

## ✅ Próximos Passos

1. **Criar repositório no GitHub** (se ainda não criou)
2. **Conectar este projeto** ao GitHub (comandos acima)
3. **No outro computador**, clonar e começar a trabalhar!

---

## 💡 Dica

Você pode usar o GitHub Desktop (aplicativo gráfico) se preferir uma interface visual ao invés da linha de comando!


