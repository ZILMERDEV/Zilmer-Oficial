'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import areasDataPtJson from '@/data/areas.json'
import areasDataEnJson from '@/data/areas.en.json'
// @ts-ignore
import areasDataEsJson from '@/data/areas.es.json'
import { useLocale } from 'next-intl'
import { cdnUrl } from '@/lib/assets'

type AreasDataType = {
  [key: string]: {
    title: string
    aplicacao: {
      title: string
      description: string
      onde?: string
      como?: string
      image: string
      heroImage: string
      heroDescription: string
    }
    solucao: {
      title: string
      problem: string
      melhora: string
      essencial: string
    }
    projetos: Array<{
      title: string
      description: string
      image: string
    }>
  }
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

function renderText(text: string | undefined | null) {
  if (!text) return null
  const plain = stripHtml(text)
  if (!plain) return null
  return (
    <>
      {plain.split('\n\n').filter(p => p.trim()).map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </>
  )
}

const areasOrder = ['transporte', 'hidreletrica', 'mineracao', 'subestacoes', 'energias-renovaveis', 'controle-medicao']

// Encodes spaces in path before prepending CDN base
function safeCdnUrl(path: string): string {
  return cdnUrl(path.replace(/ /g, '%20'))
}

// Returns the URL to use: local first, CDN if local has already failed
function resolvedSrc(path: string, failedPaths: Set<string>): string {
  return failedPaths.has(path) ? safeCdnUrl(path) : path
}

export default function AreaPage({ params }: { params: { slug: string } }) {
  const locale = useLocale()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dynamicData, setDynamicData] = useState<AreasDataType | null>(null)
  // Tracks paths that failed to load locally — keyed by path string, not by index,
  // so stale onError events from a superseded path never pollute a new path's state.
  const [localFailedPaths, setLocalFailedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/admin/areas')
      .then(r => r.json())
      .then((data: AreasDataType) => {
        setDynamicData(data)
        // Reset so fresh paths always try local first
        setLocalFailedPaths(new Set())
        setCurrentImageIndex(0)
      })
      .catch(() => {})
  }, [params.slug])

  const staticData = (
    locale === 'en' ? areasDataEnJson :
    locale === 'es' ? areasDataEsJson :
    areasDataPtJson
  ) as AreasDataType

  // EN/ES are only edited via code; PT is edited via admin so use dynamic data
  const areasData = (locale !== 'en' && locale !== 'es' && dynamicData) ? dynamicData : staticData

  if (!params?.slug) notFound()

  const area = areasData[params.slug as keyof typeof areasData]
  if (!area) notFound()

  const currentIndex = areasOrder.indexOf(params.slug)
  const prevSlug = currentIndex > 0 ? areasOrder[currentIndex - 1] : areasOrder[areasOrder.length - 1]
  const nextSlug = currentIndex < areasOrder.length - 1 ? areasOrder[currentIndex + 1] : areasOrder[0]
  const prevArea = areasData[prevSlug as keyof typeof areasData]
  const nextArea = areasData[nextSlug as keyof typeof areasData]

  const bgExtensions: Record<string, string> = {
    transporte: 'webp', hidreletrica: 'webp', mineracao: 'jpg',
    subestacoes: 'webp', 'energias-renovaveis': 'jpg', 'controle-medicao': 'webp',
  }
  const bgExt = bgExtensions[params.slug]
  const bgImagePath = bgExt ? `/images/areas/backgrounds/${params.slug}.${bgExt}` : null

  const images: string[] = (area.aplicacao as any).images || [area.aplicacao.image]
  const imageCaptions: string[] = (area.aplicacao as any).imageCaptions || []
  const imageCaption: string = (area.aplicacao as any).imageCaption || ''
  const hasMultipleImages = images.length > 1

  const heroPath = (area.aplicacao as any).heroImage || area.aplicacao.image
  const contentPath = images[currentImageIndex]

  const markFailed = (path: string) =>
    setLocalFailedPaths(prev => prev.has(path) ? prev : new Set([...prev, path]))

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <Image
            src={resolvedSrc(heroPath, localFailedPaths)}
            alt={area.title}
            fill
            unoptimized
            className={styles.heroImage}
            priority
            onError={() => markFailed(heroPath)}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <Link href={`/areas/${prevSlug}`} className={styles.heroNavArrow} style={{ left: '20px' }}
          aria-label={locale === 'en' ? `Go to ${prevArea.title}` : locale === 'es' ? `Ir a ${prevArea.title}` : `Ir para ${prevArea.title}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Link>
        <Link href={`/areas/${nextSlug}`} className={styles.heroNavArrow} style={{ right: '20px' }}
          aria-label={locale === 'en' ? `Go to ${nextArea.title}` : locale === 'es' ? `Ir a ${nextArea.title}` : `Ir para ${nextArea.title}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>

        <div className={styles.heroContent}>
          <div className="container">
            <h1 className={styles.heroTitle}>{area.title}</h1>
            <div className={styles.heroSubtitle}>
              {renderText((area.aplicacao as any).heroDescription || area.aplicacao.description)}
            </div>
          </div>
        </div>
      </section>

      {/* Aplicação Section */}
      <section className={styles.aplicacaoSection}>
        {bgImagePath && (
          <div className={styles.aplicacaoBg} aria-hidden>
            <Image src={bgImagePath} alt="" fill className={styles.aplicacaoBgImg} priority={false} />
            <div className={styles.aplicacaoBgOverlay} />
          </div>
        )}
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{area.aplicacao.title}</h2>
            <div className={styles.titleUnderline}></div>
          </div>

          <div className={styles.aplicacaoGrid}>
            <div className={styles.aplicacaoImage}>
              <div className={styles.imageWrapper}>
                <Image
                  src={resolvedSrc(contentPath, localFailedPaths)}
                  alt={area.aplicacao.title}
                  fill
                  unoptimized
                  className={styles.contentImage}
                  onError={() => markFailed(contentPath)}
                />
                {hasMultipleImages && (
                  <>
                    <button className={styles.carouselArrowLeft} onClick={() => setCurrentImageIndex(p => (p - 1 + images.length) % images.length)}
                      aria-label={locale === 'en' ? 'Previous image' : locale === 'es' ? 'Imagen anterior' : 'Imagem anterior'}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button className={styles.carouselArrowRight} onClick={() => setCurrentImageIndex(p => (p + 1) % images.length)}
                      aria-label={locale === 'en' ? 'Next image' : locale === 'es' ? 'Imagen siguiente' : 'Próxima imagem'}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div className={styles.carouselIndicators}>
                      {images.map((_: string, index: number) => (
                        <button key={index}
                          className={`${styles.carouselDot} ${currentImageIndex === index ? styles.active : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={locale === 'en' ? `Go to image ${index + 1}` : locale === 'es' ? `Ir a imagen ${index + 1}` : `Ir para imagem ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {((hasMultipleImages && imageCaptions[currentImageIndex]) || (!hasMultipleImages && imageCaption)) && (
                <p className={styles.imageCaption}>
                  {(hasMultipleImages ? imageCaptions[currentImageIndex] : imageCaption)
                    ?.replace(/<[^>]*>/g, '').trim()}
                </p>
              )}
            </div>

            <div className={styles.aplicacaoTextQuadrants}>
              <div className={styles.aplicacaoDescription}>
                {renderText(area.aplicacao.description)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
