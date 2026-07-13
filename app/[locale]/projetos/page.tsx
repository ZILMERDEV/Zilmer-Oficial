'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import { useLocale } from 'next-intl'
import { cdnUrl } from '@/lib/assets'

const projetosPt = [
  {
    id: '1',
    title: 'Projeto em Operação - Hidrelétrica',
    description: 'Transformadores de força para sistema de geração de energia hidrelétrica continuam operando com máxima eficiência e confiabilidade.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-hidreletrica',
  },
  {
    id: '2',
    title: 'Novo Projeto Aplicado - Subestação Industrial',
    description: 'Solução completa em transformadores para subestação de grande porte recém-instalada e em fase de testes.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-subestacao',
  },
  {
    id: '3',
    title: 'Projeto em Operação - Mineração',
    description: 'Transformadores robustos para operação em ambiente de mineração mantendo alta performance e durabilidade.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-mineracao',
  },
]

const projetosEn = [
  {
    id: '1',
    title: 'Project in Operation – Hydropower',
    description: 'Power transformers for a hydropower generation system continue operating with maximum efficiency and reliability.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-hidreletrica',
  },
  {
    id: '2',
    title: 'New Applied Project – Industrial Substation',
    description: 'Complete transformer solution for a large-scale substation recently installed and under commissioning.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-subestacao',
  },
  {
    id: '3',
    title: 'Project in Operation – Mining',
    description: 'Robust transformers for operation in a mining environment, maintaining high performance and durability.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-mineracao',
  },
]

const projetosEs = [
  {
    id: '1',
    title: 'Proyecto en Operación – Hidroeléctrica',
    description: 'Los transformadores de fuerza para un sistema de generación de energía hidroeléctrica continúan operando con máxima eficiencia y confiabilidad.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-hidreletrica',
  },
  {
    id: '2',
    title: 'Nuevo Proyecto Aplicado – Subestación Industrial',
    description: 'Solución integral en transformadores para una subestación de gran envergadura recientemente instalada y en fase de puesta en servicio.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-subestacao',
  },
  {
    id: '3',
    title: 'Proyecto en Operación – Minería',
    description: 'Transformadores robustos para operación en entorno minero, manteniendo alto rendimiento y durabilidad.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-mineracao',
  },
]

export default function ProjetosPage() {
  const locale = useLocale()
  const isEn = locale === 'en'
  const projetos = locale === 'en' ? projetosEn : locale === 'es' ? projetosEs : projetosPt

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{locale === 'en' ? 'Projects' : locale === 'es' ? 'Proyectos' : 'Projetos'}</h1>
          <p className={styles.subtitle}>
            {locale === 'en'
              ? 'Follow our projects in operation and the latest news on recent installations.'
              : locale === 'es'
              ? 'Conozca nuestros proyectos en operación y las novedades sobre instalaciones recientes.'
              : 'Acompanhe nossos projetos em operação e as novidades sobre instalações recentes.'}
          </p>
        </div>

        <div className={styles.grid}>
          {projetos.map((projeto) => (
            <article key={projeto.id} className={styles.card}>
              <Link href={`/projetos/${projeto.slug}`} className={styles.cardLink}>
                <div className={styles.imageContainer}>
                  <Image
                    src={cdnUrl(projeto.image)}
                    alt={projeto.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{projeto.title}</h2>
                  <p className={styles.cardDescription}>{projeto.description}</p>
                  <span className={styles.readMore}>{locale === 'en' ? 'Read more →' : locale === 'es' ? 'Leer más →' : 'Leia mais →'}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
