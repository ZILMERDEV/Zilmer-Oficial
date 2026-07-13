const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// URL da página - pode ser alterado
const wixPageUrl = process.argv[2] || 'https://zilmertransformado.wixsite.com/zilmer/tp-internos';

const downloadDir = path.join(__dirname, '../public/images/produtos/instrumentos');

// Criar pasta se não existir
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractImageUrls(html) {
  const urls = [];
  
  // Procurar por URLs do Wix Static
  const wixStaticRegex = /https:\/\/static\.wixstatic\.com\/media\/[^"'\s)]+/g;
  const matches = html.match(wixStaticRegex);
  
  if (matches) {
    matches.forEach(url => {
      // Limpar URL
      let cleanUrl = url.split('"')[0].split("'")[0].split(')')[0];
      if (!urls.includes(cleanUrl)) {
        urls.push(cleanUrl);
      }
    });
  }
  
  // Procurar por URLs de imagens Wix MP
  const wixMpRegex = /https:\/\/images-wixmp-[^"'\s)]+/g;
  const mpMatches = html.match(wixMpRegex);
  
  if (mpMatches) {
    mpMatches.forEach(url => {
      let cleanUrl = url.split('"')[0].split("'")[0].split(')')[0];
      if (!urls.includes(cleanUrl)) {
        urls.push(cleanUrl);
      }
    });
  }
  
  return urls;
}

function identifyImageType(url) {
  const urlLower = url.toLowerCase();
  
  // Tentar identificar pelo URL
  if (urlLower.includes('interno') || urlLower.includes('internal')) {
    if (urlLower.includes('potencial') || urlLower.includes('tp') || urlLower.includes('voltage')) {
      return 'tp-interno.png';
    } else if (urlLower.includes('corrente') || urlLower.includes('tc') || urlLower.includes('current')) {
      return 'tc-interno.png';
    }
  } else if (urlLower.includes('externo') || urlLower.includes('external')) {
    if (urlLower.includes('potencial') || urlLower.includes('tp') || urlLower.includes('voltage')) {
      return 'tp-externo.png';
    } else if (urlLower.includes('corrente') || urlLower.includes('tc') || urlLower.includes('current')) {
      return 'tc-externo.png';
    }
  }
  
  return null;
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(downloadDir, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  ${filename} já existe. Pulando...`);
      resolve();
      return;
    }

    console.log(`📥 Baixando: ${filename}...`);

    // Usar URL completa com parâmetros (Wix precisa deles)
    let cleanUrl = url;
    
    // Se a URL não tiver parâmetros, tentar adicionar
    if (url.includes('wixstatic.com') && !url.includes('/v1/')) {
      // Tentar usar a URL completa original
      cleanUrl = url;
    }

    const protocol = cleanUrl.startsWith('https') ? https : http;
    
    const request = protocol.get(cleanUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ ${filename} baixado!`);
          resolve();
        });
      } else if (response.statusCode >= 300 && response.statusCode < 400) {
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Erro ${response.statusCode}`));
      }
    });

    request.on('error', reject);
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  console.log('🔍 Tentando extrair imagens automaticamente do Wix...\n');
  console.log(`📄 Acessando: ${wixPageUrl}\n`);

  try {
    const html = await fetchPage(wixPageUrl);
    console.log('✅ Página carregada!\n');
    
    const imageUrls = extractImageUrls(html);
    console.log(`📸 Encontradas ${imageUrls.length} URLs de imagens\n`);
    
    if (imageUrls.length === 0) {
      console.log('❌ Nenhuma URL encontrada automaticamente.');
      console.log('💡 Isso pode acontecer porque o Wix carrega imagens via JavaScript.');
      console.log('📋 Use o método manual: node scripts/get-wix-images.js\n');
      return;
    }

    console.log('URLs encontradas:');
    imageUrls.forEach((url, i) => {
      console.log(`  ${i + 1}. ${url.substring(0, 80)}...`);
    });
    console.log('');

    // Tentar identificar e baixar
    const imagesToDownload = [];
    const usedFilenames = new Set();

    for (const url of imageUrls) {
      const filename = identifyImageType(url);
      if (filename && !usedFilenames.has(filename)) {
        imagesToDownload.push({ url, filename });
        usedFilenames.add(filename);
      }
    }

    // Se não identificou todas, usar as primeiras 4
    if (imagesToDownload.length < 4 && imageUrls.length >= 4) {
      console.log('⚠️  Não foi possível identificar todos os tipos automaticamente.');
      console.log('📥 Baixando as 4 primeiras imagens encontradas...\n');
      
      for (let i = 0; i < 4 && i < imageUrls.length; i++) {
        const ext = imageUrls[i].match(/\.(jpg|jpeg|png|webp)/i)?.[0] || '.png';
        const filename = ['tp-interno', 'tp-externo', 'tc-interno', 'tc-externo'][i] + ext;
        imagesToDownload.push({ url: imageUrls[i], filename });
      }
    }

    if (imagesToDownload.length === 0) {
      console.log('❌ Não foi possível identificar as imagens.');
      console.log('💡 Use o método manual descrito em COMO_EXTRAIR_IMAGENS_WIX.md\n');
      return;
    }

    console.log(`📦 Baixando ${imagesToDownload.length} imagens...\n`);

    for (const image of imagesToDownload) {
      try {
        await downloadImage(image.url, image.filename);
      } catch (error) {
        console.error(`❌ Erro ao baixar ${image.filename}:`, error.message);
      }
    }

    console.log('\n✅ Processo concluído!');
    console.log(`📁 Imagens em: ${downloadDir}\n`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n💡 Use o método manual:');
    console.log('   1. Siga as instruções em COMO_EXTRAIR_IMAGENS_WIX.md');
    console.log('   2. Execute: node scripts/get-wix-images.js\n');
  }
}

main();

