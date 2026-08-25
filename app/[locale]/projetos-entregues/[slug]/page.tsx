'use client'

import { useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import ContactButton from '@/components/ContactButton'
import styles from './page.module.css'

import dataPt from '@/data/projetos-entregues.json'
import dataEn from '@/data/projetos-entregues.en.json'
import dataEs from '@/data/projetos-entregues.es.json'

type Projeto = {
  titulo: string
  cliente: string
  parceiros: string[]
  local: string
  setor: string
  ano: string
  resumoCard: string
  descricao: string
  especificacoes: string[]
  normas: string[]
  imagemCapa: string
  imagens: string[]
}

type ProjetosData = { [slug: string]: Projeto }

export default function ProjetoEntregueDetalhe({ params }: { params: { slug: string } }) {
  const locale = useLocale()
  const data = (
    locale === 'en' ? dataEn : locale === 'es' ? dataEs : dataPt
  ) as ProjetosData

  const projeto = data[params.slug]
  const [indiceAtual, setIndiceAtual] = useState(0)

  if (!projeto) notFound()

  const imagens = projeto.imagens.length ? projeto.imagens : [projeto.imagemCapa]
  const temVariasImagens = imagens.length > 1

  const t = {
    voltar:
      locale === 'en' ? '← All projects' : locale === 'es' ? '← Todos los proyectos' : '← Todos os projetos',
    cliente: locale === 'en' ? 'Client' : locale === 'es' ? 'Cliente' : 'Cliente',
    local: locale === 'en' ? 'Location' : locale === 'es' ? 'Ubicación' : 'Local',
    ano: locale === 'en' ? 'Year' : locale === 'es' ? 'Año' : 'Ano',
    setor: locale === 'en' ? 'Sector' : locale === 'es' ? 'Sector' : 'Setor',
    parceiros: locale === 'en' ? 'Partners' : locale === 'es' ? 'Socios' : 'Parceiros',
    especificacoes:
      locale === 'en' ? 'Technical specifications' : locale === 'es' ? 'Especificaciones técnicas' : 'Especificações técnicas',
    normas: locale === 'en' ? 'Standards applied' : locale === 'es' ? 'Normas aplicadas' : 'Normas aplicadas',
    ctaTitle:
      locale === 'en'
        ? 'Need a solution like this one?'
        : locale === 'es'
        ? '¿Necesita una solución como esta?'
        : 'Precisa de uma solução como esta?',
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <Link href="/projetos-entregues" className={styles.voltar}>
            {t.voltar}
          </Link>

          <h1 className={styles.titulo}>{projeto.titulo}</h1>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t.cliente}</span>
              <span className={styles.metaValue}>{projeto.cliente}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t.local}</span>
              <span className={styles.metaValue}>{projeto.local}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t.setor}</span>
              <span className={styles.metaValue}>{projeto.setor}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t.ano}</span>
              <span className={styles.metaValue}>{projeto.ano}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.corpo}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.galeria}>
              <div className={styles.imageWrapper}>
                <Image
                  src={imagens[indiceAtual]}
                  alt={`${projeto.titulo} — foto ${indiceAtual + 1}`}
                  fill
                  className={styles.imagem}
                  sizes="(max-width: 968px) 100vw, 55vw"
                  priority
                />

                {temVariasImagens && (
                  <>
                    <button
                      className={styles.setaEsquerda}
                      onClick={() => setIndiceAtual((p) => (p - 1 + imagens.length) % imagens.length)}
                      aria-label={locale === 'en' ? 'Previous image' : locale === 'es' ? 'Imagen anterior' : 'Imagem anterior'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      className={styles.setaDireita}
                      onClick={() => setIndiceAtual((p) => (p + 1) % imagens.length)}
                      aria-label={locale === 'en' ? 'Next image' : locale === 'es' ? 'Imagen siguiente' : 'Próxima imagem'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    <div className={styles.indicadores}>
                      {imagens.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.ponto} ${i === indiceAtual ? styles.pontoAtivo : ''}`}
                          onClick={() => setIndiceAtual(i)}
                          aria-label={`${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {projeto.parceiros?.length > 0 && (
                <div className={styles.parceirosBox}>
                  <span className={styles.metaLabel}>{t.parceiros}</span>
                  <p className={styles.parceirosTexto}>{projeto.parceiros.join(' · ')}</p>
                </div>
              )}
            </div>

            <div className={styles.conteudo}>
              {projeto.descricao.split('\n\n').map((paragrafo, i) => (
                <p key={i} className={styles.paragrafo}>
                  {paragrafo}
                </p>
              ))}

              {projeto.especificacoes?.length > 0 && (
                <div className={styles.bloco}>
                  <h2 className={styles.blocoTitulo}>{t.especificacoes}</h2>
                  <ul className={styles.listaEspecs}>
                    {projeto.especificacoes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {projeto.normas?.length > 0 && (
                <div className={styles.bloco}>
                  <h2 className={styles.blocoTitulo}>{t.normas}</h2>
                  <div className={styles.tagRow}>
                    {projeto.normas.map((norma, i) => (
                      <span key={i} className={styles.tag}>
                        {norma}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitulo}>{t.ctaTitle}</h2>
          <ContactButton />
        </div>
      </section>
    </div>
  )
}
