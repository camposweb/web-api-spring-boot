'use client'
import { SaveBairro } from '@/components/bairro/save-bairro'
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
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Bairro() {
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const { data: bairros } = useListarBairros(
    {},
    {
      query: {
        queryKey: ['bairros'],
      },
    },
  )

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

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">Bairro</h1>
      <SaveBairro />
      <div className="space-y-3">
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
                <TableHead className="font-bold text-black">Nome</TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
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
                      {/* <EditMunicipio
                        codigoMunicipio={municipio.codigoMunicipio}
                        codigoUf={municipio.codigoUf}
                        nomeMunicipio={municipio.nome}
                        statusMunicipio={municipio.status}
                      />
                      <ConfirmDeleteMunicipio
                        codigo={municipio.codigoMunicipio as number}
                        nome={municipio.nome as string}
                      /> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {bairros && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={bairros.data.length}
          />
        )}
      </div>
    </div>
  )
}
