'use client'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

import { NavLink } from './nav-link'
import { MenuMobile } from './menu-mobile'

export function Header() {
  return (
    <header className="flex w-full items-center justify-between gap-4 p-4 text-black md:justify-normal">
      <Link href={'/'}>
        <h1 className="text-2xl font-bold">Web SpringBoot</h1>
      </Link>
      <Separator
        orientation="vertical"
        className="hidden h-12 bg-black md:flex"
      />
      <MenuMobile />
      <nav className="hidden items-center space-x-6 font-bold md:flex">
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
