'use client'

import { useTranslations } from 'next-intl'
import styles from './page.module.css'

export default function ContatoPage() {
  const t = useTranslations('contact')
  
  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{t('title')}</h1>
        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <h3>{t('address')}</h3>
              <p>{t('addressValue')}</p>
              <p>{t('city')}</p>
              <p>{t('zipCode')}: {t('zipCodeValue')}</p>
            </div>

            <div className={styles.infoCard}>
              <h3>{t('phone')}</h3>
              <p><a href="tel:+551121487121">(11) 2148-7121</a></p>
            </div>

            <div className={styles.infoCard}>
              <h3>{t('email')}</h3>
              <p><a href="mailto:zilmer@zilmer.com.br">zilmer@zilmer.com.br</a></p>
              <p><a href="mailto:vendas@zilmer.com.br">vendas@zilmer.com.br</a></p>
              <p><a href="mailto:financeiro@zilmer.com.br">financeiro@zilmer.com.br</a></p>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>{t('sendMessage')}</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">{t('name')}</label>
                <input type="text" id="nome" name="nome" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">{t('emailField')}</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="telefone">{t('phoneField')}</label>
                <input type="tel" id="telefone" name="telefone" />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="assunto">{t('subject')}</label>
                <input type="text" id="assunto" name="assunto" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensagem">{t('message')}</label>
                <textarea id="mensagem" name="mensagem" rows={5} required></textarea>
              </div>

              <button type="submit" className="btn">
                {t('send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}






























