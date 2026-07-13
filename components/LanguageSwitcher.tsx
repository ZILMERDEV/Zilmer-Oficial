'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useTransition } from 'react'
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggleLanguage = () => {
    const newLocale = locale === 'pt' ? 'en' : 'pt'
    
    startTransition(() => {
      // Get current pathname and switch locale
      // The router from next-intl handles locale switching automatically
      router.replace(pathname, { locale: newLocale } as any)
    })
  }

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageSwitcher}
      disabled={isPending}
      aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    >
      {locale === 'pt' ? 'EN' : 'PT'}
    </button>
  )
}

