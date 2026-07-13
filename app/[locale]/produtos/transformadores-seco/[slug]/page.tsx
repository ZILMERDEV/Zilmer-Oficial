import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ImageGallery'
import ContactButton from '@/components/ContactButton'
import styles from './detail.module.css'
import { cdnUrl } from '@/lib/assets'
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
    'media-tensao': 'media-tensao',
    'para-retificadores': 'para-retificadores',
    'aterramento': 'aterramento',
    'baixa-tensao': 'baixa-tensao',
    'reatores-de-partida': 'reatores-de-partida',
  }

  const produtoKey = slugToKey[slug]
  const produtos = produtosData.seco?.produtos
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
  const catalogConfig: { [key: string]: { file: string; titlePt: string; titleEn: string; titleEs: string; descPt: string; descEn: string; descEs: string } } = {
    'baixa-tensao': {
      file: '/catalogos/TRANSFORMADORES-A-SECO-BT.pdf',
      titlePt: 'Catálogo Transformadores a Seco BT',
      titleEn: 'Dry-Type LV Transformers Catalogue',
      titleEs: 'Catálogo Transformadores en Seco BT',
      descPt: 'Especificações técnicas e Desenho Dimensional Orientativo',
      descEn: 'Technical specifications and Indicative Dimensional Drawing',
      descEs: 'Especificaciones técnicas y Plano Dimensional Orientativo',
    },
    'media-tensao': {
      file: '/catalogos/TRANSFORMADORES-A-SECO-MT.pdf',
      titlePt: 'Catálogo Transformadores a Seco MT',
      titleEn: 'Dry-Type MV Transformers Catalogue',
      titleEs: 'Catálogo Transformadores en Seco MT',
      descPt: 'Especificações técnicas e Desenho Dimensional Orientativo',
      descEn: 'Technical specifications and Indicative Dimensional Drawing',
      descEs: 'Especificaciones técnicas y Plano Dimensional Orientativo',
    },
  }
  const catalog = catalogConfig[slug]

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

            {catalog && (
              <div className={styles.pdfDownloadSection}>
                <div className={styles.pdfCard}>
                  <div className={styles.pdfIcon}>📄</div>
                  <div className={styles.pdfInfo}>
                    <h3 className={styles.pdfTitle}>{locale === 'en' ? catalog.titleEn : locale === 'es' ? catalog.titleEs : catalog.titlePt}</h3>
                    <p className={styles.pdfDescription}>
                      {locale === 'en' ? catalog.descEn : locale === 'es' ? catalog.descEs : catalog.descPt}
                    </p>
                  </div>
                  <a
                    href={cdnUrl(catalog.file)}
                    download
                    className={styles.downloadButton}
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

