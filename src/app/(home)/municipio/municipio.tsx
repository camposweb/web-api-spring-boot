'use client'
import { LoadingTable } from '@/components/loading-table'
import { ConfirmDeleteMunicipio } from '@/components/municipio/confirm-delete-municipio'
import { EditMunicipio } from '@/components/municipio/edit-municipio'
import { GetMunicipioFilter } from '@/components/municipio/get-municipio-filter'
import { SaveMunicipio } from '@/components/municipio/save-municipio'
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
import { useListarMunicipios } from '@/http/generated/municipio/municipio'
import { useListarUfs } from '@/http/generated/uf/uf'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Municipio() {
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const filters = {
    codigoMunicipio: searchParams.get('codigoMunicipio')
      ? Number(searchParams.get('codigoMunicipio'))
      : undefined,
    codigoUf: searchParams.get('codigoUf')
      ? Number(searchParams.get('codigoUf'))
      : undefined,
    nome: searchParams.get('nome') || undefined,
    status: (() => {
      const statusParam = searchParams.get('status')
      if (statusParam === '1') return 1
      if (statusParam === '2') return 2
      return undefined
    })(),
  }

  const { data: municipios, isLoading } = useListarMunicipios(filters, {
    query: { queryKey: ['municipios', filters] },
  })

  const { data: ufs } = useListarUfs(
    {},
    {
      query: { queryKey: ['ufs'] },
    },
  )

  const items = municipios?.data || []
  const totalPages = Math.ceil(items.length / pageSize)

  const paginateditems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const pathname = usePathname() // Monitorando o caminho da URL

  // Limpa o cache quando a página mudar
  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ['municipios-filters'],
    })
    queryClient.refetchQueries({
      queryKey: ['municipios'],
    })
  }, [pathname, queryClient])

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">Município</h1>

      <SaveMunicipio />

      <div className="space-y-3">
        <GetMunicipioFilter />

        {isLoading === true ? (
          <LoadingTable />
        ) : (
          <div className="rounded-md border">
            <Table className="">
              <TableHeader className="">
                <TableRow>
                  <TableHead className="font-bold text-black">
                    Código Município
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Código UF
                  </TableHead>
                  <TableHead className="font-bold text-black">UF</TableHead>
                  <TableHead className="font-bold text-black">Nome</TableHead>
                  <TableHead className="font-bold text-black">Status</TableHead>
                  <TableHead className="text-right font-bold text-black">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginateditems &&
                  paginateditems.map((municipio) => (
                    <TableRow key={municipio.codigoMunicipio}>
                      <TableCell className="items-center justify-center">
                        {municipio.codigoMunicipio}
                      </TableCell>
                      <TableCell className="items-center justify-center">
                        {municipio.codigoUf}
                      </TableCell>
                      <TableCell className="items-center justify-center">
                        {ufs?.data
                          .filter((uf) => uf.codigoUf === municipio.codigoUf)
                          .map((uf) => uf.sigla)}
                      </TableCell>
                      <TableCell>{municipio.nome}</TableCell>
                      <TableCell>
                        {municipio.status === 1 ? (
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
                        <EditMunicipio
                          codigoMunicipio={municipio.codigoMunicipio}
                          codigoUf={municipio.codigoUf}
                          nomeMunicipio={municipio.nome}
                          statusMunicipio={municipio.status}
                        />
                        <ConfirmDeleteMunicipio
                          codigo={municipio.codigoMunicipio as number}
                          nome={municipio.nome as string}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
        {municipios && municipios.data.length > 0 ? (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={municipios.data.length}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
