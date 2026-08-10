# DESIGN.md — Sistema Visual do Site Zilmer

> Fonte de verdade dos tokens: `app/globals.css`.
> Este arquivo documenta o **porquê** e as regras de uso. Consultar antes de mexer em estilo.
> Atualizado pelo agente `memoria` quando um padrão visual muda.

---

## Identidade

Site institucional B2B de fabricante de transformadores elétricos. O visitante é
engenheiro, comprador técnico ou gestor de utility avaliando fornecedor para
compra de alto valor. O que o site precisa comunicar: **competência técnica,
solidez e confiabilidade**. O que ele não pode parecer: startup, agência criativa,
e-commerce.

Consequência prática: densidade de informação alta, cor contida, tipografia
legível antes de expressiva, foto de produto real acima de ilustração.

---

## Tokens de cor

```css
--primary-color:   #003366   /* azul-marinho institucional */
--secondary-color: #0066cc   /* azul médio */
--accent-color:    #ff6600   /* laranja */
--text-dark:       #1a1a1a
--text-light:      #666666
--bg-light:        #f5f5f5
--bg-white:        #ffffff
--border-color:    #e0e0e0
```

**Regras de uso**

| Token | Onde usar | Onde não usar |
|---|---|---|
| `--primary-color` | títulos (`h1`–`h6` por padrão), header, rodapé | corpo de texto — 12,6:1 é contraste demais para leitura longa |
| `--secondary-color` | links, ícones, estados de hover | grandes áreas de fundo |
| `--accent-color` | **só a ação primária da tela** (CTA de contato/orçamento) | títulos, bordas decorativas, mais de um elemento por tela |
| `--text-light` | texto secundário, legendas | texto pequeno sobre `--bg-light` |

**Contraste medido (WCAG)**

| Combinação | Razão | Veredicto |
|---|---|---|
| `--text-dark` sobre branco | 18,1:1 | ✅ folgado |
| `--primary-color` sobre branco | 12,6:1 | ✅ folgado |
| `--text-light` sobre branco | 5,7:1 | ✅ passa AA corpo |
| `--text-light` sobre `--bg-light` | 5,0:1 | 🟡 passa, sem margem — não reduzir a fonte aqui |
| `--secondary-color` sobre branco | 5,6:1 | ✅ passa AA corpo |
| `--accent-color` sobre branco | 3,1:1 | 🔴 **reprova em texto de corpo** |

**`--accent-color` #ff6600 só serve como fundo de botão com texto branco, ou em texto
grande (≥24px, ou ≥19px em bold).** Laranja em texto pequeno sobre branco é o erro de
acessibilidade mais provável neste projeto.

---

## Tipografia

Font stack de sistema (`-apple-system, Segoe UI, Roboto…`) — carrega instantâneo,
zero requisição de fonte. Manter, a menos que a marca exija tipografia própria; se
exigir, usar `next/font` com `display: swap` e subset latin.

```
h1  2.5rem / line-height 1.2
h2  2rem   / line-height 1.3
h3  1.5rem
body 1rem  / line-height 1.6
```

**Regras**
- Exatamente **um `h1` por página** — é o título do assunto, não o logo
- Níveis não pulam: `h2` → `h4` quebra semântica, leitor de tela e SEO
- Linha de texto entre 45 e 75 caracteres. Com `container` de 1200px e fonte de 16px,
  um parágrafo em largura total passa de 140 caracteres — **texto corrido precisa de
  `max-width` próprio (60–70ch)**, não da largura do container
- `2.5rem` fixo em mobile é grande demais: reduzir `h1` para ~1,75rem abaixo de 768px

---

## Espaçamento

Escala: **4 · 8 · 16 · 24 · 32 · 48 · 64px**. Valor fora da escala (`padding: 37px`)
é bug, não escolha.

- `.container`: `max-width 1200px`, padding lateral 20px
- `section`: `padding: 60px 0` — 🟡 60 está fora da escala; ao refatorar, mover para 64px
- `.siteMain`: `padding-top: 76px` compensa o header fixo. **Se a altura do header
  mudar, este valor muda junto** — são acoplados e é fonte conhecida de sobreposição

Regra de proximidade: o espaço *dentro* de um bloco deve ser menor que o espaço
*entre* blocos. Título colado no parágrafo seguinte e distante do anterior.

---

## Responsividade

Breakpoints usados no projeto: **768px** (tablet) e **480px** (mobile pequeno).

**Mobile não é opcional.** O site já teve regressão de layout em telas pequenas
(commit `d72011f`, Áreas de Atuação sobrepondo no mobile). Toda mudança visual é
testada em **375px** antes de aprovar.

- Nunca largura fixa em px em elemento de conteúdo — usar `max-width` + `width: 100%`
- Grid colapsa para uma coluna abaixo de 768px
- Alvo de toque mínimo **44×44px** — link de 20px de altura no menu mobile é falha real
- `html, body { overflow-x: hidden }` já existe em `globals.css`: isso **esconde**
  estouro horizontal, não corrige. Se aparecer scroll lateral, achar o elemento que
  estoura em vez de confiar no `overflow-x`

---

## Imagens — o ponto mais frágil do site

`next.config.js` tem `images: { unoptimized: true }`. Isso significa que
**`next/image` não redimensiona nem converte nada**: a imagem vai ao navegador no
tamanho original. Uma foto de catálogo de 4000px e 6MB é baixada inteira pelo
visitante, inclusive no celular.

Regras:
- Comprimir **antes** de commitar. O projeto tem `sharp` e `scripts/compress-areas-images.js`
- Largura máxima útil: 1600px para hero, 800px para card, 400px para thumb
- Formato: WebP quando possível (`formats` já lista avif/webp, mas sem otimização
  automática é preciso gerar o arquivo já convertido)
- `alt` descritivo e **traduzido** via `useTranslations` — `alt="imagem"` não serve
- `loading="lazy"` em tudo abaixo da dobra; hero com `priority`

Caminhos passam por `cdnUrl()` de `lib/assets.ts` — bucket S3 em us-east-2.

---

## Padrões de componente já existentes

Antes de criar card, grid ou botão novo, reutilizar:

| Padrão | Onde está |
|---|---|
| Grid de cards com imagem | `components/AreasAtuacao.tsx` |
| Listagem com destaque | `components/ProjetosRecentes.tsx` |
| Galeria / lightbox | `components/ImageGallery.tsx` |
| Carrossel de topo | `components/HeroCarousel.tsx` |
| CTA de contato | `components/ContactButton.tsx` |
| Seletor de idioma | `components/LanguageSwitcher.tsx` |

Quarta variante de card é dívida de design, não flexibilidade.

---

## Fluxo Figma → código

1. Link do Figma → `get_variable_defs` extrai tokens do frame
2. `get_design_context` traz estrutura e propriedades
3. `get_screenshot` serve de referência para conferir o resultado
4. **Mapear os tokens do Figma para as variáveis de `globals.css`.** Cor nova entra
   como variável com nome semântico; hex literal espalhado em `.module.css` é o que
   destrói sistema de design
5. Validar no localhost em 375px e 1280px antes de considerar pronto

Sem Figma, o fluxo é o mesmo a partir de `globals.css`.

---

## Checklist de revisão visual

```
[ ] um h1 por página, níveis sem pular
[ ] espaçamentos na escala 4/8/16/24/32/48/64
[ ] contraste AA: 4.5:1 corpo, 3:1 texto grande
[ ] --accent-color em no máximo um elemento por tela
[ ] texto corrido com max-width (60–70ch), não largura total
[ ] grid colapsa em uma coluna abaixo de 768px
[ ] testado em 375px sem scroll horizontal e sem sobreposição
[ ] alvo de toque ≥44px
[ ] alt descritivo e traduzido em toda imagem
[ ] imagem comprimida antes do commit (unoptimized: true)
[ ] foco de teclado visível
[ ] console sem erro nas três rotas (/pt /en /es)
```

---

<!-- Novos padrões e decisões visuais acima desta linha -->
