'use client'
import { ConfirmDeleteMunicipio } from '@/components/municipio/confirm-delete-municipio'
import { EditMunicipio } from '@/components/municipio/edit-municipio'
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

      <SaveMunicipio />

      <div className="space-y-3">
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
