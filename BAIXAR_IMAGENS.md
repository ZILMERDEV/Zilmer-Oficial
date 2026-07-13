# 🚀 Como Baixar Imagens Automaticamente

## Método Super Rápido (3 passos):

### Passo 1: Encontre as URLs das Imagens

1. Abra: https://zilmertransformado.wixsite.com/zilmer/produtos
2. Navegue até "Transformadores para Instrumentos"
3. **Pressione F12** (abre DevTools)
4. Vá na aba **"Network"** (Rede)
5. Clique no filtro **"Img"** (apenas imagens)
6. **Recarregue a página** (F5)
7. Você verá todas as imagens na lista!

### Passo 2: Copie as URLs

1. Clique em cada imagem na lista do Network
2. Copie a URL completa (geralmente começa com `static.wixstatic.com`)
3. Anote qual é qual (TP interno, TP externo, etc.)

### Passo 3: Cole no Script

1. Abra o arquivo: `scripts/download-images.js`
2. Substitua o array vazio com as URLs:

```javascript
const imagesToDownload = [
  { url: 'COLE_A_URL_AQUI_TP_INTERNO', filename: 'tp-interno.jpg' },
  { url: 'COLE_A_URL_AQUI_TP_EXTERNO', filename: 'tp-externo.jpg' },
  { url: 'COLE_A_URL_AQUI_TC_INTERNO', filename: 'tc-interno.jpg' },
  { url: 'COLE_A_URL_AQUI_TC_EXTERNO', filename: 'tc-externo.jpg' },
];
```

3. Execute:
```bash
node scripts/download-images.js
```

**Pronto! As imagens serão baixadas automaticamente!** 🎉

---

## ⚡ AINDA MAIS RÁPIDO: Me envie as URLs!

Se você quiser, me envie as 4 URLs das imagens que você encontrou e eu:
1. ✅ Atualizo o script
2. ✅ Executo o download
3. ✅ Configure tudo automaticamente

Só colar as URLs aqui na conversa! 😊

---

## 📋 Exemplo de URL que você vai encontrar:

```
https://static.wixstatic.com/media/xxxxx-xxxxx-xxxxx.jpg/v1/fill/w_xxx,h_xxx,al_c,q_85,usm_0.66_1.00_0.01/xxxxx.jpg
```

ou

```
https://images-wixmp-xxx.xxx.xxx/media/xxxxx/xxxxx.jpg
```


































