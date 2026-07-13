# Como Atualizar Imagens Automaticamente

## 🚀 Método Mais Fácil (Windows)

1. **Navegue até a pasta do projeto** no Explorador de Arquivos:
   ```
   C:\Users\rocco.digiulio\Desktop\zilmer-site
   ```

2. **Clique duas vezes** em:
   - `update-images.bat` - Atualiza tudo (arrays + cards)
   - `update-cards.bat` - Atualiza apenas os cards

Pronto! O script será executado automaticamente.

---

## 📝 Método via CMD/PowerShell

1. **Abra o CMD ou PowerShell**

2. **Navegue até o diretório do projeto:**
   ```cmd
   cd C:\Users\rocco.digiulio\Desktop\zilmer-site
   ```

3. **Execute o comando:**
   ```bash
   npm run update-images
   ```

---

## ⚠️ Erro Comum

Se você receber o erro:
```
npm error enoent Could not read package.json
```

**Solução:** Você precisa estar no diretório correto do projeto antes de executar o comando.

Use:
```cmd
cd C:\Users\rocco.digiulio\Desktop\zilmer-site
```

Depois execute:
```bash
npm run update-images
```

---

## 📋 O que o script faz?

- ✅ Escaneia todas as pastas de imagens
- ✅ Atualiza automaticamente os arrays de imagens
- ✅ Atualiza a primeira imagem nos cards
- ✅ Preserva a ordem personalizada de Média Tensão
- ✅ Mantém títulos e descrições intactos

---

## 📁 Onde adicionar imagens?

- `public/images/produtos/seco/[nome-do-produto]/`
- `public/images/produtos/oleo/[nome-do-produto]/`
- `public/images/produtos/oleo/transformadores-de-forca/[categoria]/`

Depois de adicionar, execute `update-images.bat` ou `npm run update-images`!

















