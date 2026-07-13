'use client'

import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useTransition } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale } as any)
    })
  }

  const close = () => setIsMenuOpen(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/logoaba4.png" alt="Zilmer Transformadores" />
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" onClick={close}>
            {locale === 'en' ? 'HOME' : locale === 'es' ? 'INICIO' : 'INÍCIO'}
          </Link>

          <div
            className={styles.dropdown}
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <span>{locale === 'en' ? 'ABOUT' : locale === 'es' ? 'NOSOTROS' : 'Zilmer teste'}</span>
            {isAboutOpen && (
              <>
                <div className={styles.dropdownBridge}></div>
                <div className={styles.dropdownMenu}>
                  <Link href="/sobre" onClick={close}>
                    {locale === 'en' ? 'ABOUT US' : locale === 'es' ? 'SOBRE NOSOTROS' : 'SOBRE NÓS'}
                  </Link>
                  <Link href="/sobre/historico" onClick={close}>
                    {locale === 'en' ? 'HISTORY' : locale === 'es' ? 'HISTÓRICO' : 'HISTÓRICO'}
                  </Link>
                  <Link href="/sobre/clientes" onClick={close}>
                    {locale === 'en' ? 'CLIENTS' : locale === 'es' ? 'CLIENTES' : 'CLIENTES'}
                  </Link>
                  <Link href="/sobre/certificados" onClick={close}>
                    {locale === 'en' ? 'CERTIFICATES' : locale === 'es' ? 'CERTIFICADOS' : 'CERTIFICADOS'}
                  </Link>
                </div>
              </>
            )}
          </div>

          <div
            className={styles.dropdown}
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <span>{locale === 'en' ? 'PRODUCTS' : locale === 'es' ? 'PRODUCTOS' : 'PRODUTOS'}</span>
            {isProductsOpen && (
              <>
                <div className={styles.dropdownBridge}></div>
                <div className={styles.dropdownMenu}>
                  <Link href="/produtos/transformadores-oleo" onClick={close}>
                    {locale === 'en' ? 'OIL-IMMERSED TRANSFORMERS' : locale === 'es' ? 'TRANSFORMADORES INMERSOS EN ACEITE' : 'TRANSFORMADORES IMERSOS EM ÓLEO'}
                  </Link>
                  <Link href="/produtos/transformadores-seco" onClick={close}>
                    {locale === 'en' ? 'DRY-TYPE TRANSFORMERS' : locale === 'es' ? 'TRANSFORMADORES TIPO SECO' : 'TRANSFORMADORES A SECO'}
                  </Link>
                  <Link href="/produtos/transformadores-instrumentos" onClick={close}>
                    {locale === 'en' ? 'INSTRUMENT TRANSFORMERS' : locale === 'es' ? 'TRANSFORMADORES PARA INSTRUMENTOS' : 'TRANSFORMADORES PARA INSTRUMENTOS'}
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link href="/contato" onClick={close}>
            {locale === 'en' ? 'CONTACT' : locale === 'es' ? 'CONTACTO' : 'CONTATO'}
          </Link>

          <div className={styles.langSwitcher}>
            {(['pt', 'en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                disabled={isPending || locale === l}
                className={`${styles.langBtn} ${locale === l ? styles.langBtnActive : ''}`}
              >
                {l === 'pt' ? '🇧🇷' : l === 'en' ? '🇺🇸' : '🇪🇸'}
              </button>
            ))}
          </div>
        </nav>

        <div className={styles.headerRight}>
          <div className={styles.langSwitcher}>
            {(['pt', 'en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                disabled={isPending || locale === l}
                className={`${styles.langBtn} ${locale === l ? styles.langBtnActive : ''}`}
              >
                {l === 'pt' ? '🇧🇷' : l === 'en' ? '🇺🇸' : '🇪🇸'}
              </button>
            ))}
          </div>

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

