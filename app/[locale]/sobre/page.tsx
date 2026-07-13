import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import { readFile } from 'fs/promises'
import { join } from 'path'

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

function renderText(text: string | undefined | null) {
  if (!text) return null
  const plain = stripHtml(text)
  if (!plain) return null
  return (
    <>
      {plain.split('\n\n').filter(p => p.trim()).map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </>
  )
}

export default async function SobrePage() {
  const t = await getTranslations('about')

  let principalImage = '/images/sobre/transformadores-instalacao.jpg'
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'sobre.json'), 'utf-8')
    const data = JSON.parse(raw)
    principalImage = data.principal?.image || principalImage
  } catch {}

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>TESTE DE CI/CD - {t('title')}</h1>
        <div className={styles.content}>
          <div className={styles.intro}>
            {renderText(t('intro'))}
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img
                src={principalImage}
                alt="Transformadores Zilmer em instalação industrial"
                className={styles.heroImage}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <Link href="/sobre/historico" className={styles.card}>
              <h3>{t('cards.history.title')}</h3>
              <p>{t('cards.history.description')}</p>
            </Link>

            <Link href="/sobre/clientes" className={styles.card}>
              <h3>{t('cards.clients.title')}</h3>
              <p>{t('cards.clients.description')}</p>
            </Link>

            <Link href="/sobre/certificados" className={styles.card}>
              <h3>{t('cards.certificates.title')}</h3>
              <p>{t('cards.certificates.description')}</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

