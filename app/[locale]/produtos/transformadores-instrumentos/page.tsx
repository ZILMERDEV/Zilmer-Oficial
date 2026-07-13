import Image from 'next/image'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import { cdnUrl } from '@/lib/assets'
import { tpInternosModels } from './tp-internos-data'
import { tpExternosModels } from './tp-externos-data'
import { tcInternosModels } from './tc-internos-data'
import { tcExternosModels } from './tc-externos-data'
import { getLocale } from 'next-intl/server'

export default async function TransformadoresInstrumentosPage() {
  const locale = await getLocale()
  const isEn = locale === 'en'

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{locale === 'en' ? 'Instrument Transformers' : locale === 'es' ? 'Transformadores para Instrumentos' : 'Transformadores para Instrumentos'}</h1>
        <div className={styles.content}>
          <div className={styles.intro}>
            <p>
              {locale === 'en'
                ? 'Instrument transformers are essential equipment for measurement, protection and control of electrical systems. Our potential transformers (PT) and current transformers (CT) are manufactured with high precision and reliability, ensuring accurate measurements and adequate protection of equipment.'
                : locale === 'es'
                ? 'Los transformadores para instrumentos son equipos esenciales para medición, protección y control de sistemas eléctricos. Nuestros transformadores de tensión (TP) y transformadores de corriente (TC) son fabricados con alta precisión y confiabilidad, garantizando mediciones precisas y protección adecuada de los equipos.'
                : 'Transformadores para instrumentos são equipamentos essenciais para medição, proteção e controle de sistemas elétricos. Nossos transformadores de potencial (TP) e transformadores de corrente (TC) são fabricados com alta precisão e confiabilidade, garantindo medições precisas e proteção adequada dos equipamentos.'}
            </p>
          </div>

          <div className={styles.categories}>
            <div className={styles.category}>
              <h2>{locale === 'en' ? 'PT (Potential Transformers)' : locale === 'es' ? 'TP (Transformadores de Tensión)' : 'TP (Transformadores de Potencial)'}</h2>

              <div className={styles.usageSection}>
                <h3>{locale === 'en' ? 'Indoor Use' : locale === 'es' ? 'Uso Interior' : 'Uso Interno'}</h3>
                <p className={styles.usageDescription}>
                  {locale === 'en'
                    ? 'Potential transformers for indoor installation in substations, electrical panels and distribution switchgear, designed for protected environments, ensuring high precision and reliability in voltage measurements.'
                    : locale === 'es'
                    ? 'Transformadores de tensión para instalación interior en subestaciones, tableros eléctricos y celdas de distribución, diseñados para ambientes protegidos, garantizando alta precisión y confiabilidad en las mediciones de tensión.'
                    : 'Transformadores de potencial para instalação interna em subestações, painéis elétricos e quadros de distribuição, projetados para ambientes protegidos, garantindo alta precisão e confiabilidade nas medições de tensão.'}
                </p>
                
                <div className={styles.modelsGallery}>
                  {tpInternosModels.map((model) => (
                    <Link
                      key={model.id}
                      href={model.pdf ? cdnUrl(model.pdf) : '#'}
                      className={styles.modelCard}
                      target={model.pdf ? '_blank' : undefined}
                      rel={model.pdf ? 'noopener noreferrer' : undefined}
                    >
                      <div className={styles.modelImageContainer}>
                        <Image
                          src={cdnUrl(model.image)}
                          alt={`Modelo ${model.name}`}
                          width={200}
                          height={200}
                          className={styles.modelImage}
                        />
                      </div>
                      <div className={styles.modelName}>{model.name}</div>
                      {model.pdf && (
                        <div className={styles.pdfBadge}>PDF</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className={styles.usageSection}>
                <h3>{locale === 'en' ? 'Outdoor Use' : locale === 'es' ? 'Uso Exterior' : 'Uso Externo'}</h3>
                <p className={styles.usageDescription}>
                  {locale === 'en'
                    ? 'Potential transformers for outdoor installation, developed with adequate protection against weathering, humidity and climatic variations, maintaining high precision even in adverse environmental conditions.'
                    : locale === 'es'
                    ? 'Transformadores de tensión para instalación exterior, desarrollados con protección adecuada contra intemperies, humedad y variaciones climáticas, manteniendo alta precisión incluso en condiciones ambientales adversas.'
                    : 'Transformadores de potencial para instalação externa, desenvolvidos com proteção adequada contra intempéries, umidade e variações climáticas, mantendo alta precisão mesmo em condições ambientais adversas.'}
                </p>
                
                <div className={styles.modelsGallery}>
                  {tpExternosModels.map((model) => (
                    <Link
                      key={model.id}
                      href={model.pdf ? cdnUrl(model.pdf) : '#'}
                      className={styles.modelCard}
                      target={model.pdf ? '_blank' : undefined}
                      rel={model.pdf ? 'noopener noreferrer' : undefined}
                    >
                      <div className={styles.modelImageContainer}>
                        <Image
                          src={cdnUrl(model.image)}
                          alt={`Modelo ${model.name}`}
                          width={200}
                          height={200}
                          className={styles.modelImage}
                        />
                      </div>
                      <div className={styles.modelName}>{model.name}</div>
                      {model.pdf && (
                        <div className={styles.pdfBadge}>PDF</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.category}>
              <h2>{locale === 'en' ? 'CT (Current Transformers)' : locale === 'es' ? 'TC (Transformadores de Corriente)' : 'TC (Transformadores de Corrente)'}</h2>

              <div className={styles.usageSection}>
                <h3>{locale === 'en' ? 'Indoor Use' : locale === 'es' ? 'Uso Interior' : 'Uso Interno'}</h3>
                <p className={styles.usageDescription}>
                  {locale === 'en'
                    ? 'Current transformers for indoor installation in substations, electrical panels and distribution switchgear, offering precise current measurement for protection, control and energy metering systems.'
                    : locale === 'es'
                    ? 'Transformadores de corriente para instalación interior en subestaciones, tableros eléctricos y celdas de distribución, que ofrecen medición precisa de corriente para sistemas de protección, control y medición energética.'
                    : 'Transformadores de corrente para instalação interna em subestações, painéis elétricos e quadros de distribuição, oferecendo medição precisa de corrente para sistemas de proteção, controle e medição energética.'}
                </p>
                
                <div className={styles.modelsGallery}>
                  {tcInternosModels.map((model) => (
                    <Link
                      key={model.id}
                      href={model.pdf ? cdnUrl(model.pdf) : '#'}
                      className={styles.modelCard}
                      target={model.pdf ? '_blank' : undefined}
                      rel={model.pdf ? 'noopener noreferrer' : undefined}
                    >
                      <div className={styles.modelImageContainer}>
                        <Image
                          src={cdnUrl(model.image)}
                          alt={`Modelo ${model.name}`}
                          width={200}
                          height={200}
                          className={styles.modelImage}
                        />
                      </div>
                      <div className={styles.modelName}>{model.name}</div>
                      {model.pdf && (
                        <div className={styles.pdfBadge}>PDF</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className={styles.usageSection}>
                <h3>{locale === 'en' ? 'Outdoor Use' : locale === 'es' ? 'Uso Exterior' : 'Uso Externo'}</h3>
                <p className={styles.usageDescription}>
                  {locale === 'en'
                    ? 'Current transformers for outdoor installation, designed with robust protection against weathering and adverse climatic conditions, ensuring precise and reliable measurements even in external environments.'
                    : locale === 'es'
                    ? 'Transformadores de corriente para instalación exterior, diseñados con protección robusta contra intemperies y condiciones climáticas adversas, garantizando mediciones precisas y confiables incluso en ambientes exteriores.'
                    : 'Transformadores de corrente para instalação externa, projetados com proteção robusta contra intempéries e condições climáticas adversas, garantindo medições precisas e confiáveis mesmo em ambientes externos.'}
                </p>
                
                <div className={styles.modelsGallery}>
                  {tcExternosModels.map((model) => (
                    <Link
                      key={model.id}
                      href={model.pdf ? cdnUrl(model.pdf) : '#'}
                      className={styles.modelCard}
                      target={model.pdf ? '_blank' : undefined}
                      rel={model.pdf ? 'noopener noreferrer' : undefined}
                    >
                      <div className={styles.modelImageContainer}>
                        <Image
                          src={cdnUrl(model.image)}
                          alt={`Modelo ${model.name}`}
                          width={200}
                          height={200}
                          className={styles.modelImage}
                        />
                      </div>
                      <div className={styles.modelName}>{model.name}</div>
                      {model.pdf && (
                        <div className={styles.pdfBadge}>PDF</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

