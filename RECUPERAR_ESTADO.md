# Como recuperar o estado do projeto

## Sua pasta NÃO está irreversível

Tudo que já foi commitado está no histórico do Git. Dá para voltar a qualquer versão.

---

## 1. Testar o estado atual (recomendado primeiro)

As alterações locais em `messages/` foram guardadas no stash. Agora sua pasta está igual ao último commit (com todos os textos de tradução).

1. Rode de novo o servidor:
   ```powershell
   npm run dev
   ```
2. Abra no navegador: **http://localhost:3000**
3. Você deve ser redirecionado para **http://localhost:3000/pt**. Confira se os textos aparecem (Sobre, Contato, Produtos, rodapé, etc.).
4. Se quiser recuperar as alterações que estavam só na sua máquina (ex.: bloco "nav" nas mensagens):
   ```powershell
   git stash pop
   ```

---

## 2. Voltar a um commit antigo (estado “original”)

Para ver os commits disponíveis:

```powershell
git log --oneline
```

Alguns marcos:

- **a651812** – Initial commit – Site Zilmer completo (primeiro estado)
- **3dac050** – Preparação para deploy no Vercel – projeto completo + guias
- **ecaa7ee** – Antes dos ajustes de deploy desta sessão
- **f7e1317** – Com todos os textos de tradução restaurados (about, footer, contact, products, news)
- **03541b4** – Estado atual (links com locale, params async, etc.)

### Opção A – Voltar a pasta toda para um commit

**Cuidado:** isso descarta alterações não commitadas.

```powershell
git reset --hard a651812
```

(Troque `a651812` pelo commit que quiser.)

### Opção B – Só recuperar arquivos específicos de um commit

Exemplo: trazer de volta só as mensagens do commit **f7e1317**:

```powershell
git checkout f7e1317 -- messages/pt.json messages/en.json
```

### Opção C – Ver o que tinha em um commit sem mudar nada

```powershell
git show a651812:messages/pt.json
```

---

## 3. Deploy em outra plataforma

O projeto é Next.js e pode ser deployado em qualquer lugar que suporte Node.

- **Netlify** – Conecta no GitHub e faz deploy automático (Next.js suportado).
- **Render** – Gratuito, conecta no repo e escolhe “Web Service” com comando `npm run build` e `npm run start`.
- **Railway** – Conecta no GitHub e deploy com um clique.
- **Outras** – Vercel não é obrigatória; qualquer host com Node 18+ e `npm run build` + `npm run start` funciona.

Em todas: conecte o repositório GitHub **severocapricho/zilmer-site1** e use:

- Build command: `npm run build`
- Output / start: o que a própria plataforma sugerir para Next.js (geralmente `npm run start` ou deixar em branco).

---

## 4. Resumo

| Dúvida | Resposta |
|--------|----------|
| A pasta na minha máquina já é irreversível? | **Não.** O Git guarda o histórico; dá para voltar a qualquer commit ou arquivo. |
| Como volto ao que havia antes? | Use `git log --oneline`, escolha o commit e faça `git reset --hard <commit>` ou `git checkout <commit> -- arquivo`. |
| Podemos fazer deploy em outra plataforma? | **Sim.** Netlify, Render, Railway etc. suportam Next.js; basta conectar o repo e configurar build/start. |
| Textos no localhost | O repositório já tem as traduções. Com o stash aplicado como acima, rode `npm run dev` e teste em **http://localhost:3000/pt**. |

Se quiser, diga qual commit ou qual “estado original” você quer (ex.: “como estava no primeiro commit” ou “como estava antes do deploy”) e eu te devolvo os comandos exatos.

