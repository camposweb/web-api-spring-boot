import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from './ReactQueryProvider'
import { Toaster } from '@/components/ui/toaster'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: {
    template: '%s |Web API Spring Boot',
    default: 'Web API Spring Boot',
  },
  description: 'Bootcamp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} antialiased`}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
