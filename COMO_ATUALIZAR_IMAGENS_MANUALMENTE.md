# Como Atualizar Imagens Manualmente

## Quando o Script Automático Não Funciona

Se o script automático não atualizou todas as imagens corretamente, você pode atualizar manualmente seguindo estes passos:

## Passo a Passo

### 1. Identificar a Imagem Correta

Primeiro, identifique qual é a imagem sem sombra que você quer usar. Ela pode estar em:
- `public/images/areas/transporte/`
- `public/images/produtos/seco/retificadores/`
- `public/images/produtos/oleo/...`

### 2. Localizar Onde a Imagem é Usada

Procure no código onde a imagem antiga está sendo referenciada:

**Para páginas de produtos:**
- `app/produtos/transformadores-seco/[slug]/page.tsx`
- `app/produtos/transformadores-oleo/[slug]/page.tsx`
- `app/produtos/transformadores-instrumentos/[slug]/page.tsx`

**Para áreas de aplicação:**
- `app/areas/[slug]/page.tsx`

### 3. Atualizar o Caminho da Imagem

Encontre a linha que contém o caminho da imagem antiga e substitua pelo novo caminho.

**Exemplo - Página de Produtos:**

```typescript
'para-retificadores': {
  title: 'TRANSFORMADORES A SECO PARA RETIFICADORES...',
  images: [
    '/images/produtos/seco/retificadores/TAM - SIEMENS - 4700 kVA v1.png', // ← Caminho da imagem
  ],
},
```

**Exemplo - Área de Aplicação:**

```typescript
transporte: {
  aplicacao: {
    image: '/images/areas/transporte/TAM - SIEMENS - 4700 kVA.png', // ← Caminho da imagem
  },
},
```

### 4. Copiar a Imagem para o Local Correto

Se a imagem sem sombra está em outro lugar, você tem duas opções:

**Opção A: Copiar a imagem para a pasta correta**
- Copie a imagem sem sombra para a pasta onde ela é referenciada no código
- Mantenha o mesmo nome de arquivo que está no código

**Opção B: Atualizar o caminho no código**
- Atualize o caminho no código para apontar para onde a imagem sem sombra está localizada

### 5. Verificar se Funcionou

Após fazer as alterações:
1. Salve o arquivo
2. Recarregue a página no navegador
3. Verifique se a imagem aparece sem sombra

## Exemplo Prático: Transporte e Para Retificadores

**Situação:** A mesma imagem aparece em dois lugares, mas uma tem sombra e outra não.

**Solução:**

1. **Identificar a imagem correta (sem sombra):**
   - Está em: `public/images/areas/transporte/TAM - SIEMENS - 4700 kVA.png`

2. **Localizar onde a imagem com sombra está sendo usada:**
   - Arquivo: `app/produtos/transformadores-seco/[slug]/page.tsx`
   - Linha: `'/images/produtos/seco/retificadores/TAM - SIEMENS - 4700 kVA v1.png'`

3. **Copiar a imagem sem sombra:**
   ```powershell
   Copy-Item "public\images\areas\transporte\TAM - SIEMENS - 4700 kVA.png" "public\images\produtos\seco\retificadores\TAM - SIEMENS - 4700 kVA v1.png" -Force
   ```

4. **Ou atualizar o caminho no código:**
   - Mude de: `'/images/produtos/seco/retificadores/TAM - SIEMENS - 4700 kVA v1.png'`
   - Para: `'/images/areas/transporte/TAM - SIEMENS - 4700 kVA.png'`

## Dicas

- **Sempre faça backup** antes de substituir imagens
- **Mantenha os nomes consistentes** para facilitar a manutenção
- **Use o mesmo arquivo** em todos os lugares onde a mesma imagem aparece
- **Verifique a extensão** (.png, .jpg, .webp) - deve ser a mesma no código e no arquivo

## Estrutura de Pastas

```
public/images/
├── areas/
│   ├── transporte/
│   │   └── TAM - SIEMENS - 4700 kVA.png
│   └── ...
├── produtos/
│   ├── seco/
│   │   ├── retificadores/
│   │   │   └── TAM - SIEMENS - 4700 kVA v1.png
│   │   └── ...
│   └── oleo/
│       └── ...
```

## Comandos Úteis (PowerShell)

**Copiar uma imagem:**
```powershell
Copy-Item "caminho\origem\imagem.png" "caminho\destino\imagem.png" -Force
```

**Listar imagens em uma pasta:**
```powershell
Get-ChildItem "caminho\pasta" | Select-Object Name
```

**Verificar se um arquivo existe:**
```powershell
Test-Path "caminho\arquivo.png"
```













