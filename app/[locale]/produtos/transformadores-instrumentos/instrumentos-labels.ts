import type { Tipo, Uso, Classe } from './instrumentos-data'

type Locale = 'pt' | 'en' | 'es'

function porLocale(locale: string): Locale {
  return locale === 'en' ? 'en' : locale === 'es' ? 'es' : 'pt'
}

export function tipoLabel(tipo: Tipo, locale: string): string {
  const l = porLocale(locale)
  if (tipo === 'tp') {
    return l === 'en' ? 'PT (Potential Transformers)' : l === 'es' ? 'TP (Transformadores de Tensión)' : 'TP (Transformadores de Potencial)'
  }
  return l === 'en' ? 'CT (Current Transformers)' : l === 'es' ? 'TC (Transformadores de Corriente)' : 'TC (Transformadores de Corrente)'
}

export function usoLabel(uso: Uso, locale: string): string {
  const l = porLocale(locale)
  if (uso === 'interno') {
    return l === 'en' ? 'Indoor Use' : l === 'es' ? 'Uso Interior' : 'Uso Interno'
  }
  return l === 'en' ? 'Outdoor Use' : l === 'es' ? 'Uso Exterior' : 'Uso Externo'
}

export function classeLabel(classe: Classe, locale: string): string {
  const l = porLocale(locale)
  const mapa: Record<Classe, Record<Locale, string>> = {
    'baixa-tensao': { pt: 'Baixa Tensão', en: 'Low Voltage', es: 'Baja Tensión' },
    '7.2kv': { pt: '7,2 kV', en: '7.2 kV', es: '7,2 kV' },
    '15kv': { pt: '15 kV', en: '15 kV', es: '15 kV' },
    '24kv': { pt: '24 kV', en: '24 kV', es: '24 kV' },
    '36kv': { pt: '36 kV', en: '36 kV', es: '36 kV' },
  }
  return mapa[classe][l]
}

// Legendas atuais do site — mesmo texto que já existia por tipo+uso antes
// desta reorganização, só reaproveitado aqui em cada página de destino.
export function legenda(tipo: Tipo, uso: Uso, locale: string): string {
  const l = porLocale(locale)
  if (tipo === 'tp' && uso === 'interno') {
    return l === 'en'
      ? 'Potential transformers for indoor installation in substations, electrical panels and distribution switchgear, designed for protected environments, ensuring high precision and reliability in voltage measurements.'
      : l === 'es'
      ? 'Transformadores de tensión para instalación interior en subestaciones, tableros eléctricos y celdas de distribución, diseñados para ambientes protegidos, garantizando alta precisión y confiabilidad en las mediciones de tensión.'
      : 'Transformadores de potencial para instalação interna em subestações, painéis elétricos e quadros de distribuição, projetados para ambientes protegidos, garantindo alta precisão e confiabilidade nas medições de tensão.'
  }
  if (tipo === 'tp' && uso === 'externo') {
    return l === 'en'
      ? 'Potential transformers for outdoor installation, developed with adequate protection against weathering, humidity and climatic variations, maintaining high precision even in adverse environmental conditions.'
      : l === 'es'
      ? 'Transformadores de tensión para instalación exterior, desarrollados con protección adecuada contra intemperies, humedad y variaciones climáticas, manteniendo alta precisión incluso en condiciones ambientales adversas.'
      : 'Transformadores de potencial para instalação externa, desenvolvidos com proteção adequada contra intempéries, umidade e variações climáticas, mantendo alta precisão mesmo em condições ambientais adversas.'
  }
  if (tipo === 'tc' && uso === 'interno') {
    return l === 'en'
      ? 'Current transformers for indoor installation in substations, electrical panels and distribution switchgear, offering precise current measurement for protection, control and energy metering systems.'
      : l === 'es'
      ? 'Transformadores de corriente para instalación interior en subestaciones, tableros eléctricos y celdas de distribución, que ofrecen medición precisa de corriente para sistemas de protección, control y medición energética.'
      : 'Transformadores de corrente para instalação interna em subestações, painéis elétricos e quadros de distribuição, oferecendo medição precisa de corrente para sistemas de proteção, controle e medição energética.'
  }
  // tc externo
  return l === 'en'
    ? 'Current transformers for outdoor installation, designed with robust protection against weathering and adverse climatic conditions, ensuring precise and reliable measurements even in external environments.'
    : l === 'es'
    ? 'Transformadores de corriente para instalación exterior, diseñados con protección robusta contra intemperies y condiciones climáticas adversas, garantizando mediciones precisas y confiables incluso en ambientes exteriores.'
    : 'Transformadores de corrente para instalação externa, projetados com proteção robusta contra intempéries e condições climáticas adversas, garantindo medições precisas e confiáveis mesmo em ambientes externos.'
}

export function t(locale: string) {
  const l = porLocale(locale)
  return {
    breadcrumbHome:
      l === 'en' ? 'Instrument Transformers' : l === 'es' ? 'Transformadores para Instrumentos' : 'Transformadores para Instrumentos',
    escolha:
      l === 'en'
        ? 'Choose a category from the menu to view the models.'
        : l === 'es'
        ? 'Elija una categoría en el menú para ver los modelos.'
        : 'Escolha uma categoria no menu ao lado para ver os modelos.',
    semModelos:
      l === 'en'
        ? 'No models published in this category yet.'
        : l === 'es'
        ? 'Aún no hay modelos publicados en esta categoría.'
        : 'Ainda não há modelos publicados nesta categoria.',
    voltar: l === 'en' ? '← All categories' : l === 'es' ? '← Todas las categorías' : '← Todas as categorias',
    pdf: 'PDF',
    modelo: l === 'en' ? 'Model' : l === 'es' ? 'Modelo' : 'Modelo',
    indiceAriaLabel:
      l === 'en'
        ? 'Instrument transformers index'
        : l === 'es'
        ? 'Índice de transformadores para instrumentos'
        : 'Índice de transformadores para instrumentos',
    todasCategorias: l === 'en' ? 'All categories' : l === 'es' ? 'Todas las categorías' : 'Todas as categorias',
  }
}
