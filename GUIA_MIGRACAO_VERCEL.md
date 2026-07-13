# Guia de Migração: AWS → Vercel (com Cloudflare)

Este guia explica como migrar o domínio **zilmer.com.br** da AWS para Vercel, mantendo a proteção do Cloudflare.

## 📋 Pré-requisitos

- Conta no Vercel (crie em https://vercel.com se não tiver)
- Acesso ao painel do Cloudflare
- Acesso ao registrador do domínio (onde o domínio está registrado)
- Projeto Next.js pronto para deploy

## 🚀 Passo 1: Preparar o Projeto para Vercel

### 1.1 Instalar Vercel CLI (opcional, mas recomendado)
```bash
npm i -g vercel
```

### 1.2 Verificar configurações do Next.js
O projeto já está configurado corretamente para Vercel. O `next.config.js` está adequado.

## 🌐 Passo 2: Fazer o Deploy no Vercel

### Opção A: Via Dashboard do Vercel (Recomendado)

1. Acesse https://vercel.com e faça login
2. Clique em **"Add New Project"**
3. Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
   - Se o projeto não estiver em um repositório, você pode fazer upload manual
4. Configure o projeto:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão do Next.js)
   - **Install Command**: `npm install`
5. Clique em **"Deploy"**

### Opção B: Via CLI

```bash
# No diretório do projeto
vercel login
vercel
```

Siga as instruções interativas.

## 🔧 Passo 3: Configurar o Domínio no Vercel

Após o deploy inicial:

1. No dashboard do Vercel, vá para o seu projeto
2. Vá em **Settings** → **Domains**
3. Adicione o domínio: `zilmer.com.br`
4. Adicione também: `www.zilmer.com.br` (se desejar suporte ao www)
5. O Vercel mostrará os registros DNS necessários

**Anote os valores que o Vercel fornecer:**
- Tipo de registro: `CNAME` ou `A`
- Nome/Host: `@` ou `www`
- Valor/Destination: algo como `cname.vercel-dns.com` ou um IP

## ☁️ Passo 4: Configurar DNS no Cloudflare

### 4.1 Acessar o Cloudflare

1. Acesse https://dash.cloudflare.com
2. Selecione o domínio **zilmer.com.br**

### 4.2 Atualizar os Registros DNS

**IMPORTANTE:** Antes de fazer mudanças, anote os registros DNS atuais (faça um backup).

#### Para domínio raiz (zilmer.com.br):

1. Vá em **DNS** → **Records**
2. Localize o registro atual que aponta para a AWS
3. Edite ou crie um registro:
   - **Type**: `CNAME` (recomendado) ou `A`
   - **Name**: `@` (ou deixe em branco para domínio raiz)
   - **Target**: O valor fornecido pelo Vercel (ex: `cname.vercel-dns.com`)
   - **Proxy status**: 🟠 **Proxied** (laranja) - IMPORTANTE para manter proteção Cloudflare
   - **TTL**: Auto

#### Para www.zilmer.com.br:

1. Crie ou edite um registro:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: O valor fornecido pelo Vercel
   - **Proxy status**: 🟠 **Proxied**
   - **TTL**: Auto

### 4.3 Verificar Configurações SSL/TLS

1. Vá em **SSL/TLS** → **Overview**
2. Certifique-se de que está em **Full (strict)** ou **Full**
   - **Full (strict)**: Recomendado - valida certificado do Vercel
   - **Full**: Aceita certificado mesmo se não for totalmente validado

### 4.4 Configurações Adicionais Recomendadas

1. **SSL/TLS** → **Edge Certificates**:
   - ✅ Always Use HTTPS: **On**
   - ✅ Automatic HTTPS Rewrites: **On**
   - ✅ Minimum TLS Version: **1.2** (ou superior)

2. **Speed** → **Optimization**:
   - Mantenha as otimizações ativas (Auto Minify, Brotli, etc.)

3. **Caching**:
   - Configure regras de cache conforme necessário

## ⏱️ Passo 5: Aguardar Propagação DNS

1. **TTL e Propagação**: 
   - Com Cloudflare Proxied, a propagação geralmente é rápida (minutos)
   - Pode levar até 24-48 horas em casos raros
   - Verifique com: https://dnschecker.org

2. **Verificar no Vercel**:
   - No dashboard do Vercel, o domínio aparecerá como "Valid" quando estiver configurado corretamente
   - Pode levar alguns minutos após atualizar o DNS

## ✅ Passo 6: Verificar e Testar

1. **Teste o domínio**:
   ```bash
   # Verificar DNS
   nslookup zilmer.com.br
   
   # Ou use ferramentas online
   # https://dnschecker.org
   ```

2. **Teste o site**:
   - Acesse https://zilmer.com.br
   - Verifique se carrega corretamente
   - Teste https://www.zilmer.com.br (se configurado)

3. **Verificar SSL**:
   - Certifique-se de que o site carrega com HTTPS
   - Verifique o certificado no navegador

## 🔄 Passo 7: Desativar Recursos da AWS (Após Confirmação)

**⚠️ IMPORTANTE:** Só faça isso DEPOIS de confirmar que o site está funcionando no Vercel!

1. No painel da AWS:
   - Pare ou desative instâncias EC2 (se aplicável)
   - Remova distribuições CloudFront (se aplicável)
   - Desative outros serviços relacionados
   - **Mantenha os recursos por alguns dias** para garantir que tudo está funcionando

2. **Economia**: Após confirmar que tudo está funcionando, você pode cancelar serviços AWS não utilizados

## 🛠️ Passo 8: Configurações Adicionais no Vercel

### 8.1 Variáveis de Ambiente

Se o projeto usa variáveis de ambiente:

1. Vá em **Settings** → **Environment Variables**
2. Adicione todas as variáveis necessárias
3. Configure para Production, Preview e Development conforme necessário

### 8.2 Domínios Customizados

1. **Settings** → **Domains**
2. Verifique se ambos os domínios estão configurados:
   - `zilmer.com.br`
   - `www.zilmer.com.br` (opcional)

### 8.3 Configurações de Build

1. **Settings** → **General**
2. Verifique:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (ou deixe vazio para Next.js detectar automaticamente)
   - **Install Command**: `npm install`

## 📝 Checklist Final

- [ ] Projeto deployado no Vercel
- [ ] Domínio adicionado no Vercel
- [ ] Registros DNS atualizados no Cloudflare (com Proxy ativado)
- [ ] SSL/TLS configurado no Cloudflare (Full ou Full strict)
- [ ] Site acessível via https://zilmer.com.br
- [ ] Site acessível via https://www.zilmer.com.br (se configurado)
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Testes de funcionalidade realizados
- [ ] Recursos AWS desativados (após confirmação)

## 🆘 Troubleshooting

### Domínio não está funcionando

1. **Verifique DNS**:
   - Use https://dnschecker.org para verificar propagação global
   - Confirme que os registros estão corretos no Cloudflare

2. **Verifique no Vercel**:
   - Dashboard → Domains → Verifique status do domínio
   - Pode mostrar erros específicos

3. **Verifique SSL**:
   - Cloudflare SSL/TLS deve estar em "Full" ou "Full (strict)"
   - Vercel fornece certificado SSL automaticamente

### Erro 502 ou 503

- Pode indicar problema de configuração SSL entre Cloudflare e Vercel
- Verifique se SSL/TLS está em "Full" ou "Full (strict)"
- Aguarde alguns minutos para propagação

### Site não atualiza

- Limpe cache do Cloudflare: **Caching** → **Configuration** → **Purge Everything**
- Limpe cache do navegador
- Aguarde alguns minutos

## 📚 Recursos Úteis

- [Documentação Vercel - Domínios](https://vercel.com/docs/concepts/projects/domains)
- [Documentação Cloudflare - DNS](https://developers.cloudflare.com/dns/)
- [Vercel + Cloudflare Guide](https://vercel.com/docs/concepts/projects/domains/cloudflare-dns)

## 💡 Dicas Importantes

1. **Mantenha Cloudflare Proxied**: Isso mantém a proteção DDoS e otimizações
2. **SSL Full (strict)**: Melhor segurança, valida certificado do Vercel
3. **Backup DNS**: Sempre anote configurações antigas antes de mudar
4. **Teste antes de desativar AWS**: Confirme que tudo funciona antes de cancelar serviços
5. **Monitoramento**: Use ferramentas do Vercel para monitorar performance

---

**Última atualização**: Criado para migração AWS → Vercel com Cloudflare

