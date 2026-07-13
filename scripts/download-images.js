const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// URLs das imagens do site Wix (você precisa fornecer ou podemos fazer scraping)
const imagesToDownload = [
  // Exemplo - substitua pelas URLs reais que você encontrar
  // { url: 'https://static.wixstatic.com/media/xxxxx.jpg', filename: 'tp-interno.jpg' },
  // { url: 'https://static.wixstatic.com/media/xxxxx.jpg', filename: 'tp-externo.jpg' },
];

const downloadDir = path.join(__dirname, '../public/images/produtos/instrumentos');

// Criar pasta se não existir
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(downloadDir, filename);
    
    // Se já existe, pular
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} já existe, pulando...`);
      resolve();
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Download concluído: ${filename}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Seguir redirects
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Erro ${response.statusCode} ao baixar ${filename}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('🚀 Iniciando download de imagens...\n');
  
  if (imagesToDownload.length === 0) {
    console.log('⚠️  Nenhuma URL configurada!');
    console.log('\n📝 Como usar:');
    console.log('1. Abra o site: https://zilmertransformado.wixsite.com/zilmer');
    console.log('2. Pressione F12 (DevTools)');
    console.log('3. Vá em Network > Img');
    console.log('4. Recarregue a página');
    console.log('5. Encontre as URLs das imagens');
    console.log('6. Adicione as URLs no array imagesToDownload neste arquivo');
    return;
  }

  for (const image of imagesToDownload) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`✗ Erro ao baixar ${image.filename}:`, error.message);
    }
  }
  
  console.log('\n✅ Processo concluído!');
}

downloadAll();


































