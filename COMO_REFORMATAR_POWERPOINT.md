# Como Reformatar PowerPoint

Este guia explica como usar o script para extrair conteúdo de um PowerPoint e criar uma nova apresentação com design moderno.

## Instalação

1. Certifique-se de ter Python instalado (3.7 ou superior)

2. Instale as dependências:
```bash
pip install -r scripts/requirements_pptx.txt
```

Ou instale diretamente:
```bash
pip install python-pptx Pillow
```

## Uso

### Básico
```bash
python scripts/reformat_pptx.py caminho/para/apresentacao.pptx
```

Isso criará um arquivo `apresentacao_reformatado.pptx` na mesma pasta.

### Especificar arquivo de saída
```bash
python scripts/reformat_pptx.py apresentacao.pptx nova_apresentacao.pptx
```

## O que o script faz

1. **Extrai conteúdo** de cada slide:
   - Títulos
   - Textos
   - Imagens
   - Formas e elementos

2. **Cria nova apresentação** com:
   - Design moderno e limpo
   - Cores da identidade Zilmer (tons de azul: #003366 e #0066cc)
   - Tipografia melhorada
   - Layouts organizados
   - Barra lateral colorida nos slides de conteúdo

3. **Preserva informações**:
   - Todo o texto é mantido
   - Imagens são preservadas
   - Estrutura de conteúdo é respeitada

## Customização

Você pode editar o arquivo `scripts/reformat_pptx.py` para:

- **Alterar cores**: Modifique o dicionário `COLORS` no início do arquivo
- **Ajustar layouts**: Modifique a função `create_modern_slide()`
- **Adicionar elementos**: Inclua novos elementos visuais nos slides
- **Remover elementos**: Filtre conteúdo que não deseja incluir

## Exemplo de cores personalizadas

```python
COLORS = {
    'primary': RGBColor(0, 51, 102),      # Azul escuro (#003366)
    'secondary': RGBColor(0, 102, 204),   # Azul médio (#0066cc)
    'accent': RGBColor(0, 51, 102),       # Azul escuro (accent)
    # ... adicione mais cores conforme necessário
}
```

## Notas

- O script preserva todo o conteúdo textual
- Imagens são mantidas na nova apresentação
- O design é completamente reformatado
- Você pode editar manualmente o PowerPoint gerado para ajustes finos

