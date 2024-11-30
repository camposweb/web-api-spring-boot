import { Header } from '@/components/header'
import { ReactNode } from 'react'

interface HomeProps {
  children: ReactNode
}

export default function HomeLayout({ children }: HomeProps) {
  return (
    <main className="px-4">
      <Header />
      {children}
    </main>
  )
}
