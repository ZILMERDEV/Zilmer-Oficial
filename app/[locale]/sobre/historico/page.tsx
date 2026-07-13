import Image from 'next/image'
import styles from './page.module.css'
// @ts-ignore
import sobreDataPt from '@/data/sobre.json'
// @ts-ignore
import sobreDataEn from '@/data/sobre.en.json'
// @ts-ignore
import sobreDataEs from '@/data/sobre.es.json'
import { cdnUrl } from '@/lib/assets'
import { getLocale } from 'next-intl/server'

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

export default async function HistoricoPage() {
  const locale = await getLocale()
  const sobreData = (locale === 'en' ? sobreDataEn : locale === 'es' ? sobreDataEs : sobreDataPt) as {
    historico: { title: string; subtitle: string; content: string; image?: string; imageCaption?: string }
  }
  const { historico } = sobreData
  const imagePath = historico.image || '/images/sobre/historico.jpg'
  const imageCaption = historico.imageCaption || 'ZILMER - 1962'

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{historico.title}</h1>
        <div className={styles.content}>
          <h2>{historico.subtitle}</h2>
          {renderText(historico.content)}
        </div>

        <figure className={styles.historicPhotoSection}>
          <Image
            src={cdnUrl(imagePath)}
            alt="Zilmer - Acervo Histórico"
            width={1085}
            height={1450}
            className={styles.historicImage}
          />
          <figcaption className={styles.historicCaption}>{imageCaption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
