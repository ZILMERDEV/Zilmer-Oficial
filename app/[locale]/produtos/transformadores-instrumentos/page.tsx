import { getLocale } from 'next-intl/server'
import styles from './page.module.css'
import { t } from './instrumentos-labels'

export default async function TransformadoresInstrumentosPage() {
  const locale = await getLocale()

  const textos = t(locale)

  return (
    <div>
      <h1 className={styles.titulo}>
        {locale === 'en'
          ? 'Instrument Transformers'
          : locale === 'es'
          ? 'Transformadores para Instrumentos'
          : 'Transformadores para Instrumentos'}
      </h1>
      <div className={styles.intro}>
        <p>
          {locale === 'en'
            ? 'Instrument transformers are essential equipment for measurement, protection and control of electrical systems. Our potential transformers (PT) and current transformers (CT) are manufactured with high precision and reliability, ensuring accurate measurements and adequate protection of equipment.'
            : locale === 'es'
            ? 'Los transformadores para instrumentos son equipos esenciales para medición, protección y control de sistemas eléctricos. Nuestros transformadores de tensión (TP) y transformadores de corriente (TC) son fabricados con alta precisión y confiabilidad, garantizando mediciones precisas y protección adecuada de los equipos.'
            : 'Transformadores para instrumentos são equipamentos essenciais para medição, proteção e controle de sistemas elétricos. Nossos transformadores de potencial (TP) e transformadores de corrente (TC) são fabricados com alta precisão e confiabilidade, garantindo medições precisas e proteção adequada dos equipamentos.'}
        </p>
      </div>
      <p className={styles.escolha}>{textos.escolha}</p>
    </div>
  )
}
