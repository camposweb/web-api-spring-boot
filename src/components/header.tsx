'use client'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

import { NavLink } from './nav-link'

export function Header() {
  return (
    <header className="flex items-center gap-4 p-4 text-black">
      <Link href={'/'}>
        <h1 className="text-2xl font-bold">Web SpringBoot</h1>
      </Link>
      <Separator orientation="vertical" className="h-12 bg-black" />
      <nav className="flex items-center space-x-6 font-bold">
        <NavLink href={'/'} className="h-4 w-4">
          Home
        </NavLink>
        <NavLink href={'/uf'} className="h-4 w-4">
          Estado
        </NavLink>
        <NavLink href={'/municipio'} className="h-4 w-4">
          Município
        </NavLink>
        <NavLink href={'/bairro'} className="h-4 w-4">
          Bairro
        </NavLink>
        <NavLink href={'/pessoa'} className="h-4 w-4">
          Pessoa
        </NavLink>
      </nav>
    </header>
  )
}
