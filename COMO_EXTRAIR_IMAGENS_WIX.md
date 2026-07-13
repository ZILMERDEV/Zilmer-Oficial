# 📸 Como Extrair Imagens do Site Wix

## 🎯 Objetivo
Extrair as 4 imagens de transformadores para instrumentos do site antigo e adicionar ao novo site.

---

## 📋 Passo a Passo Detalhado

### Passo 1: Abrir o Site Antigo
1. Abra seu navegador (Chrome, Firefox ou Edge)
2. Acesse: https://zilmertransformado.wixsite.com/zilmer/transformadores-para-instrumentos

### Passo 2: Abrir Ferramentas de Desenvolvedor
1. Pressione **F12** no teclado
   - Ou clique com botão direito na página > "Inspecionar"
   - Ou use: `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)

### Passo 3: Configurar a Aba Network
1. Clique na aba **"Network"** (Rede) nas ferramentas de desenvolvedor
2. No campo de filtro, digite **"Img"** ou selecione o filtro de imagens
3. Isso mostrará apenas as requisições de imagens

### Passo 4: Recarregar a Página
1. Pressione **F5** ou clique no botão de recarregar
2. A página será recarregada e você verá todas as imagens sendo carregadas na lista

### Passo 5: Encontrar as Imagens dos Transformadores
Procure na lista pelas 4 imagens dos transformadores:
- **Transformador de Potencial - Uso Interno** (TP Interno)
- **Transformador de Potencial - Uso Externo** (TP Externo)
- **Transformador de Corrente - Uso Interno** (TC Interno)
- **Transformador de Corrente - Uso Externo** (TC Externo)

### Passo 6: Copiar as URLs
1. Clique em cada imagem na lista do Network
2. No painel direito, você verá os detalhes da requisição
3. Procure pelo campo **"Request URL"** ou **"URL"**
4. Copie a URL completa (geralmente começa com `https://static.wixstatic.com/media/...`)

### Passo 7: Adicionar URLs no Script
1. Abra o arquivo: `scripts/get-wix-images.js`
2. Encontre o array `imagesToDownload`
3. Adicione as URLs no formato:
```javascript
const imagesToDownload = [
  { url: 'COLE_A_URL_AQUI_TP_INTERNO', filename: 'tp-interno.png' },
  { url: 'COLE_A_URL_AQUI_TP_EXTERNO', filename: 'tp-externo.png' },
  { url: 'COLE_A_URL_AQUI_TC_INTERNO', filename: 'tc-interno.png' },
  { url: 'COLE_A_URL_AQUI_TC_EXTERNO', filename: 'tc-externo.png' },
];
```

### Passo 8: Executar o Script
1. Abra o terminal na pasta do projeto
2. Execute:
```bash
node scripts/get-wix-images.js
```

### Passo 9: Verificar
As imagens serão salvas em: `public/images/produtos/instrumentos/`

---

## 💡 Dicas Importantes

### URLs do Wix
As URLs do Wix geralmente têm este formato:
```
https://static.wixstatic.com/media/xxxxx-xxxxx-xxxxx.jpg/v1/fill/w_xxx,h_xxx,al_c,q_85/xxxxx.jpg
```

### Limpar URLs (Opcional)
Se a URL tiver muitos parâmetros, você pode tentar usar apenas a parte base:
```
https://static.wixstatic.com/media/xxxxx-xxxxx-xxxxx.jpg
```

### Formato dos Arquivos
- Use `.png` para logos/imagens com transparência
- Use `.jpg` para fotografias
- O script tentará detectar automaticamente

---

## 🆘 Problemas Comuns

### "Erro 403" ou "Acesso Negado"
- Algumas URLs do Wix podem ter proteção
- Tente copiar a URL completa com todos os parâmetros
- Ou use a URL base sem parâmetros

### "Timeout"
- A conexão pode estar lenta
- Tente novamente ou verifique sua internet

### "Imagem não encontrada"
- Verifique se a URL está correta
- Certifique-se de copiar a URL completa
- Tente abrir a URL diretamente no navegador para verificar

---

## ✅ Após Baixar

Depois que as imagens forem baixadas:
1. Verifique se estão na pasta `public/images/produtos/instrumentos/`
2. As imagens já devem aparecer no site automaticamente
3. Recarregue a página: http://localhost:3000/produtos/transformadores-instrumentos

---

## 📞 Precisa de Ajuda?

Se tiver dificuldade para encontrar as URLs, você pode:
1. Me enviar as URLs que encontrou
2. Ou me dizer quais imagens não conseguiu encontrar
3. Eu posso ajudar a configurar o script


