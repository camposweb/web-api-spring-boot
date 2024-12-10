'use client'
import { ConfirmDeleteBairro } from '@/components/bairro/confirm-delete-bairro'
import { EditBairro } from '@/components/bairro/edit-bairro'
import { GetBairroFilter } from '@/components/bairro/get-bairro-filter'
import { SaveBairro } from '@/components/bairro/save-bairro'
import { EmptyData } from '@/components/empty-data'
import { LoadingTable } from '@/components/loading-table'
import { PaginationTable } from '@/components/pagination-table'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListarBairros } from '@/http/generated/bairro/bairro'
import { useListarMunicipios } from '@/http/generated/municipio/municipio'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Bairro() {
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const filters = {
    codigoBairro: searchParams.get('codigoBairro')
      ? Number(searchParams.get('codigoBairro'))
      : undefined,
    codigoMunicipio: searchParams.get('codigoMunicipio')
      ? Number(searchParams.get('codigoMunicipio'))
      : undefined,
    nome: searchParams.get('nome') || undefined,
    status: (() => {
      const statusParam = searchParams.get('status')
      if (statusParam === '1') return 1
      if (statusParam === '2') return 2
      return undefined
    })(),
  }

  const { data: bairros, isLoading } = useListarBairros(filters, {
    query: {
      queryKey: ['bairros', filters],
    },
  })

  const { data: municipios } = useListarMunicipios(
    {},
    {
      query: {
        queryKey: ['municipios'],
      },
    },
  )

  const items = bairros?.data || []
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

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">Bairro</h1>
      <SaveBairro />
      <div className="space-y-3">
        <GetBairroFilter />

        {isLoading === true ? (
          <LoadingTable />
        ) : (
          <>
            {bairros && bairros.data.length > 0 ? (
              <div className="rounded-md border">
                <Table className="">
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="font-bold text-black">
                        Código Bairro
                      </TableHead>
                      <TableHead className="font-bold text-black">
                        Código Município
                      </TableHead>
                      <TableHead className="font-bold text-black">
                        Município
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
                      paginateditems.map((bairro) => (
                        <TableRow key={bairro.codigoBairro}>
                          <TableCell className="items-center justify-center">
                            {bairro.codigoBairro}
                          </TableCell>
                          <TableCell className="items-center justify-center">
                            {bairro.codigoMunicipio}
                          </TableCell>
                          <TableCell className="items-center justify-center">
                            {municipios?.data
                              .filter(
                                (municipio) =>
                                  municipio.codigoMunicipio ===
                                  bairro.codigoMunicipio,
                              )
                              .map((municipio) => municipio.nome)}
                          </TableCell>
                          <TableCell>{bairro.nome}</TableCell>
                          <TableCell>
                            {bairro.status === 1 ? (
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
                            <EditBairro
                              codigoBairro={bairro.codigoBairro as number}
                              codigoMunicipio={bairro.codigoMunicipio as number}
                              nome={bairro.nome as string}
                              status={bairro.status as number}
                            />
                            <ConfirmDeleteBairro
                              codigo={bairro.codigoBairro as number}
                              nome={bairro.nome as string}
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
        {bairros && bairros.data.length > 0 ? (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={bairros.data.length}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
