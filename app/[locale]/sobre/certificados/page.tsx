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

interface CertificadoItem { file: string; title: string; type: string }

function renderText(text: string | undefined | null) {
  if (!text) return <p></p>
  const hasHTML = /<[^>]+>/.test(text)
  if (hasHTML) return <div dangerouslySetInnerHTML={{ __html: text }} />
  return <p>{text}</p>
}

export default async function CertificadosPage() {
  const locale = await getLocale()
  const sobreData = (locale === 'en' ? sobreDataEn : locale === 'es' ? sobreDataEs : sobreDataPt) as {
    certificados: { title: string; description: string; items?: CertificadoItem[] }
  }
  const { certificados } = sobreData
  const items: CertificadoItem[] = certificados.items || []
  const openPdfLabel = locale === 'en' ? 'Open PDF' : 'Abrir PDF'

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{certificados.title}</h1>
        <div className={styles.content}>
          {renderText(certificados.description)}

          {items.length > 0 ? (
            <div className={styles.gallery}>
              {items.map((item, index) => (
                <div key={index} className={styles.certificadoCard}>
                  {item.type === 'pdf' ? (
                    <div className={styles.pdfContainer}>
                      <iframe
                        src={cdnUrl(`/images/certificados/${item.file}`)}
                        className={styles.pdfViewer}
                        title={item.title}
                      />
                      <a
                        href={cdnUrl(`/images/certificados/${item.file}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pdfLink}
                      >
                        {item.title} ({openPdfLabel})
                      </a>
                    </div>
                  ) : (
                    <Image
                      src={cdnUrl(`/images/certificados/${item.file}`)}
                      alt={item.title || `Certificado ${index + 1}`}
                      width={400}
                      height={560}
                      className={styles.certificadoImage}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Adicione certificados pelo painel admin em <strong>Sobre → Certificados → Certificados (PDFs / Imagens)</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
