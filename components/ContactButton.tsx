'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import styles from './ContactButton.module.css'

export default function ContactButton() {
  const t = useTranslations('contact')
  
  return (
    <Link href="/contato" className={styles.contactButton}>
      {"TESTE final"}
    </Link>
  )
}




















