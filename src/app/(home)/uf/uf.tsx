'use client'
import { EmptyData } from '@/components/empty-data'
import { LoadingTable } from '@/components/loading-table'
import { PaginationTable } from '@/components/pagination-table'
import { ConfirmDeleteUf } from '@/components/uf/confirm-delete-uf'
import { EditUf } from '@/components/uf/edit-uf'
import { GetUfFilter } from '@/components/uf/get-uf-filter'
import { SaveUf } from '@/components/uf/save-uf'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListarUfs } from '@/http/generated/uf/uf'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Uf() {
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const filters = {
    codigoUf: searchParams.get('codigoUf')
      ? Number(searchParams.get('codigoUf'))
      : undefined,
    sigla: searchParams.get('sigla') || undefined,
    nome: searchParams.get('nome') || undefined,
    status: (() => {
      const statusParam = searchParams.get('status')
      if (statusParam === '1') return 1
      if (statusParam === '2') return 2
      return undefined
    })(),
  }
  const { data: ufs, isLoading } = useListarUfs(filters, {
    query: { queryKey: ['ufs', filters] },
  })

  const items = ufs?.data || []
  const totalPages = Math.ceil(items.length / pageSize)

  const paginateditems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const pathname = usePathname() // Monitorando o caminho da URL

  // Limpa o cache quando a página mudar
  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ['ufs-filters'],
    })
    queryClient.refetchQueries({
      queryKey: ['ufs'],
    })
  }, [pathname, queryClient])

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">UF</h1>
      <SaveUf />

      <div className="space-y-3">
        <GetUfFilter />

        {isLoading === true ? (
          <LoadingTable />
        ) : (
          <>
            {ufs && ufs.data.length > 0 ? (
              <div className="rounded-md border">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-30 font-bold text-black">
                        Código
                      </TableHead>
                      <TableHead className="font-bold text-black">
                        Sigla
                      </TableHead>
                      <TableHead className="font-bold text-black">
                        Nome
                      </TableHead>
                      <TableHead className="font-bold text-black">
                        Status
                      </TableHead>
                      <TableHead className="text-right font-bold text-black">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginateditems &&
                      paginateditems.map((uf) => (
                        <TableRow key={uf.codigoUf}>
                          <TableCell className="items-center justify-center">
                            {uf.codigoUf}
                          </TableCell>
                          <TableCell>{uf.sigla}</TableCell>
                          <TableCell>{uf.nome}</TableCell>
                          <TableCell>
                            {uf.status === 1 ? (
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
                          <TableCell className="flex justify-end gap-4 text-left">
                            <EditUf
                              codigoUf={uf.codigoUf}
                              siglaUf={uf.sigla}
                              nomeUf={uf.nome}
                              statusUf={uf.status}
                            />
                            <ConfirmDeleteUf
                              codigo={uf.codigoUf as number}
                              nome={uf.nome as string}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyData />
            )}
          </>
        )}
        {ufs && ufs.data.length > 0 ? (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={ufs.data.length}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
