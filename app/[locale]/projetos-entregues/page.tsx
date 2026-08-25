'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import styles from './page.module.css'

import dataPt from '@/data/projetos-entregues.json'
import dataEn from '@/data/projetos-entregues.en.json'
import dataEs from '@/data/projetos-entregues.es.json'

type Projeto = {
  titulo: string
  cliente: string
  local: string
  setor: string
  ano: string
  resumoCard: string
  imagemCapa: string
}

type ProjetosData = { [slug: string]: Projeto }

export default function ProjetosEntreguesPage() {
  const locale = useLocale()
  const data = (
    locale === 'en' ? dataEn : locale === 'es' ? dataEs : dataPt
  ) as ProjetosData

  const slugs = Object.keys(data)

  const t = {
    title:
      locale === 'en' ? 'Completed Projects' : locale === 'es' ? 'Proyectos Realizados' : 'Projetos Realizados',
    subtitle:
      locale === 'en'
        ? 'Zilmer transformers in operation around the world.'
        : locale === 'es'
        ? 'Transformadores Zilmer en operación alrededor del mundo.'
        : 'Transformadores Zilmer em operação ao redor do mundo.',
    readMore: locale === 'en' ? 'View project' : locale === 'es' ? 'Ver proyecto' : 'Ver projeto',
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {slugs.map((slug) => {
            const p = data[slug]
            return (
              <article key={slug} className={styles.card}>
                <Link href={`/projetos-entregues/${slug}`} className={styles.cardLink}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={p.imagemCapa}
                      alt={p.titulo}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <span className={styles.cardMeta}>
                      {p.local} · {p.ano}
                    </span>
                    <h2 className={styles.cardTitle}>{p.titulo}</h2>
                    <p className={styles.cardDescription}>{p.resumoCard}</p>
                    <span className={styles.readMore}>{t.readMore} ›</span>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
