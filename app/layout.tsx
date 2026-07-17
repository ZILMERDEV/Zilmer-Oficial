import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Zilmer Transformadores',
  icons: {
    icon: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Root layout - minimal layout for non-internationalized routes (api, admin)
// next-intl middleware handles all locale routing automatically
// All internationalized routes use app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
