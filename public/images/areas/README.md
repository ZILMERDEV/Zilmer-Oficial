# Pastas de Imagens por Área

Cada área tem sua própria pasta para organizar as imagens dos transformadores que aparecem na seção de aplicação.

## Estrutura de Pastas

```
public/images/areas/
├── transporte/
│   └── transformador.png (ou .jpg, .webp)
├── hidreletrica/
│   └── transformador.png
├── mineracao/
│   └── transformador.png
├── subestacoes/
│   └── transformador.png
├── energias-renovaveis/
│   └── transformador.png
└── controle-medicao/
    └── transformador.png
```

## Como Adicionar Imagens

1. **Transporte**: Coloque a imagem do transformador em `transporte/transformador.png`
2. **Hidrelétrica**: Coloque a imagem do transformador em `hidreletrica/transformador.png`
3. **Mineração**: Coloque a imagem do transformador em `mineracao/transformador.png`
4. **Subestações**: Coloque a imagem do transformador em `subestacoes/transformador.png`
5. **Energias Renováveis**: Coloque a imagem do transformador em `energias-renovaveis/transformador.png`
6. **Controle e Medição**: Coloque a imagem do transformador em `controle-medicao/transformador.png`

## Formatos Suportados

- PNG (.png)
- JPG/JPEG (.jpg, .jpeg)
- WEBP (.webp)

## Nota

As imagens devem ser nomeadas como `transformador.png` (ou com a extensão correspondente). Se quiser usar outro nome, edite o arquivo `app/areas/[slug]/page.tsx` e altere o caminho da imagem na seção `aplicacao.image` de cada área.













