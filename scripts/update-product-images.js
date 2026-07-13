const fs = require('fs');
const path = require('path');

// Mapeamento de pastas para slugs de produtos
const folderToSlugMap = {
  'seco': {
    'media-tensao': 'media-tensao',
    'baixa-tensao': 'baixa-tensao',
    'aterramento': 'aterramento',
    'retificadores': 'para-retificadores',
  },
  'oleo': {
    'de-partida': 'de-partida',
    'de-aterramento': 'de-aterramento',
    'reatores': 'reatores',
    'autotransformadores': 'autotransformadores',
    'para-retificadores': 'para-retificadores',
    'para-fornos': 'para-fornos',
    'transformadores-auxiliares': 'transformadores-auxiliares',
  }
};

// Mapeamento para transformadores-de-forca
const forcaCategoryMap = {
  '30-a-300-kv': '30-300',
  '300-a-3000-kv': '300-3000',
  '3mva-a-20mva': '3-20',
};

// Extensões de imagem permitidas
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Ordem personalizada para produtos específicos (slug: [array de nomes de arquivos])
const customImageOrder = {
  'media-tensao': [
    'TAM - SABESP - 500 kVA.png',
    'TAM - AMC - 1000 kVA SEM CAIXA - vista PERSPECTIVA 1.png',
    'TAM - AMC - 1000 kVA SEM CAIXA - vista PERSPECTIVA 2.png',
    'TAM - AMC - 1000 kVA SEM CAIXA - vista DETALHE BARRAMENTO.png',
    'TAM - VOLGA - 2500 kVA CORTADO.png',
    'TAM - AMC - 1000 kVA COM CAIXA - vista FRONTAL.png',
    'TAM - AMC - 1000 kVA COM CAIXA - vista pespectiva.png',
    'TAM - ÍCONE TECNOLOGIA - 500 kVA.png',
    'TAM - AMC - 1000 kVA COM CAIXA -  vista LATERAL ESQUERDA.png',
    'TAM - VOLGA - 2500 kVA TAMPADO.png',
  ]
};

/**
 * Escaneia uma pasta e retorna todos os arquivos de imagem
 */
function scanImageFolder(folderPath, productSlug = null) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  const images = [];

  for (const file of files) {
    if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (imageExtensions.includes(ext)) {
        images.push(file.name);
      }
    }
  }

  // Se houver ordem personalizada para este produto, usa ela
  if (productSlug && customImageOrder[productSlug]) {
    const customOrder = customImageOrder[productSlug];
    const orderedImages = [];
    const unorderedImages = [];

    // Primeiro, adiciona as imagens na ordem personalizada
    for (const orderedName of customOrder) {
      if (images.includes(orderedName)) {
        orderedImages.push(orderedName);
      }
    }

    // Depois, adiciona as imagens que não estão na ordem personalizada (novas imagens)
    for (const image of images) {
      if (!customOrder.includes(image)) {
        unorderedImages.push(image);
      }
    }

    // Retorna ordem personalizada + novas imagens ordenadas alfabeticamente
    return [...orderedImages, ...unorderedImages.sort()];
  }

  // Ordena alfabeticamente para produtos sem ordem personalizada
  return images.sort();
}

/**
 * Gera o caminho completo da imagem
 */
function generateImagePath(basePath, subfolder, filename) {
  const parts = basePath.split('/').filter(p => p);
  if (subfolder) {
    parts.push(subfolder);
  }
  parts.push(filename);
  return '/' + parts.join('/');
}

/**
 * Atualiza o array de imagens em um produto específico no arquivo [slug]/page.tsx
 */
function updateProductImages(filePath, productSlug, images) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Encontra o bloco do produto
  const productRegex = new RegExp(
    `('${productSlug}'|"${productSlug}"):\\s*\\{([\\s\\S]*?)(images:\\s*\\[[\\s\\S]*?\\])([\\s\\S]*?)\\}`,
    'm'
  );

  const match = content.match(productRegex);
  if (!match) {
    console.log(`⚠ Produto não encontrado: ${productSlug}`);
    return false;
  }

  // Gera o novo array de imagens formatado
  const imagesArray = images.map(img => `      '${img}'`).join(',\n');
  const newImagesBlock = `images: [\n${imagesArray},\n    ]`;

  // Substitui o array de imagens
  content = content.replace(productRegex, (fullMatch, slug, before, oldImages, after) => {
    return `${slug}: {${before}${newImagesBlock}${after}}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Atualizado: ${productSlug} com ${images.length} imagens`);
  return true;
}

/**
 * Atualiza imagens na página de transformadores-de-forca
 */
function updateForcaImages(filePath, categoryId, images) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Encontra a categoria específica
  const categoryRegex = new RegExp(
    `(id:\\s*'${categoryId}'[\\s\\S]*?images:\\s*\\[)([\\s\\S]*?)(\\])`,
    'm'
  );

  const match = content.match(categoryRegex);
  if (!match) {
    console.log(`⚠ Categoria não encontrada: ${categoryId}`);
    return false;
  }

  // Gera o novo array de imagens formatado
  const imagesArray = images.map(img => `      '${img}'`).join(',\n');
  const newImagesBlock = `\n${imagesArray},\n    `;

  // Substitui o array de imagens
  content = content.replace(categoryRegex, (fullMatch, before, oldImages, closing) => {
    return `${before}${newImagesBlock}${closing}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Atualizado: categoria ${categoryId} com ${images.length} imagens`);
  return true;
}

/**
 * Processa produtos de transformadores a seco
 */
function processSecoProducts() {
  const basePath = path.join(__dirname, '../public/images/produtos/seco');
  const filePath = path.join(__dirname, '../app/produtos/transformadores-seco/[slug]/page.tsx');

  console.log('\n📁 Processando Transformadores a Seco...');

  for (const [folder, slug] of Object.entries(folderToSlugMap.seco)) {
    const folderPath = path.join(basePath, folder);
    const imageFiles = scanImageFolder(folderPath, slug);
    
    if (imageFiles.length > 0) {
      const images = imageFiles.map(filename => 
        generateImagePath('images/produtos/seco', folder, filename)
      );
      updateProductImages(filePath, slug, images);
    } else {
      console.log(`⚠ Pasta vazia ou não encontrada: ${folder}`);
    }
  }
}

/**
 * Processa produtos de transformadores imersos em óleo
 */
function processOleoProducts() {
  const basePath = path.join(__dirname, '../public/images/produtos/oleo');
  const filePath = path.join(__dirname, '../app/produtos/transformadores-oleo/[slug]/page.tsx');

  console.log('\n📁 Processando Transformadores Imersos em Óleo...');

  for (const [folder, slug] of Object.entries(folderToSlugMap.oleo)) {
    const folderPath = path.join(basePath, folder);
    const imageFiles = scanImageFolder(folderPath);
    
    if (imageFiles.length > 0) {
      const images = imageFiles.map(filename => 
        generateImagePath('images/produtos/oleo', folder, filename)
      );
      updateProductImages(filePath, slug, images);
    } else {
      console.log(`⚠ Pasta vazia ou não encontrada: ${folder}`);
    }
  }
}

/**
 * Processa transformadores de força (estrutura especial)
 */
function processForcaProducts() {
  const basePath = path.join(__dirname, '../public/images/produtos/oleo/transformadores-de-forca');
  const filePath = path.join(__dirname, '../app/produtos/transformadores-oleo/transformadores-de-forca/page.tsx');

  console.log('\n📁 Processando Transformadores de Força...');

  if (!fs.existsSync(basePath)) {
    console.log(`⚠ Pasta não encontrada: transformadores-de-forca`);
    return;
  }

  const subfolders = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const subfolder of subfolders) {
    if (forcaCategoryMap[subfolder]) {
      const categoryId = forcaCategoryMap[subfolder];
      const subfolderPath = path.join(basePath, subfolder);
      const imageFiles = scanImageFolder(subfolderPath);
      
      if (imageFiles.length > 0) {
        const images = imageFiles.map(filename => 
          generateImagePath('images/produtos/oleo/transformadores-de-forca', subfolder, filename)
        );
        updateForcaImages(filePath, categoryId, images);
      } else {
        console.log(`⚠ Pasta vazia: ${subfolder}`);
      }
    }
  }
}

/**
 * Atualiza as imagens dos cards de referência
 */
function updateCardImages() {
  const { execSync } = require('child_process');
  const updateCardImagesScript = path.join(__dirname, 'update-card-images.js');
  if (fs.existsSync(updateCardImagesScript)) {
    console.log('\n📸 Atualizando imagens nos cards de referência...');
    try {
      execSync(`node "${updateCardImagesScript}"`, { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠ Erro ao atualizar cards (continuando...):', error.message);
    }
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🚀 Iniciando atualização automática de imagens de produtos...\n');
  
  try {
    processSecoProducts();
    processOleoProducts();
    processForcaProducts();
    
    // Atualiza também as imagens nos cards
    updateCardImages();
    
    console.log('\n✅ Atualização concluída com sucesso!');
    console.log('💡 Execute "npm run dev" para ver as mudanças.');
  } catch (error) {
    console.error('\n❌ Erro durante a atualização:', error);
    process.exit(1);
  }
}

// Executa o script
main();
