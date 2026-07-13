const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '../public/images/produtos/instrumentos');

console.log('🔍 Analisando imagens baixadas...\n');

const files = fs.readdirSync(imageDir)
  .filter(file => file.startsWith('transformador-'))
  .map(file => {
    const filePath = path.join(imageDir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2)
    };
  })
  .sort((a, b) => b.size - a.size);

console.log('📊 Imagens ordenadas por tamanho (maiores primeiro):\n');

files.forEach((file, index) => {
  const sizeLabel = file.sizeKB > 1024 
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : `${file.sizeKB} KB`;
  
  console.log(`${index + 1}. ${file.name} - ${sizeLabel}`);
});

console.log('\n💡 DICA:');
console.log('   - Imagens muito pequenas (< 10 KB) geralmente são ícones/logos');
console.log('   - Imagens maiores (> 50 KB) são provavelmente fotos dos produtos');
console.log('\n📝 Para identificar:');
console.log('   1. Abra a pasta: public/images/produtos/instrumentos/');
console.log('   2. Visualize as imagens maiores (primeiras da lista acima)');
console.log('   3. Identifique quais são: TP Interno, TP Externo, TC Interno, TC Externo');
console.log('   4. Renomeie ou me informe quais são quais!');

// Sugerir as 4 maiores como candidatas
const candidates = files.slice(0, 4);
console.log('\n🎯 Candidatas principais (4 maiores):');
candidates.forEach((file, index) => {
  const labels = ['TP Interno', 'TP Externo', 'TC Interno', 'TC Externo'];
  console.log(`   ${labels[index]}: ${file.name}`);
});


































