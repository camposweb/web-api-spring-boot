import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

type NavLinkProps = ComponentProps<'a'> & LinkProps

export function NavLink({ ...props }: NavLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      {...props}
      data-active={pathname === props.href}
      className="flex items-center justify-center gap-1.5 rounded-md p-2 font-roboto text-xl font-medium text-primary transition hover:bg-primary hover:text-white data-[active=true]:bg-primary data-[active=true]:text-white"
    />
  )
}
