'use client'

import Image from 'next/image'
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
  local: string
  setor: string
  ano: string
  imagemCapa: string
  // Fica fora da listagem sem apagar os dados — para reativar depois
  // basta remover o campo (ou pôr false).
  arquivado?: boolean
}

type SetoresData = { [slug: string]: Setor }
type ProjetosData = { [slug: string]: Projeto }

export default function ProjetosRealizadosPage() {
  const locale = useLocale()

  const setores = (
    locale === 'en' ? setoresEn : locale === 'es' ? setoresEs : setoresPt
  ) as SetoresData

  const projetos = (
    locale === 'en' ? dataEn : locale === 'es' ? dataEs : dataPt
  ) as ProjetosData

  const t = {
    title:
      locale === 'en' ? 'Completed Projects' : locale === 'es' ? 'Proyectos Realizados' : 'Projetos Realizados',
    emBreve: locale === 'en' ? 'Coming soon' : locale === 'es' ? 'Próximamente' : 'Em breve',
    projeto: locale === 'en' ? 'project' : locale === 'es' ? 'proyecto' : 'projeto',
    projetos: locale === 'en' ? 'projects' : locale === 'es' ? 'proyectos' : 'projetos',
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{t.title}</h1>
        </div>

        <div className={styles.grid}>
          {Object.keys(setores).map((slug) => {
            const setor = setores[slug]
            const doSetor = Object.values(projetos).filter(
              (p) => p.setor === slug && !p.arquivado
            )
            const total = doSetor.length

            // Capa do setor: imagem própria quando houver; senão a foto do
            // primeiro projeto cadastrado nele. Setor sem imagem e sem projeto
            // cai no gradiente da marca — nunca em imagem quebrada.
            const capa = setor.imagemCapa || doSetor[0]?.imagemCapa || ''

            const miolo = (
              <div className={styles.imageContainer}>
                {capa ? (
                  <Image
                    src={capa}
                    alt=""
                    aria-hidden="true"
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className={styles.capaVazia} aria-hidden="true" />
                )}
                <div className={styles.overlay} aria-hidden="true" />
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{setor.titulo}</h2>
                  <span className={styles.cardMeta}>
                    {total > 0
                      ? `${total} ${total === 1 ? t.projeto : t.projetos}`
                      : t.emBreve}
                  </span>
                </div>
              </div>
            )

            // Setor ainda sem projeto não vira link: levaria a uma página vazia.
            return total > 0 ? (
              <Link
                key={slug}
                href={`/projetos-entregues/${slug}`}
                className={`${styles.card} ${styles.cardLink}`}
              >
                {miolo}
              </Link>
            ) : (
              <div key={slug} className={`${styles.card} ${styles.cardVazio}`}>
                {miolo}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
