'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'

export default function ProdutosPage() {
  const t = useTranslations('products')
  
  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{t('pageTitle')}</h1>
        <p className={styles.subtitle}>
          {t('pageSubtitle')}
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>{t('oilImmersed.title')}</h2>
            <ul>
              <li>{t('oilImmersed.forRectifiers')}</li>
              <li>{t('oilImmersed.forFurnaces')}</li>
              <li>{t('oilImmersed.starting')}</li>
              <li>{t('oilImmersed.grounding')}</li>
              <li>{t('oilImmersed.autotransformers')}</li>
              <li>{t('oilImmersed.reactors')}</li>
            </ul>
            <Link href="/produtos/transformadores-oleo" className="btn">
              {t('oilImmersed.viewDetails')}
            </Link>
          </div>

          <div className={styles.card}>
            <h2>{t('dryType.title')}</h2>
            <ul>
              <li>{t('dryType.forRectifiers')}</li>
              <li>{t('dryType.grounding')}</li>
              <li>{t('dryType.lowVoltage')}</li>
            </ul>
            <Link href="/produtos/transformadores-seco" className="btn">
              {t('dryType.viewDetails')}
            </Link>
          </div>

          <div className={styles.card}>
            <h2>{t('instrument.title')}</h2>
            <div className={styles.instrumentos}>
              <div>
                <h3>{t('instrument.potentialTransformers')}</h3>
                <ul>
                  <li>{t('instrument.internalUse')}</li>
                  <li>{t('instrument.externalUse')}</li>
                </ul>
              </div>
              <div>
                <h3>{t('instrument.currentTransformers')}</h3>
                <ul>
                  <li>{t('instrument.internalUse')}</li>
                  <li>{t('instrument.externalUse')}</li>
                </ul>
              </div>
            </div>
            <Link href="/produtos/transformadores-instrumentos" className="btn">
              {t('instrument.viewDetails')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}






























