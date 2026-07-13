const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÃO: Cole aqui as URLs das imagens
// ============================================
// Para encontrar as URLs:
// 1. Abra: https://zilmertransformado.wixsite.com/zilmer/transformadores-para-instrumentos
// 2. Pressione F12 (DevTools)
// 3. Aba "Network" > Filtro "Img"
// 4. Recarregue a página (F5)
// 5. Clique em cada imagem e copie a URL completa
// 6. Cole abaixo:

const imagesToDownload = [
  // Exemplo - substitua pelas URLs reais:
  // { url: 'https://static.wixstatic.com/media/xxxxx.jpg', filename: 'tp-interno.png' },
  // { url: 'https://static.wixstatic.com/media/xxxxx.jpg', filename: 'tp-externo.png' },
  // { url: 'https://static.wixstatic.com/media/xxxxx.jpg', filename: 'tc-interno.png' },
  // { url: 'https://static.wixstatic.com/media/xxxxx.jpg', filename: 'tc-externo.png' },
];

// ============================================

const downloadDir = path.join(__dirname, '../public/images/produtos/instrumentos');

// Criar pasta se não existir
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(downloadDir, filename);
    
    // Se já existe, perguntar se quer sobrescrever
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  ${filename} já existe. Pulando...`);
      resolve();
      return;
    }

    console.log(`📥 Baixando: ${filename}...`);

    // Limpar URL - remover parâmetros do Wix que podem causar problemas
    let cleanUrl = url;
    
    // Se for URL do Wix com parâmetros, tentar pegar a URL base
    if (url.includes('wixstatic.com') && url.includes('/v1/')) {
      // Extrair a parte base da URL do Wix
      const match = url.match(/(https:\/\/static\.wixstatic\.com\/media\/[^\/]+)/);
      if (match) {
        cleanUrl = match[1];
        // Tentar adicionar extensão baseada no original
        const extMatch = url.match(/\.(jpg|jpeg|png|webp)/i);
        if (extMatch) {
          cleanUrl += extMatch[0];
        } else {
          cleanUrl += '.jpg'; // padrão
        }
      }
    }

    const protocol = cleanUrl.startsWith('https') ? https : http;
    
    const request = protocol.get(cleanUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ ${filename} baixado com sucesso!`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        // Seguir redirects
        const redirectUrl = response.headers.location;
        console.log(`   ↪️  Redirecionando para: ${redirectUrl}`);
        downloadImage(redirectUrl, filename)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Erro ${response.statusCode} ao baixar ${filename}`));
      }
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error(`Timeout ao baixar ${filename}`));
    });
  });
}

async function downloadAll() {
  console.log('🚀 Iniciando download de imagens do Wix...\n');
  
  if (imagesToDownload.length === 0) {
    console.log('❌ Nenhuma URL configurada!\n');
    console.log('📋 PASSO A PASSO PARA ENCONTRAR AS URLs:\n');
    console.log('1. Abra o navegador e acesse:');
    console.log('   https://zilmertransformado.wixsite.com/zilmer/transformadores-para-instrumentos\n');
    console.log('2. Pressione F12 para abrir as Ferramentas de Desenvolvedor\n');
    console.log('3. Clique na aba "Network" (Rede)\n');
    console.log('4. No filtro, selecione "Img" (apenas imagens)\n');
    console.log('5. Recarregue a página (F5)\n');
    console.log('6. Você verá uma lista de todas as imagens carregadas\n');
    console.log('7. Procure pelas 4 imagens dos transformadores:\n');
    console.log('   - Transformador de Potencial - Uso Interno');
    console.log('   - Transformador de Potencial - Uso Externo');
    console.log('   - Transformador de Corrente - Uso Interno');
    console.log('   - Transformador de Corrente - Uso Externo\n');
    console.log('8. Clique em cada imagem na lista\n');
    console.log('9. No painel direito, copie a URL completa (geralmente começa com');
    console.log('   https://static.wixstatic.com/media/...)\n');
    console.log('10. Cole as URLs no array imagesToDownload neste arquivo\n');
    console.log('11. Execute novamente: node scripts/get-wix-images.js\n');
    return;
  }

  console.log(`📦 Total de imagens para baixar: ${imagesToDownload.length}\n`);

  for (const image of imagesToDownload) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`❌ Erro ao baixar ${image.filename}:`, error.message);
      console.log(`   URL: ${image.url}\n`);
    }
  }
  
  console.log('\n✅ Processo concluído!');
  console.log(`📁 Imagens salvas em: ${downloadDir}\n`);
  console.log('💡 Verifique se todas as imagens foram baixadas corretamente.');
}

// Executar
downloadAll();


