import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zilmer Transformadores',
  icons: {
    icon: '/favicon.png',
  },
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
