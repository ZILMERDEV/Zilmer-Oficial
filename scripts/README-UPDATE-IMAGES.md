# Atualização Automática de Imagens de Produtos

Este script escaneia automaticamente as pastas de imagens de produtos e atualiza os arrays de imagens nos arquivos TypeScript correspondentes.

## Como Funciona

O script `update-product-images.js`:

1. **Escaneia as pastas** em `public/images/produtos/`
2. **Identifica automaticamente** todas as imagens (jpg, png, webp, gif)
3. **Ordena alfabeticamente** as imagens
4. **Atualiza os arrays** nos arquivos TypeScript correspondentes
5. **Preserva todo o conteúdo** existente (títulos, descrições, etc.)

## Como Usar

### ⚠️ IMPORTANTE: Execute o comando no diretório do projeto!

Certifique-se de estar no diretório correto antes de executar:
```bash
cd C:\Users\rocco.digiulio\Desktop\zilmer-site
```

### Opção 1: Usando scripts .bat (Windows - Mais fácil)

**Método mais simples no Windows:**

1. **Navegue até a pasta do projeto** no Explorador de Arquivos:
   ```
   C:\Users\rocco.digiulio\Desktop\zilmer-site
   ```

2. **Clique duas vezes** em um dos arquivos:
   - `update-images.bat` - Atualiza tudo (arrays + cards)
   - `update-cards.bat` - Atualiza apenas os cards

### Opção 2: Usando npm no CMD/PowerShell

**No CMD ou PowerShell:**

1. **Navegue até o diretório do projeto:**
   ```cmd
   cd C:\Users\rocco.digiulio\Desktop\zilmer-site
   ```

2. **Execute o comando:**
   ```bash
   npm run update-images
   ```

Este comando atualiza:
- ✅ Arrays de imagens nas páginas de detalhes dos produtos
- ✅ Primeira imagem nos cards de referência (páginas de listagem)

### Comandos individuais:

- **Atualizar apenas arrays de imagens:**
  ```bash
  npm run update-images
  ```

- **Atualizar apenas cards de referência:**
  ```bash
  npm run update-cards
  ```

### Após adicionar novas imagens:

1. Adicione as imagens na pasta correspondente:
   - `public/images/produtos/seco/[nome-do-produto]/`
   - `public/images/produtos/oleo/[nome-do-produto]/`
   - `public/images/produtos/oleo/transformadores-de-forca/[categoria]/`

2. Execute o script:
   
   **Windows (mais fácil):**
   - Clique duas vezes em `update-images.bat` na pasta do projeto
   
   **Ou via CMD/PowerShell:**
   ```bash
   cd C:\Users\rocco.digiulio\Desktop\zilmer-site
   npm run update-images
   ```
   
   Isso automaticamente:
   - Atualiza os arrays de imagens nas páginas de detalhes
   - Atualiza a primeira imagem nos cards de referência
   - Preserva a ordem personalizada de Média Tensão

3. Recarregue o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura de Pastas Suportada

### Transformadores a Seco:
- `media-tensao/` → slug: `media-tensao`
- `baixa-tensao/` → slug: `baixa-tensao`
- `aterramento/` → slug: `aterramento`
- `retificadores/` → slug: `para-retificadores`

### Transformadores Imersos em Óleo:
- `de-partida/` → slug: `de-partida`
- `de-aterramento/` → slug: `de-aterramento`
- `reatores/` → slug: `reatores`
- `autotransformadores/` → slug: `autotransformadores`
- `para-retificadores/` → slug: `para-retificadores`
- `para-fornos/` → slug: `para-fornos`
- `transformadores-auxiliares/` → slug: `transformadores-auxiliares`

### Transformadores de Força (estrutura especial):
- `transformadores-de-forca/30-a-300-kv/` → categoria: `30-300`
- `transformadores-de-forca/300-a-3000-kv/` → categoria: `300-3000`
- `transformadores-de-forca/3mva-a-20mva/` → categoria: `3-20`

## Exemplo

Se você adicionar uma nova imagem em:
```
public/images/produtos/seco/aterramento/NOVA_IMAGEM.png
```

Execute:
```bash
npm run update-images
```

O script automaticamente:
- Encontra a imagem
- Adiciona ao array do produto `aterramento`
- Atualiza o arquivo `app/produtos/transformadores-seco/[slug]/page.tsx`
- **Se for a primeira imagem do array**, atualiza também o card na página de listagem

## Notas Importantes

- ⚠️ O script **preserva** títulos e descrições existentes
- ⚠️ O script **ordena** as imagens alfabeticamente
- ⚠️ O script **não remove** imagens que não existem mais na pasta (você precisa removê-las manualmente do código se necessário)
- ✅ As legendas são geradas automaticamente do nome do arquivo pelo componente `ImageGallery`

## Integração Futura

Para automatizar completamente, você pode:
1. Adicionar o script ao processo de build
2. Criar um watch mode que executa automaticamente quando imagens são adicionadas
3. Integrar com um hook de git pre-commit

