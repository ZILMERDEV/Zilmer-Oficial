# Como Abrir o Terminal no Cursor

## Métodos para Abrir o Terminal:

### Método 1: Atalho de Teclado
- **Windows/Linux**: `Ctrl + `` (Ctrl + crase/backtick)
- **Mac**: `Cmd + `` (Command + crase/backtick)

### Método 2: Menu
1. Clique em **Terminal** no menu superior
2. Selecione **New Terminal** ou **Novo Terminal**

### Método 3: Paleta de Comandos
1. Pressione `Ctrl + Shift + P` (Windows/Linux) ou `Cmd + Shift + P` (Mac)
2. Digite "Terminal: Create New Terminal"
3. Pressione Enter

### Método 4: Painel Inferior
- Clique na aba **Terminal** na parte inferior da janela do Cursor
- Se não aparecer, use o método 1 ou 2

## Se o Terminal Não Aparecer:

1. **Verifique se está instalado**: O Cursor usa o terminal padrão do sistema
2. **Reinicie o Cursor**: Às vezes ajuda
3. **Verifique as configurações**: Vá em File > Preferences > Settings e procure por "terminal"

## Alternativa: Usar Terminal Externo

Se não conseguir abrir o terminal no Cursor, você pode usar:

### Windows:
- **PowerShell**: Pressione `Win + X` e escolha "Windows PowerShell"
- **CMD**: Pressione `Win + R`, digite `cmd` e pressione Enter
- **Terminal do Windows**: Pressione `Win + X` e escolha "Terminal"

### Depois, navegue até a pasta do projeto:
```bash
cd C:\Users\rocco.digiulio\Desktop\zilmer-site
```

### E execute os comandos:
```bash
npm run dev
```

## Comandos Úteis:

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia o servidor de produção (após build)












