import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Web API Spring Boot',
  description: 'Bootcamp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
