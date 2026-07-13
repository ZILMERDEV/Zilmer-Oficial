import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  
  return {
    title: locale === 'en'
      ? 'Zilmer Transformers'
      : 'Zilmer Transformadores',
    description: locale === 'en'
      ? 'High-quality transformers - Oil-immersed transformers, dry-type transformers and instrument transformers'
      : locale === 'es'
      ? 'Transformadores de alta calidad - Transformadores inmersos en aceite, transformadores tipo seco y transformadores para instrumentos'
      : 'Transformadores de alta qualidade - Transformadores imersos em óleo, transformadores a seco e transformadores para instrumentos',
    icons: {
      icon: '/favicon.png',
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main style={{ minHeight: '100vh', paddingTop: '76px' }}>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

