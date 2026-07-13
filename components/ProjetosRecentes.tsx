'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import styles from './ProjetosRecentes.module.css'
import { useLocale } from 'next-intl'

interface NoticiaItem {
  id: string
  title: string
  description: string
  image: string
  slug: string
}

interface NoticiasData {
  section: {
    title: string
    subtitle: string
  }
  items: NoticiaItem[]
}

export default function ProjetosRecentes() {
  const locale = useLocale()
  const [data, setData] = useState<NoticiasData | null>(null)

  useEffect(() => {
    fetch(`/api/admin/noticias?locale=${locale}`)
      .then((res) => res.json())
      .then((json: NoticiasData) => setData(json))
      .catch(() => {})
  }, [])

  if (!data || data.items.length === 0) return null

  const item = data.items[0]

  return (
    <section className={styles.projetosSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{locale === 'en' ? 'News' : locale === 'es' ? 'Noticias' : 'Notícias'}</h2>
          <p className={styles.subtitle}>{data.section.subtitle}</p>
        </div>

        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            <div className={styles.imageContainer}>
              <NextLink href={`/projetos/${item.slug}` as any}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={styles.carouselImage}
                  sizes="100vw"
                  priority={true}
                />
              </NextLink>
            </div>

            <div className={styles.carouselContent}>
              <NextLink href={`/projetos/${item.slug}` as any} className={styles.contentLink}>
                <h3 className={styles.carouselTitle}>{item.title}</h3>
                <p className={styles.carouselDescription}>{item.description}</p>
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
