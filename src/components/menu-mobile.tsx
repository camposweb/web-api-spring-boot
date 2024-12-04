import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { NavLink } from './nav-link'
import { useState } from 'react'

export function MenuMobile() {
  const [isOpenSheet, setIsOpenSheet] = useState(false)

  function handleOpenSheet() {
    setIsOpenSheet(false)
  }

  return (
    <div className="md:hidden">
      <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
        <SheetTrigger asChild>
          <Button className="flex items-center justify-center bg-slate-200 hover:bg-slate-200 active:bg-slate-200">
            <Menu className="text-black" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className="sr-only">Menu</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <NavLink href={'/'} onClick={handleOpenSheet}>
              Home
            </NavLink>
            <NavLink href={'/uf'} onClick={handleOpenSheet}>
              Estado
            </NavLink>
            <NavLink href={'/municipio'} onClick={handleOpenSheet}>
              Município
            </NavLink>
            <NavLink href={'/bairro'} onClick={handleOpenSheet}>
              Bairro
            </NavLink>
            <NavLink href={'/pessoa'} onClick={handleOpenSheet}>
              Pessoa
            </NavLink>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
