'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import styles from './page.module.css'

import setoresPt from '@/data/projetos-setores.json'
import setoresEn from '@/data/projetos-setores.en.json'
import setoresEs from '@/data/projetos-setores.es.json'

import dataPt from '@/data/projetos-entregues.json'
import dataEn from '@/data/projetos-entregues.en.json'
import dataEs from '@/data/projetos-entregues.es.json'

type Setor = {
  titulo: string
  imagemCapa: string
}

type Projeto = {
  // Nome da obra (ex: "UHE Monte Carlo"). Opcional: nem todo projeto tem um
  // empreendimento nomeado — quando falta, o local assume o papel de título.
  obra?: string
  local: string
  setor: string
  ano: string
  resumoCard: string
  imagemCapa: string
}

type SetoresData = { [slug: string]: Setor }
type ProjetosData = { [slug: string]: Projeto }

export default function SetorPage({ params }: { params: { setor: string } }) {
  const locale = useLocale()

  const setores = (
    locale === 'en' ? setoresEn : locale === 'es' ? setoresEs : setoresPt
  ) as SetoresData

  const projetos = (
    locale === 'en' ? dataEn : locale === 'es' ? dataEs : dataPt
  ) as ProjetosData

  const setor = setores[params.setor]

  if (!setor) notFound()

  const slugs = Object.keys(projetos).filter((slug) => projetos[slug].setor === params.setor)

  const t = {
    voltar:
      locale === 'en'
        ? '← All sectors'
        : locale === 'es'
        ? '← Todos los sectores'
        : '← Todos os setores',
    readMore: locale === 'en' ? 'View project' : locale === 'es' ? 'Ver proyecto' : 'Ver projeto',
    vazio:
      locale === 'en'
        ? 'Projects in this sector will be published soon.'
        : locale === 'es'
        ? 'Los proyectos de este sector se publicarán próximamente.'
        : 'Os projetos deste setor serão publicados em breve.',
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Link href="/projetos-entregues" className={styles.voltar}>
            {t.voltar}
          </Link>
          <h1 className={styles.title}>{setor.titulo}</h1>
        </div>

        {slugs.length === 0 ? (
          <p className={styles.vazio}>{t.vazio}</p>
        ) : (
          <div className={styles.grid}>
            {slugs.map((slug) => {
              const p = projetos[slug]
              const titulo = p.obra || p.local
              // Com obra nomeada o local perde o posto de título e volta como
              // dado, ao lado do ano — assim ele nunca some do card.
              const meta = p.obra ? `${p.local} · ${p.ano}` : p.ano
              return (
                <article key={slug} className={styles.card}>
                  <Link
                    href={`/projetos-entregues/${params.setor}/${slug}`}
                    className={styles.cardLink}
                  >
                    <div className={styles.imageContainer}>
                      <Image
                        src={p.imagemCapa}
                        alt={titulo}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardMeta}>{meta}</span>
                      <h2 className={styles.cardTitle}>{titulo}</h2>
                      <p className={styles.cardDescription}>{p.resumoCard}</p>
                      <span className={styles.readMore}>{t.readMore} ›</span>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
