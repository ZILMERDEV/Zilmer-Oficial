'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { cdnUrl } from '@/lib/assets'
import styles from './page.module.css'
import {
  modelosInstrumentos,
  TIPOS,
  USOS,
  CLASSES,
  type Tipo,
  type Uso,
  type Classe,
} from '../../../instrumentos-data'
import { tipoLabel, usoLabel, classeLabel, legenda, t } from '../../../instrumentos-labels'

export default function CategoriaInstrumentoPage({
  params,
}: {
  params: { tipo: string; uso: string; classe: string }
}) {
  const locale = useLocale()

  if (
    !TIPOS.includes(params.tipo as Tipo) ||
    !USOS.includes(params.uso as Uso) ||
    !CLASSES.includes(params.classe as Classe)
  ) {
    notFound()
  }

  const tipo = params.tipo as Tipo
  const uso = params.uso as Uso
  const classe = params.classe as Classe

  const modelos = modelosInstrumentos.filter(
    (m) => m.tipo === tipo && m.uso === uso && m.classe === classe
  )

  const textos = t(locale)

  return (
    <div>
      <Link href="/produtos/transformadores-instrumentos" className={styles.voltar}>
        {textos.voltar}
      </Link>

      <h1 className={styles.titulo}>
        {tipoLabel(tipo, locale)} — {usoLabel(uso, locale)} — {classeLabel(classe, locale)}
      </h1>

      <p className={styles.legenda}>{legenda(tipo, uso, locale)}</p>

      {modelos.length === 0 ? (
        <p className={styles.vazio}>{textos.semModelos}</p>
      ) : (
        <div className={styles.modelsGallery}>
          {modelos.map((model) => (
            <a
              key={model.id}
              href={cdnUrl(model.pdf)}
              className={styles.modelCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.modelImageContainer}>
                <Image
                  src={cdnUrl(model.image)}
                  alt={`${textos.modelo} ${model.name}`}
                  width={200}
                  height={200}
                  className={styles.modelImage}
                />
              </div>
              <div className={styles.modelName}>{model.name}</div>
              <div className={styles.pdfBadge}>{textos.pdf}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
