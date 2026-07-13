const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// URL da página do Wix
const wixUrl = 'https://zilmertransformado.wixsite.com/zilmer/transformadores-para-instrumentos';

// Mapeamento esperado das imagens
const imageMapping = {
  'tp-interno': ['tp-interno', 'potencial interno', 'internal'],
  'tp-externo': ['tp-externo', 'potencial externo', 'external'],
  'tc-interno': ['tc-interno', 'corrente interno', 'current internal'],
  'tc-externo': ['tc-externo', 'corrente externo', 'current external']
};

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

    // Limpar URL de parâmetros do Wix
    let cleanUrl = url;
    if (url.includes('?')) {
      cleanUrl = url.split('?')[0];
    }

    const protocol = cleanUrl.startsWith('https') ? https : http;
    
    const request = protocol.get(cleanUrl, (response) => {
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
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout ao baixar ${filename}`));
    });
  });
}

// URLs conhecidas do Wix para transformadores de instrumentos
// Estas são URLs típicas do Wix - você pode precisar atualizar com as URLs reais
const wixImageUrls = [
  // Adicione aqui as URLs diretas das imagens que você encontrar
  // Exemplo de formato Wix:
  // 'https://static.wixstatic.com/media/xxxxx/v1/fill/w_xxx,h_xxx/xxxxx.jpg',
];

// URLs alternativas - tente encontrar estas no DevTools
const alternativeUrls = [
  // Você pode adicionar URLs aqui manualmente após inspecionar o site
];

async function downloadFromUrls() {
  console.log('🚀 Iniciando download de imagens do Wix...\n');
  
  const allUrls = [...wixImageUrls, ...alternativeUrls];
  
  if (allUrls.length === 0) {
    console.log('⚠️  Nenhuma URL configurada!');
    console.log('\n📝 INSTRUÇÕES PARA ENCONTRAR AS URLs:');
    console.log('1. Abra: https://zilmertransformado.wixsite.com/zilmer/transformadores-para-instrumentos');
    console.log('2. Pressione F12 para abrir DevTools');
    console.log('3. Vá na aba "Network" (Rede)');
    console.log('4. Filtre por "Img" (apenas imagens)');
    console.log('5. Recarregue a página (F5)');
    console.log('6. Procure pelas imagens dos transformadores na lista');
    console.log('7. Clique em cada imagem e copie a URL completa');
    console.log('8. Adicione as URLs no array wixImageUrls neste arquivo');
    console.log('\n💡 Dica: As URLs do Wix geralmente começam com:');
    console.log('   - https://static.wixstatic.com/media/...');
    console.log('   - https://images-wixmp-...');
    return;
  }

  // Mapear URLs para nomes de arquivo
  const imagesToDownload = allUrls.map((url, index) => {
    // Tentar identificar pelo URL ou usar índice
    let filename = '';
    
    const urlLower = url.toLowerCase();
    if (urlLower.includes('interno') || urlLower.includes('internal')) {
      if (urlLower.includes('potencial') || urlLower.includes('tp')) {
        filename = 'tp-interno.png';
      } else if (urlLower.includes('corrente') || urlLower.includes('tc') || urlLower.includes('current')) {
        filename = 'tc-interno.png';
      }
    } else if (urlLower.includes('externo') || urlLower.includes('external')) {
      if (urlLower.includes('potencial') || urlLower.includes('tp')) {
        filename = 'tp-externo.png';
      } else if (urlLower.includes('corrente') || urlLower.includes('tc') || urlLower.includes('current')) {
        filename = 'tc-externo.png';
      }
    }
    
    // Se não identificou, usar padrão
    if (!filename) {
      const ext = url.match(/\.(jpg|jpeg|png|webp)/i)?.[0] || '.png';
      filename = `transformador-${index + 1}${ext}`;
    }
    
    return { url, filename };
  });

  for (const image of imagesToDownload) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`✗ Erro ao baixar ${image.filename}:`, error.message);
    }
  }
  
  console.log('\n✅ Processo concluído!');
  console.log(`📁 Imagens salvas em: ${downloadDir}`);
}

// Executar
downloadFromUrls();


