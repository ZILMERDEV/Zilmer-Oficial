# 🖼️ Como Editar Imagens dos Produtos no Admin

## 📍 Localização

Acesse: `/admin/produtos`

## 🎯 Passo a Passo

### 1. Selecione a Categoria
- Clique em uma categoria:
  - **Transformadores em Óleo**
  - **Transformadores a Seco**
  - **Transformadores de Instrumentos**

### 2. Selecione a Seção "🖼️ Imagens dos Produtos"
- Após selecionar a categoria, você verá várias seções
- Clique em **"🖼️ Imagens dos Produtos"**

### 3. Selecione o Produto
- Você verá uma lista de produtos com seus nomes
- Exemplo: `para-retificadores - Imagem do Card`
- Clique no produto que deseja editar

### 4. Visualize e Edite
- **Preview da Imagem Atual**: Você verá a imagem atual (se existir)
- **Campo de Edição**: Digite o caminho completo da nova imagem
- Formato: `/images/produtos/[categoria]/[pasta]/[nome-do-arquivo].png`

### 5. Salve
- Clique em **"Salvar Alterações"**
- Você verá: "Texto salvo com sucesso!"

### 6. Veja o Resultado
- Clique em **"Ver Página"** para ver a imagem atualizada no site

---

## 📝 Exemplos de Caminhos

### Transformadores em Óleo:
```
/images/produtos/oleo/para-retificadores/TCO - GE POWER - 12500 kVA.png
/images/produtos/oleo/para-fornos/TCO - 3300 kVA.png
/images/produtos/oleo/de-partida/APO - SISNERGY - 1350 CV SEM TAMPA.png
/images/produtos/oleo/de-aterramento/RAO - HITACHI - 2572 kVA.png
/images/produtos/oleo/reatores/RAO - VILLARES METALS - 1350 kVA.png
```

### Transformadores a Seco:
```
/images/produtos/seco/retificadores/TAM - SIEMENS - 4700 kVA v1.png
/images/produtos/seco/aterramento/TAM - ÍCONE TECNOLOGIA - 500 kVA.png
/images/produtos/seco/baixa-tensao/TAI - PETROBRAS - 30 kVA SEM TAMPA.png
/images/produtos/seco/reatores-de-partida/RPM - 1700 HP.png
```

---

## 💡 Dicas

- **Sempre comece com `/images/`** - esse é o caminho base
- **Use o preview** para verificar se a imagem está correta antes de salvar
- **Se a imagem não aparecer no preview**, verifique se o caminho está correto
- **As imagens devem estar na pasta `public/images/`** do projeto

---

## 🔍 Verificar Imagem Atual

1. Selecione o produto no admin
2. Veja o preview da imagem atual
3. O caminho completo aparece abaixo do preview
4. Use esse caminho como referência para outras imagens similares

---

## ⚠️ Importante

- Certifique-se de que a imagem existe na pasta `public/images/` antes de salvar
- O caminho deve ser exato (case-sensitive em alguns sistemas)
- Se a imagem não aparecer após salvar, verifique:
  1. O caminho está correto?
  2. A imagem existe na pasta?
  3. O nome do arquivo está correto (incluindo extensão .png, .jpg, etc.)?











