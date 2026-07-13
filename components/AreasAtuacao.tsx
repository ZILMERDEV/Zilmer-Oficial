'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import styles from './AreasAtuacao.module.css'
import areasDataPtJson from '@/data/areas.json'
import areasDataEnJson from '@/data/areas.en.json'
// @ts-ignore
import areasDataEsJson from '@/data/areas.es.json'
import { useLocale } from 'next-intl'

/* ── Auto-mapped from /images/areas/backgrounds/ filenames ── */
const BACKGROUNDS: Record<string, string> = {
  'transporte':          '/images/areas/backgrounds/transporte.webp',
  'hidreletrica':        '/images/areas/backgrounds/hidreletrica.webp',
  'mineracao':           '/images/areas/backgrounds/mineracao.jpg',
  'subestacoes':         '/images/areas/backgrounds/subestacoes.webp',
  'energias-renovaveis': '/images/areas/backgrounds/energias-renovaveis.jpg',
  'controle-medicao':    '/images/areas/backgrounds/controle-medicao.webp',
}

/* ── Auto-mapped from /images/areas/transformers/ filenames ── */
const TRANSFORMERS: Record<string, string[]> = {
  'transporte':          ['/images/areas/transformers/transporte.png'],
  'hidreletrica':        ['/images/areas/transformers/hidreletrica.png'],
  'mineracao':           ['/images/areas/transformers/mineracao.png'],
  'subestacoes':         ['/images/areas/transformers/subestacoes.png'],
  'energias-renovaveis': ['/images/areas/transformers/energias-renovaveis.png'],
  'controle-medicao':    ['/images/areas/transformers/controle-e-medicao.png'],
}

/* Overlay per slide — extracted from screenshot analysis */
const OVERLAYS: Record<string, string> = {
  'transporte':          'linear-gradient(to right, rgba(0,10,50,0.80) 0%, rgba(0,10,50,0.55) 40%, rgba(0,10,50,0.20) 100%)',
  'hidreletrica':        'linear-gradient(to right, rgba(0,10,50,0.85) 0%, rgba(0,10,50,0.60) 45%, rgba(0,10,50,0.30) 100%)',
  'mineracao':           'linear-gradient(to right, rgba(0,10,40,0.82) 0%, rgba(0,10,40,0.50) 42%, rgba(0,10,40,0.10) 100%)',
  'subestacoes':         'linear-gradient(to right, rgba(0,10,50,0.80) 0%, rgba(0,10,50,0.50) 40%, rgba(0,10,50,0.15) 100%)',
  'energias-renovaveis': 'linear-gradient(to right, rgba(0,10,40,0.78) 0%, rgba(0,10,40,0.45) 42%, rgba(0,10,40,0.08) 100%)',
  'controle-medicao':    'linear-gradient(to right, rgba(0,0,20,0.75) 0%, rgba(0,0,20,0.55) 50%, rgba(0,0,20,0.35) 100%)',
}

const ORDERED_SLUGS = [
  'transporte',
  'hidreletrica',
  'mineracao',
  'subestacoes',
  'energias-renovaveis',
  'controle-medicao',
]

type AreasData = {
  [key: string]: {
    title: string
    aplicacao: { description: string; image: string; heroDescription?: string }
    solucao: { problem: string; melhora: string; essencial: string }
  }
}

function stripHtml(text?: string) {
  return text ? text.replace(/<[^>]+>/g, '').trim() : ''
}

export default function AreasAtuacao() {
  const locale = useLocale()
  const areasData = (
    locale === 'en' ? areasDataEnJson :
    locale === 'es' ? areasDataEsJson :
    areasDataPtJson
  ) as AreasData

  const slides = ORDERED_SLUGS
    .map(slug => ({ slug, data: areasData[slug] }))
    .filter(s => !!s.data)

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setActive(i => (i + 1) % slides.length), [slides.length])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 3000)
    return () => clearInterval(t)
  }, [paused, next])

  if (!slides.length) return null

  const act = (fn: () => void) => {
    setPaused(true)
    fn()
    setTimeout(() => setPaused(false), 6000)
  }

  const { slug, data } = slides[active]
  const lead = stripHtml((data.aplicacao as any).heroDescription) || stripHtml(data.aplicacao.description).split('\n')[0]
  const transformers = TRANSFORMERS[slug] ?? []

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Backgrounds stacked with fade */}
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.slug}
            src={BACKGROUNDS[s.slug]}
            alt=""
            aria-hidden="true"
            className={styles.bg}
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}

        {/* Per-slide overlay */}
        <div className={styles.overlay} style={{ background: OVERLAYS[slug] }} />

        {/* Left content */}
        <div className={styles.content}>

          {/* Header */}
          <div className={styles.header}>
            <span className={styles.eyebrow}>Segmentos de Mercado</span>
            <h2 className={styles.heading}>Áreas de Atuação</h2>
            <p className={styles.subtitle}>
              Transformadores de alta performance para os principais setores da indústria
            </p>
          </div>

          {/* Tabs */}
          <nav className={styles.tabs} onMouseLeave={() => setPaused(false)}>
            {slides.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                onMouseEnter={() => { setPaused(true); setActive(i); }}
                className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
              >
                {s.data.title}
              </Link>
            ))}
          </nav>

          {/* Area text */}
          <div className={styles.text}>
            <h3 className={styles.areaTitle}>{data.title}</h3>
            <p className={styles.lead}>{lead}</p>
            <div className={styles.bullets}>
              <p>{data.solucao.problem}</p>
              <p>{data.solucao.melhora}</p>
              <p>{data.solucao.essencial}</p>
            </div>
            <Link href={`/${slug}`} className={styles.cta}>
              Ver detalhes da área ›
            </Link>
          </div>

        </div>

        {/* Transformer(s) — absolute bottom-right */}
        {transformers.length > 0 && (
          <div className={styles.transformers} key={slug}>
            {transformers.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                aria-hidden="true"
                className={styles.transformerImg}
              />
            ))}
          </div>
        )}

        {/* Arrows */}
        <button className={`${styles.arrow} ${styles.prev}`} onClick={() => act(() => setActive(i => (i - 1 + slides.length) % slides.length))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button className={`${styles.arrow} ${styles.next_}`} onClick={() => act(next)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Dots */}
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} onClick={() => act(() => setActive(i))} />
          ))}
        </div>

      </div>
    </section>
  )
}
