import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Página não encontrada</p>
      <Link
        href={'/'}
        className="rounded-md bg-secondary p-2 hover:bg-foreground hover:text-secondary"
      >
        Clique aqui para retornar para a página principal
      </Link>
    </main>
  )
}
