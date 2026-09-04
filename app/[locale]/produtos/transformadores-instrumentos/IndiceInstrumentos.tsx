'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import styles from './IndiceInstrumentos.module.css'
import { modelosInstrumentos, TIPOS, USOS, CLASSES, type Tipo, type Uso } from './instrumentos-data'
import { tipoLabel, usoLabel, classeLabel, t } from './instrumentos-labels'

const BASE = '/produtos/transformadores-instrumentos'

function contar(tipo: Tipo, uso: Uso, classe: string) {
  return modelosInstrumentos.filter((m) => m.tipo === tipo && m.uso === uso && m.classe === classe).length
}

// O site roda com trailingSlash:true (next.config.js), então usePathname()
// sempre devolve o caminho com "/" no final — sem normalizar isso aqui, a
// comparação com os hrefs (montados sem barra final) nunca bate e o item
// ativo nunca fica destacado.
function semBarraFinal(caminho: string) {
  return caminho.length > 1 ? caminho.replace(/\/$/, '') : caminho
}

export default function IndiceInstrumentos() {
  const locale = useLocale()
  const pathname = semBarraFinal(usePathname())
  const textos = t(locale)

  return (
    <nav className={styles.indice} aria-label={textos.indiceAriaLabel}>
      <Link href={BASE} className={`${styles.raiz} ${pathname === BASE ? styles.raizAtiva : ''}`}>
        {textos.todasCategorias}
      </Link>

      {TIPOS.map((tipo) => (
        <div key={tipo} className={styles.grupoTipo}>
          <span className={styles.tituloTipo}>{tipoLabel(tipo, locale)}</span>

          {USOS.map((uso) => (
            <div key={uso} className={styles.grupoUso}>
              <span className={styles.tituloUso}>{usoLabel(uso, locale)}</span>

              <ul className={styles.listaClasses}>
                {CLASSES.map((classe) => {
                  const total = contar(tipo, uso, classe)
                  const href = `${BASE}/${tipo}/${uso}/${classe}`
                  const ativo = pathname === href

                  if (total === 0) {
                    // Sem modelo cadastrado ainda — mostra na árvore para dar
                    // visão completa do catálogo, mas não linka para uma
                    // página vazia (mesmo critério já usado em outras listagens
                    // do site: setor sem conteúdo não vira link).
                    return (
                      <li key={classe} className={styles.itemVazio}>
                        {classeLabel(classe, locale)}
                      </li>
                    )
                  }

                  return (
                    <li key={classe}>
                      <Link
                        href={href}
                        className={`${styles.itemClasse} ${ativo ? styles.itemAtivo : ''}`}
                      >
                        {classeLabel(classe, locale)}
                        <span className={styles.contagem}>{total}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}
