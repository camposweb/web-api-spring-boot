import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet'
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
          <Button className="bg-transparent hover:bg-transparent active:bg-transparent">
            <Menu className="flex text-black" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>Menu</SheetHeader>
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
