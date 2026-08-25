'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import styles from './XRaySection.module.css'
import { useLocale } from 'next-intl'
import { cdnUrl } from '@/lib/assets'

interface LocalizedText { pt: string; en: string; es: string }
interface XrayStat { number: string; label: LocalizedText }
interface XrayData {
  tagline: LocalizedText
  headline: LocalizedText
  accentWord: LocalizedText
  subtitle: LocalizedText
  stats: XrayStat[]
}

const DEFAULT_DATA: XrayData = {
  tagline: { pt: 'TECNOLOGIA ZILMER', en: 'ZILMER TECHNOLOGY', es: 'TECNOLOGÍA ZILMER' },
  headline: { pt: 'ENGENHARIA', en: 'PRECISION', es: 'INGENIERÍA' },
  accentWord: { pt: 'DE PRECISÃO', en: 'ENGINEERING', es: 'DE PRECISIÓN' },
  subtitle: {
    pt: 'Cada transformador é projetado com rigor técnico absoluto. Componentes internos selecionados ao milímetro, testados sob as normas mais exigentes para garantir décadas de operação confiável.',
    en: 'Each transformer is engineered with absolute technical rigour. Internal components selected to the millimetre, tested under the most demanding standards to guarantee decades of reliable operation.',
    es: 'Cada transformador es diseñado con rigor técnico absoluto. Componentes internos seleccionados al milímetro, probados bajo las normas más exigentes para garantizar décadas de operación confiable.',
  },
  stats: [
    { number: '60+', label: { pt: 'anos de experiência', en: 'years of experience', es: 'años de experiencia' } },
    { number: 'ISO', label: { pt: 'certificação internacional', en: 'international certification', es: 'certificación internacional' } },
    { number: '100%', label: { pt: 'testado em fábrica', en: 'factory tested', es: 'probado en fábrica' } },
  ],
}

export default function XRaySection() {
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [xrayData, setXrayData] = useState<XrayData>(DEFAULT_DATA)

  useEffect(() => {
    fetch('/api/admin/xray')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setXrayData(d) })
      .catch(() => {})
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => { setIsHovering(false) }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const touch = e.touches[0]
    if (!rect || !touch) return
    setCursor({ x: touch.clientX - rect.left, y: touch.clientY - rect.top })
    setIsHovering(true)
  }, [])

  const handleTouchEnd = useCallback(() => setIsHovering(false), [])

  /* mask-image: 'none' significa NENHUMA máscara aplicada — a camada fica
     TOTALMENTE VISÍVEL, não escondida. Com a camada revelada por cima da
     base (correção de z-index abaixo), isso fazia o interior aparecer por
     inteiro mesmo sem hover. Raio 0 é o que de fato esconde a camada. */
  const mask = isHovering
    ? `radial-gradient(circle 130px at ${cursor.x}px ${cursor.y}px, black 0%, black 55%, transparent 100%)`
    : `radial-gradient(circle 0px at ${cursor.x}px ${cursor.y}px, black 0%, transparent 0%)`

  const lang: keyof LocalizedText = locale === 'en' ? 'en' : locale === 'es' ? 'es' : 'pt'

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left: text */}
        <div className={styles.textSide}>
          <div className={styles.tagline}>{xrayData.tagline[lang]}</div>
          <h2 className={styles.headline}>
            {xrayData.headline[lang]}<br />
            <span className={styles.accentWord}>{xrayData.accentWord[lang]}</span>
          </h2>
          <p className={styles.subtitle}>{xrayData.subtitle[lang]}</p>

          <div className={styles.statsRow}>
            {xrayData.stats.flatMap((stat, i) => [
              i > 0 ? <div key={`div-${i}`} className={styles.statDivider} /> : null,
              <div key={`stat-${i}`} className={styles.stat}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label[lang]}</span>
              </div>,
            ])}
          </div>
        </div>

        {/* Right: xray viewer */}
        <div className={styles.viewerSide}>
          <div
            ref={containerRef}
            className={`${styles.viewer} ${isHovering ? styles.viewerActive : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Camada de base: transformador FECHADO — visível sem o mouse em
                cima. Os dois arquivos estavam trocados aqui (base carregava
                tco-interno, revelada carregava tco-externo — o inverso do
                pretendido). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cdnUrl("/images/xray/tco-externo.jpg")}
              alt="Transformador Zilmer fechado, vista externa"
              className={styles.imgBase}
              draggable={false}
            />

            {/* Camada revelada pela lupa: INTERIOR, com núcleo e bobinas
                visíveis — aparece só dentro do círculo sob o cursor. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cdnUrl("/images/xray/tco-interno.jpg")}
              alt="Vista interna do transformador: núcleo e bobinas"
              className={styles.imgReveal}
              style={{ WebkitMaskImage: mask, maskImage: mask }}
              draggable={false}
            />

            {/* Reticle overlay — follows cursor */}
            <div
              className={`${styles.reticle} ${isHovering ? styles.reticleVisible : ''}`}
              style={
                {
                  '--rx': `${cursor.x}px`,
                  '--ry': `${cursor.y}px`,
                } as React.CSSProperties
              }
            />

            {/* Corner scan-lines decoration */}
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />

            {/* Scan line animation */}
            <div className={`${styles.scanLine} ${isHovering ? styles.scanLineActive : ''}`} />
          </div>
        </div>
      </div>
    </section>
  )
}
