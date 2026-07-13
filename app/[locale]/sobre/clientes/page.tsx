import Image from 'next/image'
import styles from './page.module.css'
import { cdnUrl } from '@/lib/assets'
// @ts-ignore
import sobreDataPt from '@/data/sobre.json'
// @ts-ignore
import sobreDataEn from '@/data/sobre.en.json'
// @ts-ignore
import sobreDataEs from '@/data/sobre.es.json'
import { getLocale } from 'next-intl/server'

function renderText(text: string | undefined | null) {
  if (!text) return <p></p>
  const hasHTML = /<[^>]+>/.test(text)
  if (hasHTML) return <div dangerouslySetInnerHTML={{ __html: text }} />
  return <p>{text}</p>
}

export default async function ClientesPage() {
  const locale = await getLocale()
  const sobreData = (locale === 'en' ? sobreDataEn : locale === 'es' ? sobreDataEs : sobreDataPt) as {
    clientes: { title: string; description: string; image?: string }
  }
  const { clientes } = sobreData
  const imagePath = clientes.image || null

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{clientes.title}</h1>
        <div className={styles.content}>
          {renderText(clientes.description)}

          {imagePath ? (
            <div className={styles.imageContainer}>
              <Image
                src={cdnUrl(imagePath)}
                alt="Nossos Clientes"
                width={1200}
                height={800}
                className={styles.clientImage}
                priority
              />
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Adicione a imagem dos clientes pelo painel admin em <strong>Sobre → Clientes → Imagem dos Clientes</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
