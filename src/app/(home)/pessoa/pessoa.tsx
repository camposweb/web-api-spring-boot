'use client'
import { EmptyData } from '@/components/empty-data'
import { PaginationTable } from '@/components/pagination-table'
import { ConfirmDeletePessoa } from '@/components/pessoa/confirm-delete-pessoa'
import { EditPessoa } from '@/components/pessoa/edit-pessoa'
import { GetPessoaFilter } from '@/components/pessoa/get-pessoa-filter'
import { SavePessoa } from '@/components/pessoa/save-pessoa'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListarPessoas } from '@/http/generated/pessoa/pessoa'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Loading from '../uf/loading'
import { DetailPessoa } from '@/components/pessoa/detail-pessoa'

export default function Pessoa() {
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const filters = {
    login: searchParams.get('login') || undefined,
    codigoPessoa: searchParams.get('codigoPessoa')
      ? Number(searchParams.get('codigoPessoa'))
      : undefined,
    status: (() => {
      const statusParam = searchParams.get('status')
      if (statusParam === '1') return 1
      if (statusParam === '2') return 2
      return undefined
    })(),
  }

  const { data: pessoas, isLoading } = useListarPessoas(filters, {
    query: {
      queryKey: ['pessoas', filters],
    },
  })

  const items = pessoas?.data || []
  const totalPages = Math.ceil(items.length / pageSize)

  const paginateditems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const pathname = usePathname() // Monitorando o caminho da URL

  // Limpa o cache quando a página mudar
  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ['bairros-filters'],
    })
    queryClient.refetchQueries({
      queryKey: ['bairros'],
    })
  }, [pathname, queryClient])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">Pessoa</h1>
      <SavePessoa />
      <div className="space-y-3">
        <GetPessoaFilter />
        <div className="rounded-md border">
          {pessoas && pessoas.data.length > 0 ? (
            <Table className="">
              <TableHeader className="">
                <TableRow>
                  <TableHead className="font-bold text-black">
                    Código Pessoa
                  </TableHead>
                  <TableHead className="font-bold text-black">Nome</TableHead>
                  <TableHead className="font-bold text-black">
                    Sobrenome
                  </TableHead>
                  <TableHead className="font-bold text-black">Idade</TableHead>
                  <TableHead className="font-bold text-black">Login</TableHead>
                  <TableHead className="font-bold text-black">Senha</TableHead>
                  <TableHead className="font-bold text-black">Status</TableHead>
                  <TableHead className="font-bold text-black">
                    Detalhamento Pessoa
                  </TableHead>
                  <TableHead className="text-right font-bold text-black">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginateditems &&
                  paginateditems.map((pessoa) => (
                    <TableRow key={pessoa.codigoPessoa}>
                      <TableCell className="items-center justify-center">
                        {pessoa.codigoPessoa}
                      </TableCell>
                      <TableCell className="items-center justify-center">
                        {pessoa.nome}
                      </TableCell>
                      <TableCell>{pessoa.sobrenome}</TableCell>
                      <TableCell>{pessoa.idade}</TableCell>
                      <TableCell>{pessoa.login}</TableCell>
                      <TableCell>{pessoa.senha}</TableCell>
                      <TableCell>
                        {pessoa.status === 1 ? (
                          <Badge className="bg-green-500 hover:bg-green-500">
                            ATIVADO
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="hover:bg-red-600"
                          >
                            DESATIVADO
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DetailPessoa
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          codigoPessoa={pessoa.codigoPessoa as number}
                          nome={pessoa.nome as string}
                          sobrenome={pessoa.sobrenome as string}
                          idade={pessoa.idade as number}
                          login={pessoa.login as string}
                          senha={pessoa.senha as string}
                          status={pessoa.status as number}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          enderecos={pessoa.enderecos as any}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end gap-4 text-left">
                        <EditPessoa
                          codigoPessoa={pessoa.codigoPessoa as number}
                          nome={pessoa.nome as string}
                          sobrenome={pessoa.sobrenome as string}
                          idade={pessoa.idade as number}
                          login={pessoa.login as string}
                          senha={pessoa.senha as string}
                          status={pessoa.status as number}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          enderecos={pessoa.enderecos as any}
                        />
                        <ConfirmDeletePessoa
                          codigo={pessoa.codigoPessoa as number}
                          nome={pessoa.nome as string}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyData />
          )}
        </div>
        {pessoas && pessoas.data.length > 0 ? (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={pessoas.data.length}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
