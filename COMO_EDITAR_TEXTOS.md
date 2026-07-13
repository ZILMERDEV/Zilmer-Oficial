# Como Editar Textos no Site

Agora você pode editar os textos das páginas de áreas diretamente pelo navegador, sem precisar editar código!

## Acessando o Editor

1. Abra o site no navegador (geralmente em `http://localhost:3000`)
2. Acesse a página administrativa: `/admin`
   - URL completa: `http://localhost:3000/admin`

## Como Usar

### 1. Selecione a Área
- No menu lateral esquerdo, clique na área que deseja editar:
  - Transporte
  - Hidrelétrica
  - Mineração
  - Subestações
  - Energias Renováveis
  - Controle e Medição

### 2. Selecione o Campo
- Após selecionar a área, escolha qual campo você quer editar:
  - **Descrição da Aplicação**: O texto principal que aparece na seção de aplicação (ao lado da imagem)
  - **Título da Aplicação**: O título da seção de aplicação
  - **Descrição do Hero**: O texto que aparece no banner superior da página
  - **O Problema**: Texto da seção "Solução"
  - **Como Melhora**: Texto da seção "Solução"
  - **Por que é Essencial**: Texto da seção "Solução"

### 3. Edite o Texto com Formatação
O editor agora possui todas as funcionalidades de um editor de texto rico, similar ao Word:

#### Formatação de Texto:
- **Negrito** (B): Destaque textos importantes
- **Itálico** (I): Enfatize palavras ou frases
- **Sublinhado** (U): Destaque informações
- **Riscado** (S): Mostre textos removidos ou alternativos

#### Formatação de Parágrafos:
- **Títulos**: Use H1, H2 ou H3 para criar títulos e subtítulos
- **Listas**: Crie listas ordenadas (numeradas) ou com marcadores (bullets)
- **Alinhamento**: Alinhe o texto à esquerda, centro ou direita

#### Outras Funcionalidades:
- **Links**: Adicione links clicáveis para outras páginas
- **Cores**: Mude a cor do texto ou do fundo
- **Limpar Formatação**: Remova toda a formatação de um texto selecionado

### 4. Salve as Alterações
- Clique no botão **"Salvar Alterações"**
- Aguarde a mensagem de sucesso
- As alterações são salvas imediatamente no arquivo `data/areas.json`

### 5. Visualize as Mudanças
- Clique no botão **"Ver Página"** para abrir a página da área em uma nova aba
- Recarregue a página para ver as alterações (pode ser necessário fazer um hard refresh: Ctrl+F5)

## Importante

- **Backup**: O arquivo `data/areas.json` é editado diretamente. Recomenda-se fazer backup antes de edições importantes.
- **Formatação**: O texto é salvo como está. Use quebras de linha (Enter) para parágrafos.
- **Atualização**: Após salvar, pode ser necessário recarregar a página para ver as mudanças.
- **Erros**: Se algo der errado, você pode editar manualmente o arquivo `data/areas.json` na pasta `data/`.

## Campos Editáveis

### Seção Aplicação
- **Título**: Título principal da seção
- **Descrição**: Texto longo que aparece ao lado da imagem (campo mais usado)

### Seção Hero (Banner Superior)
- **Descrição do Hero**: Texto que aparece abaixo do título no banner

### Seção Solução
- **O Problema**: Primeiro card da seção
- **Como Melhora**: Segundo card da seção
- **Por que é Essencial**: Terceiro card da seção

## Dicas

- Use textos claros e objetivos
- Mantenha a formatação consistente entre as áreas
- Teste sempre visualizando a página após salvar
- Use **negrito** para destacar informações importantes
- Use *itálico* para enfatizar termos técnicos
- Crie listas para organizar informações
- Use títulos (H1, H2, H3) para estruturar o conteúdo
- Adicione links quando necessário para referências externas

## Solução de Problemas

### O texto não aparece atualizado
- Faça um hard refresh (Ctrl+F5 ou Cmd+Shift+R)
- Verifique se salvou corretamente (deve aparecer mensagem de sucesso)

### Erro ao salvar
- Verifique se o servidor está rodando
- Verifique se tem permissão para escrever no arquivo `data/areas.json`
- Tente novamente

### Não consigo acessar /admin
- Certifique-se de que o servidor está rodando (`npm run dev`)
- Verifique se a URL está correta: `http://localhost:3000/admin`

