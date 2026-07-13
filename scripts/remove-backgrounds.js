const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Caminhos das pastas de imagens (processa recursivamente todas as subpastas)
const IMAGE_DIRS = [
  path.join(__dirname, '../public/images/produtos/oleo'),
  path.join(__dirname, '../public/images/produtos/seco'),
]

// Opção para fazer backup antes de processar
const MAKE_BACKUP = true
const BACKUP_DIR = path.join(__dirname, '../public/images/produtos/backup')

// Função para encontrar todas as imagens PNG recursivamente
function findPngFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      // Ignora pastas específicas se necessário
      findPngFiles(filePath, fileList)
    } else if (file.toLowerCase().endsWith('.png')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// Função para remover fundo e sombras de uma imagem
async function removeBackground(imagePath) {
  try {
    console.log(`Processando: ${path.basename(imagePath)}`)
    
    // Lê a imagem
    const image = sharp(imagePath)
    const metadata = await image.metadata()
    
    // Obtém os dados da imagem como buffer
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    
    // Processa cada pixel
    const newData = Buffer.alloc(data.length)
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      
      // Calcula a luminosidade do pixel
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114)
      
      // Detecta fundo branco/cinza claro
      // RGB alto (> 240) indica fundo branco
      const isWhiteBackground = r > 240 && g > 240 && b > 240
      
      // Detecta cinza claro (tons próximos, luminosidade alta)
      const isLightGray = luminance > 220 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15
      
      // Detecta sombras (pixels escuros com baixa saturação ou baixa opacidade)
      const isDark = luminance < 60
      const saturation = Math.max(r, g, b) - Math.min(r, g, b)
      const isShadow = isDark && (saturation < 30 || a < 180)
      
      // Detecta bordas de sombra (transição suave entre objeto e sombra)
      const isShadowEdge = luminance > 200 && luminance < 240 && saturation < 20
      
      // Se for fundo, sombra ou borda de sombra, torna transparente
      if (isWhiteBackground || isLightGray || isShadow || isShadowEdge) {
        newData[i] = 0      // R
        newData[i + 1] = 0  // G
        newData[i + 2] = 0  // B
        newData[i + 3] = 0  // A (transparente)
      } else {
        // Mantém o pixel original
        newData[i] = r
        newData[i + 1] = g
        newData[i + 2] = b
        newData[i + 3] = a
      }
    }
    
    // Cria nova imagem com fundo removido
    await sharp(newData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
      .png()
      .toFile(imagePath)
    
    console.log(`✓ Processado: ${path.basename(imagePath)}`)
    
  } catch (error) {
    console.error(`Erro ao processar ${imagePath}:`, error.message)
  }
}

// Função para fazer backup de uma imagem
function backupImage(imagePath) {
  if (!MAKE_BACKUP) return
  
  try {
    const relativePath = path.relative(
      path.join(__dirname, '../public/images/produtos'),
      imagePath
    )
    const backupPath = path.join(BACKUP_DIR, relativePath)
    const backupDir = path.dirname(backupPath)
    
    // Cria o diretório de backup se não existir
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    // Copia o arquivo
    fs.copyFileSync(imagePath, backupPath)
  } catch (error) {
    console.warn(`⚠ Não foi possível fazer backup de ${imagePath}:`, error.message)
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando remoção de fundos e sombras...\n')
  
  if (MAKE_BACKUP) {
    console.log('📦 Modo backup ativado - as imagens originais serão salvas\n')
  }
  
  let totalImages = 0
  let processedImages = 0
  
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠ Pasta não encontrada: ${dir}`)
      continue
    }
    
    console.log(`\n📁 Processando pasta: ${path.basename(dir)}`)
    
    const pngFiles = findPngFiles(dir)
    totalImages += pngFiles.length
    
    console.log(`   Encontradas ${pngFiles.length} imagens PNG\n`)
    
    for (const imagePath of pngFiles) {
      if (MAKE_BACKUP) {
        backupImage(imagePath)
      }
      await removeBackground(imagePath)
      processedImages++
    }
  }
  
  console.log(`\n✅ Processamento concluído!`)
  console.log(`   Total de imagens processadas: ${processedImages}/${totalImages}`)
  if (MAKE_BACKUP) {
    console.log(`   Backup salvo em: ${BACKUP_DIR}`)
  }
}

// Executa o script
main().catch(console.error)

