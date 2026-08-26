'use client'

import { useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import ContactButton from '@/components/ContactButton'
import styles from './page.module.css'

import dataPt from '@/data/projetos-entregues.json'
import dataEn from '@/data/projetos-entregues.en.json'
import dataEs from '@/data/projetos-entregues.es.json'

import setoresPt from '@/data/projetos-setores.json'
import setoresEn from '@/data/projetos-setores.en.json'
import setoresEs from '@/data/projetos-setores.es.json'

type Projeto = {
  // Nome da obra (ex: "UHE Monte Carlo"). Opcional: nem todo projeto tem um
  // empreendimento nomeado — quando falta, o local assume o papel de título.
  obra?: string
  // Orientação das fotos do projeto: define a moldura da galeria.
  // Ausente = paisagem.
  proporcao?: 'retrato' | 'paisagem'
  parceiros: string[]
  local: string
  setor: string
  ano: string
  resumoCard: string
  descricao: string
  especificacoes: string[]
  normas: string[]
  imagemCapa: string
  imagens: string[]
}

type Setor = {
  titulo: string
  imagemCapa: string
}

type ProjetosData = { [slug: string]: Projeto }
type SetoresData = { [slug: string]: Setor }

export default function ProjetoEntregueDetalhe({
  params,
}: {
  params: { setor: string; projeto: string }
}) {
  const locale = useLocale()
  const data = (
    locale === 'en' ? dataEn : locale === 'es' ? dataEs : dataPt
  ) as ProjetosData

  const setores = (
    locale === 'en' ? setoresEn : locale === 'es' ? setoresEs : setoresPt
  ) as SetoresData

  const projeto = data[params.projeto]
  const [indiceAtual, setIndiceAtual] = useState(0)

  // O projeto tem que existir E pertencer ao setor da URL — senão o mesmo
  // projeto responderia sob qualquer setor, com um "voltar" mentiroso.
  if (!projeto || projeto.setor !== params.setor) notFound()

  const setor = setores[projeto.setor]
  const titulo = projeto.obra || projeto.local

  const imagens = projeto.imagens.length ? projeto.imagens : [projeto.imagemCapa]
  const temVariasImagens = imagens.length > 1

  const t = {
    ano: locale === 'en' ? 'Year' : locale === 'es' ? 'Año' : 'Ano',
    local: locale === 'en' ? 'Location' : locale === 'es' ? 'Ubicación' : 'Local',
    setor: locale === 'en' ? 'Sector' : locale === 'es' ? 'Sector' : 'Setor',
    parceiros: locale === 'en' ? 'Partners' : locale === 'es' ? 'Socios' : 'Parceiros',
    especificacoes:
      locale === 'en' ? 'Technical specifications' : locale === 'es' ? 'Especificaciones técnicas' : 'Especificações técnicas',
    normas: locale === 'en' ? 'Standards applied' : locale === 'es' ? 'Normas aplicadas' : 'Normas aplicadas',
    ctaTitle:
      locale === 'en'
        ? 'Need a solution like this one?'
        : locale === 'es'
        ? '¿Necesita una solución como esta?'
        : 'Precisa de uma solução como esta?',
    foto: locale === 'en' ? 'photo' : locale === 'es' ? 'foto' : 'foto',
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          {/* Volta para o setor de onde se veio, nomeando-o — "todos os
              projetos" seria mentira, já que o destino é só este setor. */}
          <Link href={`/projetos-entregues/${params.setor}`} className={styles.voltar}>
            ← {setor?.titulo ?? ''}
          </Link>

          <h1 className={styles.titulo}>{titulo}</h1>

          <div className={styles.metaRow}>
            {/* Só entra na linha de dados quando não é o título — senão o
                local apareceria duas vezes na mesma dobra. */}
            {projeto.obra && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{t.local}</span>
                <span className={styles.metaValue}>{projeto.local}</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t.setor}</span>
              <span className={styles.metaValue}>{setor?.titulo ?? ''}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t.ano}</span>
              <span className={styles.metaValue}>{projeto.ano}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.corpo}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.galeria}>
              <div
                className={`${styles.imageWrapper} ${
                  projeto.proporcao === 'retrato' ? styles.retrato : styles.paisagem
                }`}
              >
                <Image
                  src={imagens[indiceAtual]}
                  alt={`${titulo} — ${t.foto} ${indiceAtual + 1}`}
                  fill
                  className={styles.imagem}
                  sizes="(max-width: 968px) 100vw, 55vw"
                  priority
                />

                {temVariasImagens && (
                  <>
                    <button
                      className={styles.setaEsquerda}
                      onClick={() => setIndiceAtual((p) => (p - 1 + imagens.length) % imagens.length)}
                      aria-label={locale === 'en' ? 'Previous image' : locale === 'es' ? 'Imagen anterior' : 'Imagem anterior'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      className={styles.setaDireita}
                      onClick={() => setIndiceAtual((p) => (p + 1) % imagens.length)}
                      aria-label={locale === 'en' ? 'Next image' : locale === 'es' ? 'Imagen siguiente' : 'Próxima imagem'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    <div className={styles.indicadores}>
                      {imagens.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.ponto} ${i === indiceAtual ? styles.pontoAtivo : ''}`}
                          onClick={() => setIndiceAtual(i)}
                          aria-label={`${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {projeto.parceiros?.length > 0 && (
                <div className={styles.parceirosBox}>
                  <span className={styles.metaLabel}>{t.parceiros}</span>
                  <p className={styles.parceirosTexto}>{projeto.parceiros.join(' · ')}</p>
                </div>
              )}
            </div>

            <div className={styles.conteudo}>
              {projeto.descricao.split('\n\n').map((paragrafo, i) => (
                <p key={i} className={styles.paragrafo}>
                  {paragrafo}
                </p>
              ))}

              {projeto.especificacoes?.length > 0 && (
                <div className={styles.bloco}>
                  <h2 className={styles.blocoTitulo}>{t.especificacoes}</h2>
                  <ul className={styles.listaEspecs}>
                    {projeto.especificacoes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {projeto.normas?.length > 0 && (
                <div className={styles.bloco}>
                  <h2 className={styles.blocoTitulo}>{t.normas}</h2>
                  <div className={styles.tagRow}>
                    {projeto.normas.map((norma, i) => (
                      <span key={i} className={styles.tag}>
                        {norma}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitulo}>{t.ctaTitle}</h2>
          <ContactButton />
        </div>
      </section>
    </div>
  )
}
