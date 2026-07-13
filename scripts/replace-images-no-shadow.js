const fs = require('fs')
const path = require('path')

// Caminho da pasta no desktop
const DESKTOP_PATH = path.join(require('os').homedir(), 'Desktop')
const SOURCE_FOLDER = path.join(DESKTOP_PATH, 'imagens sem sombra PRODUTOS')
const NO_SHADOW_FOLDER = path.join(SOURCE_FOLDER, 'sem sobra')

// Caminho de destino no projeto
const TARGET_BASE = path.join(__dirname, '../public/images/produtos')

// Função para encontrar todas as imagens em uma pasta
function findImages(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList
  }
  
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      findImages(filePath, fileList)
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      fileList.push({
        path: filePath,
        name: file,
        relativePath: path.relative(SOURCE_FOLDER, filePath)
      })
    }
  })
  
  return fileList
}

// Função para normalizar nomes de arquivos (remove acentos, normaliza espaços/underscores)
function normalizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')  // Converte underscores em espaços
    .replace(/\s+/g, ' ')  // Normaliza múltiplos espaços
    .replace(/\.(png|jpg|jpeg)$/i, '')  // Remove extensão para comparação
    .trim()
}

// Função para encontrar imagem correspondente no projeto
function findMatchingImage(imageName, targetDir) {
  const normalizedSource = normalizeFileName(imageName)
  
  function searchInDir(dir) {
    if (!fs.existsSync(dir)) {
      return null
    }
    
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        const found = searchInDir(filePath)
        if (found) return found
      } else {
        const normalizedTarget = normalizeFileName(file)
        // Compara nomes normalizados (sem extensão)
        if (normalizedSource === normalizedTarget) {
          return filePath
        }
      }
    }
    
    return null
  }
  
  // Procura em oleo e seco
  const oleoPath = searchInDir(path.join(targetDir, 'oleo'))
  if (oleoPath) return oleoPath
  
  const secoPath = searchInDir(path.join(targetDir, 'seco'))
  if (secoPath) return secoPath
  
  return null
}

// Função principal
async function main() {
  console.log('🔍 Analisando imagens sem sombra...\n')
  
  // Verifica se a pasta existe
  if (!fs.existsSync(SOURCE_FOLDER)) {
    console.error(`❌ Pasta não encontrada: ${SOURCE_FOLDER}`)
    console.log('\n📁 Pastas encontradas no Desktop:')
    const desktopItems = fs.readdirSync(DESKTOP_PATH)
    desktopItems.forEach(item => {
      const itemPath = path.join(DESKTOP_PATH, item)
      if (fs.statSync(itemPath).isDirectory()) {
        console.log(`   - ${item}`)
      }
    })
    return
  }
  
  // Primeiro, vamos explorar a estrutura
  console.log(`📂 Estrutura da pasta:\n`)
  function exploreDir(dir, depth = 0) {
    const indent = '  '.repeat(depth)
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const stat = fs.statSync(itemPath)
      
      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${item}/`)
        exploreDir(itemPath, depth + 1)
      } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
        console.log(`${indent}  📷 ${item}`)
      }
    })
  }
  
  exploreDir(SOURCE_FOLDER)
  console.log('\n')
  
  // Encontra todas as imagens na pasta "sem sombra"
  console.log(`📂 Procurando imagens em: ${NO_SHADOW_FOLDER}\n`)
  
  let imagesToProcess = []
  
  // Primeiro, procura na pasta "sem sombra"
  if (fs.existsSync(NO_SHADOW_FOLDER)) {
    const noShadowImages = findImages(NO_SHADOW_FOLDER)
    console.log(`   Encontradas ${noShadowImages.length} imagens na pasta "sem sombra"`)
    imagesToProcess.push(...noShadowImages)
  } else {
    console.log(`   ⚠️  Pasta "sem sombra" não encontrada, procurando em toda a estrutura...`)
  }
  
  // Procura todas as imagens na pasta raiz e subpastas
  const allImages = findImages(SOURCE_FOLDER)
  console.log(`   Total de imagens encontradas na pasta: ${allImages.length}`)
  
  // Filtra imagens que estão na pasta "sem sombra" ou contêm "sem sombra" no nome
  const noShadowImages = allImages.filter(img => {
    const relativePath = path.relative(SOURCE_FOLDER, img.path).toLowerCase()
    return relativePath.includes('sem sombra') || 
           relativePath.includes('sem-sombra') ||
           img.name.toLowerCase().includes('sem sombra') ||
           img.name.toLowerCase().includes('sem-sombra') ||
           img.name.toLowerCase().includes('noshadow')
  })
  
  if (noShadowImages.length > 0) {
    console.log(`   Encontradas ${noShadowImages.length} imagens relacionadas a "sem sombra"`)
    imagesToProcess.push(...noShadowImages)
  }
  
  // Remove duplicatas
  const uniqueImages = []
  const seen = new Set()
  imagesToProcess.forEach(img => {
    if (!seen.has(img.name)) {
      seen.add(img.name)
      uniqueImages.push(img)
    }
  })
  
  console.log(`\n📊 Total de imagens únicas para processar: ${uniqueImages.length}\n`)
  
  // Lista todas as imagens encontradas
  console.log('📋 Imagens encontradas:')
  uniqueImages.forEach((img, index) => {
    console.log(`   ${index + 1}. ${img.name}`)
  })
  
  // Agora tenta encontrar correspondências no projeto
  console.log('\n🔗 Procurando correspondências no projeto...\n')
  
  const matches = []
  const notFound = []
  
  for (const img of uniqueImages) {
    const targetPath = findMatchingImage(img.name, TARGET_BASE)
    
    if (targetPath) {
      matches.push({
        source: img.path,
        target: targetPath,
        name: img.name
      })
      console.log(`✓ ${img.name}`)
      console.log(`  → ${path.relative(TARGET_BASE, targetPath)}\n`)
    } else {
      notFound.push(img)
      console.log(`✗ ${img.name} - Não encontrada no projeto\n`)
    }
  }
  
  console.log(`\n📊 Resumo:`)
  console.log(`   ✓ Correspondências encontradas: ${matches.length}`)
  console.log(`   ✗ Não encontradas: ${notFound.length}`)
  
  if (notFound.length > 0) {
    console.log(`\n⚠️  Imagens não encontradas no projeto:`)
    notFound.forEach(img => {
      console.log(`   - ${img.name}`)
    })
  }
  
  // Pergunta se deve substituir
  if (matches.length > 0) {
    console.log(`\n🔄 Substituindo ${matches.length} imagens...\n`)
    
    for (const match of matches) {
      try {
        // Cria backup da imagem original
        const backupPath = match.target + '.backup'
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(match.target, backupPath)
        }
        
        // Copia a nova imagem
        fs.copyFileSync(match.source, match.target)
        console.log(`✓ Substituída: ${path.basename(match.target)}`)
      } catch (error) {
        console.error(`✗ Erro ao substituir ${match.name}:`, error.message)
      }
    }
    
    console.log(`\n✅ Processo concluído!`)
    console.log(`   ${matches.length} imagens substituídas`)
    console.log(`   Backups salvos com extensão .backup`)
  } else {
    console.log(`\n⚠️  Nenhuma imagem foi substituída.`)
  }
}

// Executa o script
main().catch(console.error)

