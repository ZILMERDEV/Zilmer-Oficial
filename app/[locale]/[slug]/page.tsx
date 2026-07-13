'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import styles from './page.module.css'
import { cdnUrl } from '@/lib/assets'
import areasDataJson from '@/data/areas.json'
import areasDataEnJson from '@/data/areas.en.json'
// @ts-ignore
import areasDataEsJson from '@/data/areas.es.json'

function safeCdnUrl(path: string): string {
  return cdnUrl(encodeURI(path))
}

const areasData = areasDataJson as {
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

function renderText(text: string | undefined | null) {
  if (!text) return <p></p>
  const hasHTML = /<[^>]+>/.test(text)
  if (hasHTML) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />
  }
  return <p>{text}</p>
}

const areasOrder = [
  'transporte',
  'hidreletrica',
  'mineracao',
  'subestacoes',
  'energias-renovaveis',
  'controle-medicao',
]

export default function AreaSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const locale = useLocale()
  const [dynamicData, setDynamicData] = useState<typeof areasDataJson | null>(null)
  const [localFailedPaths, setLocalFailedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/admin/areas')
      .then(r => r.json())
      .then(data => {
        setDynamicData(data)
        setLocalFailedPaths(new Set())
        setCurrentImageIndex(0)
      })
      .catch(() => {})
  }, [params.slug])

  const staticData = locale === 'en' ? (areasDataEnJson as typeof areasDataJson) : locale === 'es' ? (areasDataEsJson as typeof areasDataJson) : areasDataJson
  const areasData = (locale !== 'en' && locale !== 'es' && dynamicData) ? dynamicData as typeof areasDataJson : staticData

  const markFailed = (path: string) =>
    setLocalFailedPaths(prev => prev.has(path) ? prev : new Set([...prev, path]))

  const resolvedSrc = (path: string) =>
    localFailedPaths.has(path) ? safeCdnUrl(path) : path

  if (!params?.slug) {
    notFound()
  }

  const area = areasData[params.slug as keyof typeof areasData]

  if (!area) {
    notFound()
  }

  const currentIndex = areasOrder.indexOf(params.slug)
  const prevSlug =
    currentIndex > 0 ? areasOrder[currentIndex - 1] : areasOrder[areasOrder.length - 1]
  const nextSlug =
    currentIndex < areasOrder.length - 1 ? areasOrder[currentIndex + 1] : areasOrder[0]
  const prevArea = areasData[prevSlug as keyof typeof areasData]
  const nextArea = areasData[nextSlug as keyof typeof areasData]

  const images = (area.aplicacao as any).images || [area.aplicacao.image]
  const imageCaptions = (area.aplicacao as any).imageCaptions || []
  const imageCaption = (area.aplicacao as any).imageCaption || ''
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          {(() => {
            const heroPath = (area.aplicacao as any).heroImage || area.aplicacao.image
            return (
              <Image
                src={resolvedSrc(heroPath)}
                alt={area.title}
                fill
                className={styles.heroImage}
                priority
                onError={() => markFailed(heroPath)}
              />
            )
          })()}
          <div className={styles.heroOverlay}></div>
        </div>

        <Link
          href={`/${prevSlug}`}
          className={styles.heroNavArrow}
          style={{ left: '20px' }}
          aria-label={locale === 'en' ? `Go to ${prevArea?.title}` : locale === 'es' ? `Ir a ${prevArea?.title}` : `Ir para ${prevArea?.title}`}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Link>
        <Link
          href={`/${nextSlug}`}
          className={styles.heroNavArrow}
          style={{ right: '20px' }}
          aria-label={locale === 'en' ? `Go to ${nextArea?.title}` : locale === 'es' ? `Ir a ${nextArea?.title}` : `Ir para ${nextArea?.title}`}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>

        <div className={styles.heroContent}>
          <div className="container">
            <h1 className={styles.heroTitle}>{area.title}</h1>
            <div className={styles.heroSubtitle}>
              {renderText(
                (area.aplicacao as any).heroDescription || area.aplicacao.description
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Aplicação Section */}
      <section className={styles.aplicacaoSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{area.aplicacao.title}</h2>
            <div className={styles.titleUnderline}></div>
          </div>

          <div className={styles.aplicacaoGrid}>
            <div className={styles.aplicacaoImage}>
              <div className={styles.imageWrapper}>
                {(() => {
                  const contentPath = images[currentImageIndex]
                  return (
                    <Image
                      src={resolvedSrc(contentPath)}
                      alt={area.aplicacao.title}
                      fill
                      className={styles.contentImage}
                      onError={() => markFailed(contentPath)}
                    />
                  )
                })()}
                {hasMultipleImages && (
                  <>
                    <button
                      className={styles.carouselArrowLeft}
                      onClick={prevImage}
                      aria-label={locale === 'en' ? 'Previous image' : locale === 'es' ? 'Imagen anterior' : 'Imagem anterior'}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      className={styles.carouselArrowRight}
                      onClick={nextImage}
                      aria-label={locale === 'en' ? 'Next image' : locale === 'es' ? 'Imagen siguiente' : 'Próxima imagem'}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div className={styles.carouselIndicators}>
                      {images.map((_: string, index: number) => (
                        <button
                          key={index}
                          className={`${styles.carouselDot} ${
                            currentImageIndex === index ? styles.active : ''
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={locale === 'en' ? `Go to image ${index + 1}` : locale === 'es' ? `Ir a imagen ${index + 1}` : `Ir para imagem ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {(hasMultipleImages && imageCaptions[currentImageIndex]) ||
              (!hasMultipleImages && imageCaption) ? (
                <p className={styles.imageCaption}>
                  {(() => {
                    const captionText = hasMultipleImages
                      ? imageCaptions[currentImageIndex]
                      : imageCaption
                    if (typeof captionText === 'string') {
                      return captionText.replace(/<[^>]*>/g, '').trim()
                    }
                    return captionText
                  })()}
                </p>
              ) : null}
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
