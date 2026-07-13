const fs = require('fs')
const path = require('path')

// Caminho da pasta no desktop
const DESKTOP_PATH = path.join(require('os').homedir(), 'Desktop')
const SOURCE_FOLDER = path.join(DESKTOP_PATH, 'fotos para edição (ROCCO - SITE) (REFEITA)')

// Caminho de destino no projeto
const TARGET_BASE = path.join(__dirname, '../public/images/produtos')
const AREAS_BASE = path.join(__dirname, '../public/images/areas')

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

// Função para normalizar nomes de arquivos (remove acentos, normaliza espaços/underscores, remove versões)
function normalizeFileName(fileName) {
  return fileName
    .replace(/^\(2\)\s*/i, '')  // Remove prefixo "(2)" no início
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')  // Converte underscores em espaços
    .replace(/\s+/g, ' ')  // Normaliza múltiplos espaços
    .replace(/\s*v\d+\s*/gi, ' ')  // Remove versões como "v1", "v2"
    .replace(/\s*-\s*cenario\s*/gi, ' ')  // Remove "- CENÁRIO"
    .replace(/\s*sem\s*tampa\s*/gi, ' ')  // Remove "SEM TAMPA"
    .replace(/\s*tampado\s*/gi, ' ')  // Remove "TAMPADO"
    .replace(/\.(png|jpg|jpeg)$/i, '')  // Remove extensão para comparação
    .trim()
}

// Função para extrair o código principal (3 letras) e informações principais
function extractKeyInfo(fileName) {
  const normalized = normalizeFileName(fileName)
  
  // Extrai código de 3 letras no início (ex: TAM, TCO, RAO, etc)
  const codeMatch = normalized.match(/^([a-z]{3})\s*-\s*/)
  const code = codeMatch ? codeMatch[1] : ''
  
  // Remove o código para pegar o resto
  const rest = normalized.replace(/^[a-z]{3}\s*-\s*/i, '')
  
  // Tenta extrair números (kVA, kW, HP, CV, etc)
  const numbers = rest.match(/(\d+)\s*(kva|kw|hp|cv|mva)/i)
  const power = numbers ? `${numbers[1]} ${numbers[2]}` : ''
  
  return {
    code,
    rest,
    power,
    full: normalized
  }
}

// Função para calcular similaridade entre dois nomes
function calculateSimilarity(name1, name2) {
  const info1 = extractKeyInfo(name1)
  const info2 = extractKeyInfo(name2)
  
  // Se os códigos são diferentes, não são a mesma imagem
  if (info1.code && info2.code && info1.code !== info2.code) {
    return 0
  }
  
  // Se ambos têm código e são iguais, aumenta a pontuação
  let score = 0
  if (info1.code && info2.code && info1.code === info2.code) {
    score += 50
  }
  
  // Se ambos têm potência e são iguais, aumenta a pontuação
  if (info1.power && info2.power && info1.power.toLowerCase() === info2.power.toLowerCase()) {
    score += 30
  }
  
  // Compara o resto do nome (sem código e potência)
  const rest1 = info1.rest.replace(/\d+\s*(kva|kw|hp|cv|mva)/gi, '').trim()
  const rest2 = info2.rest.replace(/\d+\s*(kva|kw|hp|cv|mva)/gi, '').trim()
  
  // Se os restos são muito similares, aumenta a pontuação
  if (rest1 && rest2) {
    const similarity = calculateStringSimilarity(rest1, rest2)
    score += similarity * 20
  }
  
  return score
}

// Função para calcular similaridade entre strings
function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) {
    return 1.0
  }
  
  // Verifica se uma string contém a outra
  if (longer.includes(shorter)) {
    return 0.8
  }
  
  // Conta palavras em comum
  const words1 = str1.split(/\s+/)
  const words2 = str2.split(/\s+/)
  const commonWords = words1.filter(w => words2.includes(w))
  
  return commonWords.length / Math.max(words1.length, words2.length)
}

// Função para encontrar imagem correspondente no projeto
function findMatchingImage(imageName, targetDir, areasDir) {
  const sourceInfo = extractKeyInfo(imageName)
  let bestMatch = null
  let bestScore = 0
  
  function searchInDir(dir) {
    if (!fs.existsSync(dir)) {
      return
    }
    
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        searchInDir(filePath)
      } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
        const score = calculateSimilarity(imageName, file)
        
        if (score > bestScore && score >= 50) { // Mínimo de 50% de similaridade
          bestScore = score
          bestMatch = filePath
        }
      }
    }
  }
  
  // Procura em produtos (oleo e seco)
  searchInDir(path.join(targetDir, 'oleo'))
  searchInDir(path.join(targetDir, 'seco'))
  
  // Procura em areas
  if (fs.existsSync(areasDir)) {
    const areaDirs = fs.readdirSync(areasDir)
    areaDirs.forEach(areaDir => {
      const areaPath = path.join(areasDir, areaDir)
      if (fs.statSync(areaPath).isDirectory()) {
        searchInDir(areaPath)
      }
    })
  }
  
  return bestMatch
}

// Função principal
async function main() {
  console.log('🔍 Analisando imagens editadas com correspondência inteligente...\n')
  
  // Verifica se a pasta existe
  if (!fs.existsSync(SOURCE_FOLDER)) {
    console.error(`❌ Pasta não encontrada: ${SOURCE_FOLDER}`)
    return
  }
  
  // Encontra todas as imagens
  console.log(`📂 Procurando imagens em: ${SOURCE_FOLDER}\n`)
  
  const allImages = findImages(SOURCE_FOLDER)
  console.log(`   Total de imagens encontradas: ${allImages.length}\n`)
  
  if (allImages.length === 0) {
    console.log('⚠️  Nenhuma imagem encontrada na pasta.')
    return
  }
  
  // Lista todas as imagens encontradas
  console.log('📋 Imagens encontradas:')
  allImages.forEach((img, index) => {
    console.log(`   ${index + 1}. ${img.name}`)
  })
  
  // Agora tenta encontrar correspondências no projeto
  console.log('\n🔗 Procurando correspondências no projeto (com correspondência inteligente)...\n')
  
  const matches = []
  const notFound = []
  
  for (const img of allImages) {
    const targetPath = findMatchingImage(img.name, TARGET_BASE, AREAS_BASE)
    
    if (targetPath) {
      const score = calculateSimilarity(img.name, path.basename(targetPath))
      matches.push({
        source: img.path,
        target: targetPath,
        name: img.name,
        targetName: path.basename(targetPath),
        score: score
      })
      console.log(`✓ ${img.name}`)
      console.log(`  → ${path.relative(path.join(__dirname, '..'), targetPath)} (${Math.round(score)}% similaridade)\n`)
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
  
  // Substitui as imagens
  if (matches.length > 0) {
    console.log(`\n🔄 Substituindo ${matches.length} imagens...\n`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const match of matches) {
      try {
        // Cria backup da imagem original (apenas se não existir)
        const backupPath = match.target + '.backup'
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(match.target, backupPath)
          console.log(`   💾 Backup criado: ${path.basename(match.target)}`)
        }
        
        // Copia a nova imagem
        fs.copyFileSync(match.source, match.target)
        console.log(`✓ Substituída: ${path.basename(match.target)} (${Math.round(match.score)}% similaridade)`)
        successCount++
      } catch (error) {
        console.error(`✗ Erro ao substituir ${match.name}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n✅ Processo concluído!`)
    console.log(`   ${successCount} imagens substituídas com sucesso`)
    if (errorCount > 0) {
      console.log(`   ${errorCount} erros encontrados`)
    }
    console.log(`   Backups salvos com extensão .backup`)
  } else {
    console.log(`\n⚠️  Nenhuma imagem foi substituída.`)
  }
}

// Executa o script
main().catch(console.error)













