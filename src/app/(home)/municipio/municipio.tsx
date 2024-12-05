'use client'

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
import { useState } from 'react'

export default function Municipio() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // const queryClient = useQueryClient()

  const { data: municipios } = useListarMunicipios(
    {},
    {
      query: { queryKey: ['municipios'] },
    },
  )

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

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">Município</h1>

      <div className="space-y-3">
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-30 font-bold text-black">
                  Código
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
                      {ufs?.data
                        .filter((uf) => uf.codigoUf === municipio.codigoUf)
                        .map((uf) => uf.sigla)}
                      {/* {municipio.codigoUf} */}
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
                      {/* <EditUf
                        codigoUf={municipio.codigoUf}
                        siglaUf={municipio.sigla}
                        nomeUf={municipio.nome}
                        statusUf={municipio.status}
                      />
                      <ConfirmDelete
                        codigo={municipio.codigoUf as number}
                        nome={municipio.nome as string}
                      /> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {municipios && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={municipios.data.length}
          />
        )}
      </div>
    </div>
  )
}
