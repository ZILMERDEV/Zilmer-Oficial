'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <Link href="/">
              <Image
                src="/logoaba4.png"
                alt="Zilmer Transformadores"
                width={200}
                height={80}
                className={styles.logo}
              />
            </Link>
          </div>

          <div className={styles.section}>
            <h3>{t('contact')}</h3>
            <p><strong>{t('address')}:</strong> Rua São João Clímaco, 315 - São Paulo, SP</p>
            <p><strong>{t('zipCode')}:</strong> 04255-000</p>
            <p><strong>{t('phone')}:</strong> <a href="tel:+551121487121">(11) 2148-7121</a></p>
          </div>

          <div className={styles.section}>
            <h3>{t('email')}</h3>
            <p><a href="mailto:zilmer@zilmer.com.br">zilmer@zilmer.com.br</a></p>
            <p><a href="mailto:vendas@zilmer.com.br">vendas@zilmer.com.br</a></p>
            <p><a href="mailto:financeiro@zilmer.com.br">financeiro@zilmer.com.br</a></p>
          </div>

          <div className={styles.section}>
            <h3>{t('socialMedia')}</h3>
            <div className={styles.socialLinks}>
              <a 
                href="https://www.linkedin.com/company/zilmer.transformadores/about/?viewAsMember=true" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Zilmer Transformadores. {t('allRightsReserved')}.</p>
          <p className={styles.companyInfo}>{tCommon('companyInfo')}</p>
        </div>
      </div>
    </footer>
  )
}
