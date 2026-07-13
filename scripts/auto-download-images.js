const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const downloadDir = path.join(__dirname, '../public/images/produtos/instrumentos');

// Criar pasta se não existir
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Função para fazer requisição HTTP
function fetch(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    protocol.get(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({ data, statusCode: response.statusCode, headers: response.headers });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Função para baixar imagem
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(downloadDir, filename);
    
    // Se já existe, pular
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} já existe, pulando...`);
      resolve();
      return;
    }

    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
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
          reject(new Error(`Erro ${response.statusCode}`));
        }
      }).on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Função para extrair URLs de imagens do HTML
function extractImageUrls(html) {
  const urls = [];
  
  // Padrões comuns de URLs do Wix
  const patterns = [
    /https?:\/\/static\.wixstatic\.com\/media\/[^"'\s)]+/g,
    /https?:\/\/images-wixmp-[^"'\s)]+\.(jpg|jpeg|png|webp)/gi,
    /https?:\/\/media\.wixstatic\.com\/[^"'\s)]+\.(jpg|jpeg|png|webp)/gi,
  ];

  patterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      urls.push(...matches);
    }
  });

  // Remover duplicatas
  return [...new Set(urls)];
}

// Função para identificar o tipo de transformador pela URL ou contexto
function identifyImageType(url, html) {
  const lowerUrl = url.toLowerCase();
  const lowerHtml = html.toLowerCase();
  
  // Tentar identificar por palavras-chave
  if (lowerUrl.includes('tp') || lowerUrl.includes('potencial')) {
    if (lowerUrl.includes('interno') || lowerUrl.includes('internal')) {
      return 'tp-interno';
    }
    if (lowerUrl.includes('externo') || lowerUrl.includes('external')) {
      return 'tp-externo';
    }
  }
  
  if (lowerUrl.includes('tc') || lowerUrl.includes('corrente')) {
    if (lowerUrl.includes('interno') || lowerUrl.includes('internal')) {
      return 'tc-interno';
    }
    if (lowerUrl.includes('externo') || lowerUrl.includes('external')) {
      return 'tc-externo';
    }
  }
  
  return null;
}

async function autoDownloadImages() {
  console.log('🚀 Iniciando busca automática de imagens...\n');
  
  const baseUrl = 'https://zilmertransformado.wixsite.com/zilmer';
  const produtosUrl = `${baseUrl}/produtos`;
  
  try {
    console.log('📡 Buscando página de produtos...');
    const { data: html, statusCode } = await fetch(produtosUrl);
    
    if (statusCode !== 200) {
      console.log('⚠️  Não foi possível acessar a página diretamente.');
      console.log('\n📝 Solução alternativa:');
      console.log('1. Abra o site no navegador: https://zilmertransformado.wixsite.com/zilmer/produtos');
      console.log('2. Pressione F12 > Network > Img');
      console.log('3. Recarregue a página');
      console.log('4. Copie as URLs das imagens');
      console.log('5. Me envie as URLs ou adicione no arquivo scripts/download-images.js');
      return;
    }

    console.log('✓ Página carregada!\n');
    console.log('🔍 Procurando imagens...');
    
    const imageUrls = extractImageUrls(html);
    
    if (imageUrls.length === 0) {
      console.log('⚠️  Nenhuma imagem encontrada automaticamente.');
      console.log('\n💡 Isso pode acontecer porque:');
      console.log('   - O Wix carrega imagens dinamicamente via JavaScript');
      console.log('   - As imagens estão em um iframe ou carregadas via API');
      console.log('\n📝 Use o método manual:');
      console.log('   1. Abra o site no navegador');
      console.log('   2. F12 > Network > Img > Recarregue');
      console.log('   3. Me envie as URLs ou adicione em scripts/download-images.js');
      return;
    }

    console.log(`✓ Encontradas ${imageUrls.length} imagens potenciais\n`);
    
    // Filtrar apenas imagens relevantes (transformadores)
    const relevantUrls = imageUrls.filter(url => {
      const lower = url.toLowerCase();
      return lower.includes('transformador') || 
             lower.includes('instrument') || 
             lower.includes('tp') || 
             lower.includes('tc') ||
             lower.includes('potencial') ||
             lower.includes('corrente');
    });

    if (relevantUrls.length === 0) {
      console.log('⚠️  Nenhuma imagem específica de transformadores encontrada.');
      console.log(`   Mas encontramos ${imageUrls.length} imagens no total.`);
      console.log('\n🔍 Tentando baixar todas as imagens encontradas...\n');
      
      // Tentar baixar as primeiras 4-6 imagens (provavelmente são as dos produtos)
      const imagesToTry = imageUrls.slice(0, 6);
      
      for (let i = 0; i < imagesToTry.length; i++) {
        const url = imagesToTry[i];
        const extension = url.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg';
        const filename = `transformador-${i + 1}.${extension}`;
        
        try {
          await downloadImage(url, filename);
        } catch (error) {
          console.log(`✗ Erro ao baixar ${filename}: ${error.message}`);
        }
      }
    } else {
      console.log(`✓ Encontradas ${relevantUrls.length} imagens relevantes\n`);
      
      for (let i = 0; i < relevantUrls.length; i++) {
        const url = relevantUrls[i];
        const identified = identifyImageType(url, html);
        const extension = url.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg';
        const filename = identified 
          ? `${identified}.${extension}` 
          : `transformador-${i + 1}.${extension}`;
        
        try {
          await downloadImage(url, filename);
        } catch (error) {
          console.log(`✗ Erro ao baixar ${filename}: ${error.message}`);
        }
      }
    }

    console.log('\n✅ Processo concluído!');
    console.log('\n📁 Verifique a pasta: public/images/produtos/instrumentos/');
    console.log('💡 Se os nomes não estiverem corretos, renomeie manualmente.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📝 Método alternativo:');
    console.log('   1. Abra o site no navegador');
    console.log('   2. F12 > Network > Img > Recarregue');
    console.log('   3. Copie as URLs e me envie ou adicione em scripts/download-images.js');
  }
}

autoDownloadImages();


































