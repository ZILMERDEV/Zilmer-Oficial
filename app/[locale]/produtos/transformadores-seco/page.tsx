import Image from 'next/image'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import { cdnUrl } from '@/lib/assets'
import { unstable_noStore as noStore } from 'next/cache'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getLocale } from 'next-intl/server'

// Forçar atualização dinâmica para sempre buscar dados atualizados
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Função para ler o JSON diretamente do arquivo (sem cache)
function getProdutosData(locale: string) {
  noStore()
  try {
    const fileName = locale === 'en' ? 'produtos.en.json' : locale === 'es' ? 'produtos.es.json' : 'produtos.json'
    const filePath = join(process.cwd(), 'data', fileName)
    const fileContents = readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Erro ao ler produtos.json:', error)
    return { seco: { produtos: {} } }
  }
}

export default async function TransformadoresSecoPage() {
  noStore()
  const locale = await getLocale()
  const isEn = locale === 'en'
  const produtosData = getProdutosData(locale)
  const produtos = produtosData.seco?.produtos || {}
  
  // Mapear produtos para seus slugs e imagens padrão
  const produtosMap: { [key: string]: { slug: string; defaultImage: string } } = {
    'para-retificadores': {
      slug: 'para-retificadores',
      defaultImage: '/images/produtos/seco/retificadores/TAM - SIEMENS - 4700 kVA v1.png'
    },
    'aterramento': {
      slug: 'aterramento',
      defaultImage: '/images/produtos/seco/aterramento/TAM - ÍCONE TECNOLOGIA - 500 kVA.png'
    },
    'baixa-tensao': {
      slug: 'baixa-tensao',
      defaultImage: '/images/produtos/seco/baixa-tensao/TAI - PETROBRAS - 30 kVA SEM TAMPA.png'
    },
    'reatores-de-partida': {
      slug: 'reatores-de-partida',
      defaultImage: '/images/produtos/seco/reatores-de-partida/RPM - 1700 HP.png'
    }
  }

  const getProductImage = (key: string): string => {
    const produto = produtos && key in produtos ? produtos[key as keyof typeof produtos] : null
    if (produto && (produto as any).image) {
      return (produto as any).image
    }
    return produtosMap[key]?.defaultImage || '/images/produtos/seco/default.png'
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{locale === 'en' ? 'Dry-Type Transformers' : locale === 'es' ? 'Transformadores Tipo Seco' : 'Transformadores a Seco'}</h1>
        <div className={styles.content}>
          <div className={styles.intro}>
            <p>
              {getProdutosData(locale).seco?.intro?.description ||
                (locale === 'en' ? 'Epoxy resin cast dry-type transformers are the ideal solution for applications requiring safety, low maintenance and indoor installation. Our transformers offer high reliability and superior performance across diverse industrial applications.' : locale === 'es' ? 'Los transformadores tipo seco moldeados en resina epoxi son la solución ideal para aplicaciones que exigen seguridad, bajo mantenimiento e instalación en ambientes interiores. Nuestros transformadores ofrecen alta confiabilidad y desempeño superior en diversas aplicaciones industriales.' : 'Transformadores a seco moldados em resina epóxi são a solução ideal para aplicações que exigem segurança, baixa manutenção e instalação em ambientes internos. Nossos transformadores oferecem alta confiabilidade e desempenho superior em diversas aplicações industriais.')}
            </p>
          </div>

          <div className={styles.featuredProducts}>
            <Link href="/produtos/transformadores-seco/media-tensao" className={styles.featuredCardSingle}>
              {(() => {
                // Buscar imagem de média tensão - sempre buscar do JSON atualizado
                const currentData = getProdutosData(locale)
                const mediaTensao = currentData.seco?.produtos?.['media-tensao' as keyof typeof currentData.seco.produtos] as any
                const mediaTensaoImage = mediaTensao?.image || mediaTensao?.images?.[0] || null
                return mediaTensaoImage ? (
                  <div className={styles.featuredImage}>
                    <Image
                      src={cdnUrl(mediaTensaoImage)}
                      alt="Transformadores de Média Tensão"
                      width={500}
                      height={300}
                      className={styles.featuredImageContent}
                      key={mediaTensaoImage} // Force re-render quando imagem mudar
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                ) : null
              })()}
              <h3>{locale === 'en' ? 'Medium-Voltage Transformers' : locale === 'es' ? 'Transformadores de Media Tensión' : 'Transformadores de Média Tensão'}</h3>
              <p>15{locale === 'en' ? ' to' : locale === 'es' ? ' a' : ' a'} 36 kV {locale === 'en' ? 'up to' : locale === 'es' ? 'hasta' : 'até'} 20 MVA</p>
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {Object.keys(produtosMap).map((key) => {
              const produto = produtos && key in produtos ? produtos[key as keyof typeof produtos] : null
              const produtoMap = produtosMap[key]
              if (!produto) return null
              
              return (
                <Link key={key} href={`/produtos/transformadores-seco/${produtoMap.slug}`} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <Image
                      src={cdnUrl(getProductImage(key))}
                      alt={produto.title || produtoMap.slug}
                      fill
                      className={styles.productImageContent}
                    />
                  </div>
                  <h3>{produto.title || produtoMap.slug}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
