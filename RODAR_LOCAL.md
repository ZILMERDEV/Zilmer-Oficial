# Ver o site completo no localhost

O projeto **está salvo** no branch `main` (commit 03541b4). Para ver todos os textos e páginas localmente:

## Passos (faça na ordem)

1. **Pare o servidor**  
   Se `npm run dev` estiver rodando, pressione **Ctrl+C** no terminal.

2. **Limpe o cache do Next.js**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **Inicie de novo**
   ```powershell
   npm run dev
   ```

4. **Abra no navegador**  
   **http://localhost:3000**  
   (O middleware redireciona para **http://localhost:3000/pt**.)

5. **Se ainda não aparecer tudo**  
   - Dê **Ctrl+F5** (ou Cmd+Shift+R no Mac) para recarregar sem cache.  
   - Confira se a URL é **/pt** ou **/en**, não só `/`.

## O que está no repositório (main)

- **Traduções:** `messages/pt.json` e `messages/en.json` com about, footer, contact, products, news, common.
- **Conteúdo das páginas:** `data/sobre.json`, `data/areas.json`, `data/produtos.json` (Histórico, Clientes, Certificados, áreas, produtos).
- **Páginas:** Home, Sobre, Histórico, Clientes, Certificados, Contato, Produtos, Áreas, Projetos, Admin.
- **Ajustes de deploy:** middleware next-intl, next.config para Vercel, links com locale.

Nada disso foi apagado; está no Git no branch `main`.

