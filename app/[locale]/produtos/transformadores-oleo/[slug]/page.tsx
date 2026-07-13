import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ImageGallery'
import ContactButton from '@/components/ContactButton'
import styles from './detail.module.css'
import produtosDataPt from '@/data/produtos.json'
import produtosDataEn from '@/data/produtos.en.json'
// @ts-ignore
import produtosDataEs from '@/data/produtos.es.json'
import { unstable_noStore as noStore } from 'next/cache'
import { getLocale } from 'next-intl/server'

// Forçar atualização dinâmica para sempre buscar dados atualizados
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  noStore()
  const locale = await getLocale()
  const produtosData = locale === 'en' ? produtosDataEn : locale === 'es' ? (produtosDataEs as typeof produtosDataPt) : produtosDataPt
  const isEn = locale === 'en'
  // Mapear slugs para chaves do JSON
  const slugToKey: { [key: string]: string } = {
    'transformadores-auxiliares': 'transformadores-auxiliares',
    'para-retificadores': 'para-retificadores',
    'para-fornos': 'para-fornos',
    'de-partida': 'de-partida',
    'de-aterramento': 'de-aterramento',
    'autotransformadores': 'autotransformadores',
    'reatores': 'reatores',
  }

  const produtoKey = slugToKey[slug]
  const produtos = produtosData.oleo?.produtos
  const produto = produtoKey && produtos && produtoKey in produtos ? produtos[produtoKey as keyof typeof produtos] : null

  if (!produto) {
    notFound()
  }

  // Usar imagens do JSON ou fallback vazio
  const images = (produto as any).images || []
  // Usar legendas do JSON ou fallback vazio
  const captions = (produto as any).captions || {}
  // Usar índice da primeira imagem do JSON ou padrão 0
  const firstImageIndex = (produto as any).firstImageIndex !== undefined 
    ? (produto as any).firstImageIndex 
    : 0

  return (
    <section className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>{produto.title}</h1>
        
        <div className={styles.content}>
          {images.length > 0 && (
            <div className={styles.gallerySection}>
              <ImageGallery 
                images={images} 
                alt={produto.title} 
                captions={captions}
                firstImageIndex={firstImageIndex}
              />
            </div>
          )}

          <div className={styles.infoSection}>
            {produto.longDescription && (
              <div className={styles.description}>
                <h2>{locale === 'en' ? 'Description' : locale === 'es' ? 'Descripción' : 'Descrição'}</h2>
                <p>{produto.longDescription}</p>
              </div>
            )}

            <div className={styles.contactButton}>
              <ContactButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

