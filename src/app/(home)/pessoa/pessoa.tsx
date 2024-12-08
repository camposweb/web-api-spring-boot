'use client'
import { PaginationTable } from '@/components/pagination-table'
import { ConfirmDeletePessoa } from '@/components/pessoa/confirm-delete-pessoa'
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
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Pessoa() {
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const { data: pessoas } = useListarPessoas(
    {},
    {
      query: {
        queryKey: ['pessoas'],
      },
    },
  )

  const items = pessoas?.data || []
  const totalPages = Math.ceil(items.length / pageSize)

  const paginateditems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <div className="mb-10 flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-2xl font-bold text-black">Pessoa</h1>
      <div className="space-y-3">
        <div className="rounded-md border">
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
                    {/* <TableCell className="items-center justify-center">
                      {municipios?.data
                        .filter(
                          (municipio) =>
                            municipio.codigoMunicipio ===
                            bairro.codigoMunicipio,
                        )
                        .map((municipio) => municipio.nome)}
                    </TableCell> */}
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
                    <TableCell className="flex justify-end gap-4 text-left">
                      {/* <EditBairro
                        codigoBairro={bairro.codigoBairro as number}
                        codigoMunicipio={bairro.codigoMunicipio as number}
                        nome={bairro.nome as string}
                        status={bairro.status as number}
                      /> */}
                      <ConfirmDeletePessoa
                        codigo={pessoa.codigoPessoa as number}
                        nome={pessoa.nome as string}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {pessoas && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={pessoas.data.length}
          />
        )}
      </div>
    </div>
  )
}
