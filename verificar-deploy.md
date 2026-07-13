# Checklist Rápido - Verificação Pré-Deploy

Use este checklist antes de fazer o deploy no Vercel:

## ✅ Verificações Técnicas

- [ ] `package.json` tem script `build` configurado
- [ ] `next.config.js` está configurado corretamente
- [ ] Não há erros de build local (`npm run build`)
- [ ] Projeto funciona localmente (`npm run dev`)
- [ ] Todas as dependências estão no `package.json`
- [ ] Arquivos sensíveis estão no `.gitignore`

## ✅ Verificações de Conteúdo

- [ ] Todas as imagens estão na pasta `public/images/`
- [ ] PDFs estão na pasta `public/`
- [ ] Dados JSON estão atualizados (`data/*.json`)
- [ ] Traduções estão completas (`messages/*.json`)

## ✅ Verificações de Domínio

- [ ] Você tem acesso ao painel do Cloudflare
- [ ] Você tem acesso ao registrador do domínio
- [ ] Você tem conta no Vercel (ou vai criar)
- [ ] Anotou os registros DNS atuais (backup)

## 🚀 Próximos Passos

1. Siga o **GUIA_MIGRACAO_VERCEL.md** completo
2. Faça o deploy no Vercel
3. Configure o domínio
4. Atualize DNS no Cloudflare
5. Teste tudo antes de desativar AWS

