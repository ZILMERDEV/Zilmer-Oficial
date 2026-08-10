# AUTOMACOES.md — n8n + Flowise e monitoramento contínuo

> Status: **planejado, não instalado.** Docker não está presente nesta máquina
> (`docker: command not found`, verificado em 2026-08-04).
> Este arquivo é o plano de execução, não um estado ativo.

---

## Onde n8n e Flowise entram (e onde não entram)

Vale separar duas coisas que costumam se confundir:

**Pré-visualização do site** — ver como a página ficou antes de publicar.
Isso **não** é trabalho para n8n nem Flowise. Já está resolvido, e melhor, por:
- `preview_start` → `zilmer-dev` (localhost:3000) dentro do Claude Code
- Figma MCP quando houver link de design
- `node scripts/mobile-screenshot.js /pt --devices iphone-se,iphone-12`

**Monitoramento contínuo** — saber que o site está no ar, que o deploy passou, que
nada regrediu depois que você fechou o notebook. **Aqui n8n é a ferramenta certa**,
porque roda sozinho, num cron, sem sessão aberta.

Flowise é orquestrador de fluxo de LLM (RAG, agentes, chatbot). No contexto deste
projeto ele tem **um** uso claramente bom: um assistente sobre a documentação da
Zilmer — catálogos, especificações de transformadores, os ~25 `.md` de instruções —
seja para uso interno ou como chat no site. Não é ferramenta de acompanhamento visual.

**Antes de instalar qualquer coisa:** o Claude Code já tem `/loop` e tarefas agendadas
nativas. Se o objetivo é "checar o deploy a cada X minutos" ou "rodar `/check` toda
manhã", isso resolve sem Docker, sem porta aberta e sem mais um serviço para manter.
n8n só se paga quando você quer o monitoramento rodando **sem o Claude Code aberto**.

---

## Pré-requisito

Docker Desktop para Windows:
https://www.docker.com/products/docker-desktop/

Depois de instalar, conferir:

```bash
docker -v && docker compose version
```

---

## Subir os serviços

O arquivo `automacoes/docker-compose.yml` já está no repositório. Da raiz do projeto:

```bash
docker compose -f automacoes/docker-compose.yml up -d
```

- n8n → http://localhost:5678
- Flowise → http://localhost:3001

A porta 3000 fica livre de propósito — é do `npm run dev`.

Para derrubar:

```bash
docker compose -f automacoes/docker-compose.yml down
```

Os dados ficam em volumes nomeados (`n8n_data`, `flowise_data`), então `down` não
apaga os fluxos.

⚠️ Ambos ficam **abertos na sua máquina sem autenticação forte por padrão**. Use só
em `localhost`. Se um dia expor na internet, ative autenticação e HTTPS antes —
n8n com credenciais do GitHub e da AWS dentro é um alvo real.

---

## Fluxos n8n que valem a pena (ordem de valor)

### 1. Sentinela de deploy
`Schedule (5 min)` → `HTTP Request` na API do GitHub Actions →
`IF` conclusion = failure → notificação (e-mail/Telegram/WhatsApp)

```
GET https://api.github.com/repos/ZILMERDEV/Zilmer-Oficial/actions/runs?per_page=1
Header: Authorization: Bearer <PAT com escopo repo:read>
```

Hoje, se o deploy falhar no Lightsail, ninguém fica sabendo até alguém abrir o site.
Este é o fluxo de maior retorno.

### 2. Uptime das três rotas
`Schedule (10 min)` → `HTTP Request` em `https://www.zilmer.com.br/pt/`, `/en/`, `/es/`
→ `IF` status ≠ 200 **ou** tempo > 3s → alerta.

Cobre o caso do `pm2 restart` que não voltou.

### 3. Sentinela visual (regressão de layout)
`Schedule (diário)` → `Execute Command` rodando `scripts/mobile-screenshot.js`
contra produção → comparar com o baseline do dia anterior → alertar se a diferença
passar de um limiar.

```bash
node scripts/mobile-screenshot.js /pt --base https://www.zilmer.com.br --devices iphone-se
```

É o mais próximo de "visualização constante" que dá para automatizar de verdade.
Exige que o container tenha acesso ao repo e a um Chrome — na prática é mais simples
rodar esse por tarefa agendada do Windows do que dentro do Docker.

### 4. Guarda de conteúdo trilíngue
`Webhook` disparado por push no GitHub → roda a checagem de paridade de chaves
(`node -e` do agente `guardiao-i18n`) → alerta se `en` ou `es` ficou para trás.

Redundante com o `guardiao-i18n` durante a sessão, mas pega alteração feita fora do
Claude Code (edição direta no GitHub, por exemplo).

---

## Flowise — assistente da documentação Zilmer

Fluxo mínimo:
`Document Loader` (PDFs de `public/` + os `.md` da raiz) →
`Text Splitter` → `Embeddings` → `Vector Store` (in-memory para testar) →
`Conversational Retrieval QA Chain` → modelo Claude.

Dois destinos possíveis:
- **interno** — consultar especificações sem caçar PDF
- **público** — chat de pré-venda no site, respondendo dúvidas técnicas de catálogo

O segundo é decisão de negócio, não técnica: exige revisão do que o bot pode afirmar
sobre produto e do que acontece quando ele erra uma especificação elétrica. Não
publique um assistente técnico sem alguém da engenharia validar as respostas.

---

## Ordem sugerida

1. Instalar Docker
2. Subir o compose e criar **só o fluxo 1** (sentinela de deploy) — é o que resolve
   a lacuna real de hoje
3. Rodar por uma semana e ver se o alerta é útil ou vira ruído
4. Só então adicionar 2 e 3
5. Flowise por último, e só se o assistente de documentação tiver dono

---

## Registro

| Data | Status |
|---|---|
| 2026-08-04 | Plano criado. Docker ausente na máquina. Nada instalado ainda. |
